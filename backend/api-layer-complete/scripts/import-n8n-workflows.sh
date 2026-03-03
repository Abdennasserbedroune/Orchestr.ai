#!/usr/bin/env bash
# ============================================================
# import-n8n-workflows.sh
# Copies ALL 1032 n8n workflow JSONs from Zie619/n8n-workflows
# directly into this repo under workflows/n8n/ and generates
# a full metadata catalog at workflows/n8n/catalog/index.json
#
# Usage (run from repo root):
#   chmod +x backend/api-layer-complete/scripts/import-n8n-workflows.sh
#   bash backend/api-layer-complete/scripts/import-n8n-workflows.sh
# ============================================================

set -euo pipefail

SOURCE_REPO="https://github.com/Zie619/n8n-workflows.git"
TARGET_DIR="backend/api-layer-complete/workflows/n8n"
TMP_DIR="/tmp/n8n-workflows-source-$$"

echo "[1/5] Cloning source repo (shallow)..."
git clone --depth 1 "$SOURCE_REPO" "$TMP_DIR"

echo "[2/5] Creating target directory structure..."
mkdir -p "${TARGET_DIR}/workflows"
mkdir -p "${TARGET_DIR}/catalog"

echo "[3/5] Copying all workflow JSON files..."
cp -r "${TMP_DIR}/workflows/"* "${TARGET_DIR}/workflows/"

TOTAL=$(find "${TARGET_DIR}/workflows" -name "*.json" | wc -l)
echo "     -> Copied ${TOTAL} workflow files"

echo "[4/5] Generating metadata catalog..."
node backend/api-layer-complete/scripts/generate-catalog.mjs "${TARGET_DIR}"

echo "[5/5] Cleaning up temp clone..."
rm -rf "$TMP_DIR"

echo ""
echo "✅ Done! ${TOTAL} workflows imported to ${TARGET_DIR}/workflows/"
echo "   Catalog: ${TARGET_DIR}/catalog/index.json"
echo ""
echo "Commit with:"
echo "  git add ${TARGET_DIR}"
echo "  git commit -m 'feat: import ${TOTAL} n8n workflows with metadata catalog'"
echo "  git push origin backend/api-layer-complete"
