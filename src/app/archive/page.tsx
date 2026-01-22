import AsciiHeader from '@/components/AsciiHeader'
import Navigation from '@/components/Navigation'
import WuCard from '@/components/WuCard'
import { getAllWu } from '@/lib/wu-data'

export default function ArchivePage() {
  const allWu = getAllWu()

  // Group by month
  const groupedByMonth: Record<string, typeof allWu> = {}
  allWu.forEach((wu) => {
    const month = wu.date.substring(0, 7) // YYYY-MM
    if (!groupedByMonth[month]) {
      groupedByMonth[month] = []
    }
    groupedByMonth[month].push(wu)
  })

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <AsciiHeader />

      <Navigation />

      {/* Header */}
      <div className="mb-8">
        <div className="text-terminal-dim text-sm mb-2">
          <span className="text-terminal-accent">$</span> find /var/log/wu -name &quot;*.log&quot; | wc -l
        </div>
        <div className="text-terminal-fg text-2xl glow">
          {allWu.length} 悟
        </div>
      </div>

      {/* Archive List */}
      <div className="space-y-8">
        {Object.entries(groupedByMonth).map(([month, entries]) => (
          <section key={month}>
            <div className="sticky top-0 bg-terminal-bg/95 backdrop-blur py-2 mb-4 border-b border-terminal-dim/30">
              <h2 className="text-terminal-accent">
                <span className="text-terminal-fg">$</span> ls /var/log/wu/{month}/
              </h2>
            </div>
            <div className="space-y-4">
              {entries.map((wu) => (
                <WuCard key={wu.id} wu={wu} showFull={true} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty State */}
      {allWu.length === 0 && (
        <div className="text-center py-16">
          <div className="text-terminal-dim">
            <p>$ cat /dev/null</p>
            <p className="mt-4 text-terminal-warning">尚無悟語</p>
            <p className="mt-2">等待觀察世界中...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-terminal-dim/30 text-center text-terminal-dim text-xs">
        <p>悟 Terminal - Archive</p>
      </footer>
    </main>
  )
}
