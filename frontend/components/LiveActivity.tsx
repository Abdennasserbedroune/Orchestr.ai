import { MOCK_ACTIVITY, DOMAIN_META } from '@/lib/mock-data'

export function LiveActivity() {
  return (
    <div className="card overflow-hidden">
      {MOCK_ACTIVITY.map((item, i) => {
        const meta = DOMAIN_META[item.domain]
        const Icon = meta.icon
        const isLast = i === MOCK_ACTIVITY.length - 1

        return (
          <div
            key={item.id}
            className={`
              flex items-center gap-4 px-5 py-4
              hover:bg-panel transition-colors duration-150
              ${!isLast ? 'border-b border-border' : ''}
            `}
          >
            {/* Domain icon node */}
            <div
              className="icon-node w-7 h-7 flex-shrink-0"
              style={{ background: meta.bg, borderColor: `${meta.color}50` }}
            >
              <Icon size={12} style={{ color: meta.color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug truncate">{item.action}</p>
              <p className="text-2xs text-muted font-mono mt-0.5 uppercase tracking-wider">
                {item.agentName}
              </p>
            </div>

            {/* Timestamp */}
            <span className="text-2xs text-subtle font-mono flex-shrink-0 pl-4 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default LiveActivity
