'use client'

import { WuEntry } from '@/lib/types'

interface StatsProps {
  entries: WuEntry[]
}

export default function Stats({ entries }: StatsProps) {
  const totalWu = entries.length
  const totalChars = entries.reduce((sum, w) => sum + w.content.length, 0)
  const avgChars = totalWu > 0 ? Math.round(totalChars / totalWu) : 0

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="border border-terminal-dim/30 rounded p-3">
        <div className="text-2xl text-terminal-fg glow">{totalWu}</div>
        <div className="text-terminal-dim text-xs">总悟数</div>
      </div>
      <div className="border border-terminal-dim/30 rounded p-3">
        <div className="text-2xl text-terminal-accent">{totalChars}</div>
        <div className="text-terminal-dim text-xs">总字数</div>
      </div>
      <div className="border border-terminal-dim/30 rounded p-3">
        <div className="text-2xl text-terminal-warning">{avgChars}</div>
        <div className="text-terminal-dim text-xs">平均字数</div>
      </div>
    </div>
  )
}
