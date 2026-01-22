import AsciiHeader from '@/components/AsciiHeader'
import Navigation from '@/components/Navigation'
import TerminalWindow from '@/components/TerminalWindow'
import WuCard from '@/components/WuCard'
import Stats from '@/components/Stats'
import { getAllWu, getLatestWu } from '@/lib/wu-data'
import Link from 'next/link'

export default function Home() {
  const latestWu = getLatestWu()
  const allWu = getAllWu()
  const recentWu = allWu.slice(0, 5)

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <AsciiHeader />

      <Navigation />

      {/* System Info */}
      <div className="mb-8 text-terminal-dim text-xs space-y-1">
        <div><span className="text-terminal-accent">$</span> uname -a</div>
        <div className="ml-4">WuTerminal v1.0.0 | 观察者模式已启动 | 连接：微博/新闻/Twitter</div>
        <div><span className="text-terminal-accent">$</span> date</div>
        <div className="ml-4">{new Date().toLocaleString('zh-CN')}</div>
      </div>

      {/* Stats */}
      <section className="mb-8">
        <div className="text-terminal-dim text-sm mb-3">
          <span className="text-terminal-accent">$</span> cat /proc/stats
        </div>
        <Stats entries={allWu} />
      </section>

      {/* Latest Wu */}
      {latestWu && (
        <section className="mb-8">
          <TerminalWindow title="latest_wu.log">
            <div className="text-terminal-warning text-sm mb-4">
              ═══ 最新一悟 ═══
            </div>
            <WuCard wu={latestWu} showFull={true} />
          </TerminalWindow>
        </section>
      )}

      {/* Recent List */}
      <section className="mb-8">
        <div className="text-terminal-dim text-sm mb-3">
          <span className="text-terminal-accent">$</span> ls -la /var/log/wu/ | head -5
        </div>
        <div className="space-y-4">
          {recentWu.map((wu) => (
            <WuCard key={wu.id} wu={wu} />
          ))}
        </div>
      </section>

      {/* View All */}
      <div className="text-center py-8 border-t border-terminal-dim/30">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 text-terminal-accent hover:glow-accent transition-all"
        >
          <span className="text-terminal-fg">$</span> cat --all
          <span className="text-terminal-dim">查看全部历史 →</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-terminal-dim/30 text-center text-terminal-dim text-xs">
        <pre className="ascii-art text-terminal-dim/50 mb-4">
{`    ☯️
   /|\\
  / | \\
 /  |  \\
/   |   \\`}
        </pre>
        <p>悟 Terminal - 观万物之变，悟道之常</p>
        <p className="mt-2">Powered by Claude AI | Built with Next.js</p>
        <p className="mt-2 text-terminal-dim/50">
          <span className="text-terminal-accent">$</span> echo &quot;道在日常&quot;
        </p>
      </footer>
    </main>
  )
}
