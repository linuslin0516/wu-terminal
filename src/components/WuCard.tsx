'use client'

import { WuEntry } from '@/lib/types'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface WuCardProps {
  wu: WuEntry
  showFull?: boolean
}

export default function WuCard({ wu, showFull = false }: WuCardProps) {
  const formattedDate = format(new Date(wu.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })

  return (
    <article className="border border-terminal-dim/30 rounded-lg p-4 md:p-6 hover:border-terminal-fg/50 transition-all">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 pb-2 border-b border-terminal-dim/20">
        <div className="flex items-center gap-2">
          <span className="text-terminal-accent">$</span>
          <span className="text-terminal-dim text-sm">cat /var/log/wu/{wu.date}.log</span>
        </div>
        <time className="text-terminal-dim text-xs">{formattedDate}</time>
      </header>

      {/* Content */}
      <div className="mb-4">
        <p className="text-terminal-fg leading-relaxed text-base md:text-lg">
          {wu.content}
        </p>
      </div>

      {/* Sources */}
      {showFull && (
        <footer className="mt-6 pt-4 border-t border-terminal-dim/20">
          <div className="text-terminal-dim text-xs mb-2">
            <span className="text-terminal-accent">$</span> cat sources.txt
          </div>

          <div className="space-y-3 text-sm">
            {wu.sources.weibo && wu.sources.weibo.length > 0 && (
              <div>
                <span className="text-terminal-warning">[微博]</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {wu.sources.weibo.map((item, i) => (
                    <li key={i} className="text-terminal-dim">
                      <span className="text-terminal-fg/60">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {wu.sources.news && wu.sources.news.length > 0 && (
              <div>
                <span className="text-terminal-cyan">[新闻]</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {wu.sources.news.map((item, i) => (
                    <li key={i} className="text-terminal-dim">
                      <span className="text-terminal-fg/60">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {wu.sources.twitter && wu.sources.twitter.length > 0 && (
              <div>
                <span className="text-terminal-magenta">[Twitter]</span>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {wu.sources.twitter.map((item, i) => (
                    <li key={i} className="text-terminal-dim">
                      <span className="text-terminal-fg/60">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </footer>
      )}

      {/* ID */}
      <div className="mt-4 text-terminal-dim/50 text-xs">
        id: {wu.id}
      </div>
    </article>
  )
}
