#!/usr/bin/env node
/**
 * generate-catalog.mjs
 * Scans all workflow JSON files and produces:
 *   - catalog/index.json         (full flat catalog, all workflows)
 *   - catalog/by-category/       (one JSON per category)
 *   - catalog/stats.json         (counts per category + total)
 *
 * Usage: node generate-catalog.mjs <target-dir>
 *   e.g. node generate-catalog.mjs backend/api-layer-complete/workflows/n8n
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = process.argv[2] || path.join(__dirname, '..', 'workflows', 'n8n');

const workflowsDir = path.join(targetDir, 'workflows');
const catalogDir = path.join(targetDir, 'catalog');
const byCategoryDir = path.join(catalogDir, 'by-category');

fs.mkdirSync(byCategoryDir, { recursive: true });

const allWorkflows = [];
const byCategory = {};
const stats = { total: 0, categories: {} };

const categories = fs.readdirSync(workflowsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

for (const category of categories) {
  const catDir = path.join(workflowsDir, category);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json')).sort();

  byCategory[category] = [];
  stats.categories[category] = files.length;

  for (const file of files) {
    const filePath = path.join(catDir, file);
    let workflowData = {};

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      workflowData = JSON.parse(raw);
    } catch {
      console.warn(`  WARN: Could not parse ${file}, skipping metadata extraction`);
    }

    const entry = {
      id: file.replace('.json', ''),
      filename: file,
      category,
      path: `workflows/${category}/${file}`,
      name: workflowData.name || file.replace('.json', '').replace(/_/g, ' '),
      description: workflowData.description || '',
      tags: workflowData.tags || [],
      nodes: Array.isArray(workflowData.nodes)
        ? workflowData.nodes.map(n => ({
            type: n.type,
            name: n.name,
          }))
        : [],
      nodeTypes: Array.isArray(workflowData.nodes)
        ? [...new Set(workflowData.nodes.map(n => n.type))]
        : [],
      active: workflowData.active ?? false,
      createdAt: workflowData.createdAt || null,
      updatedAt: workflowData.updatedAt || null,
    };

    allWorkflows.push(entry);
    byCategory[category].push(entry);
    stats.total++;
  }

  fs.writeFileSync(
    path.join(byCategoryDir, `${category}.json`),
    JSON.stringify(byCategory[category], null, 2)
  );

  console.log(`  [${category}] ${files.length} workflows`);
}

fs.writeFileSync(
  path.join(catalogDir, 'index.json'),
  JSON.stringify(allWorkflows, null, 2)
);

fs.writeFileSync(
  path.join(catalogDir, 'stats.json'),
  JSON.stringify(stats, null, 2)
);

console.log(`\n✅ Catalog generated:`);
console.log(`   - ${catalogDir}/index.json         (${stats.total} entries)`);
console.log(`   - ${catalogDir}/by-category/*.json  (${categories.length} files)`);
console.log(`   - ${catalogDir}/stats.json`);
