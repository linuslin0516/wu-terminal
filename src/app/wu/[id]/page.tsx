import AsciiHeader from '@/components/AsciiHeader'
import Navigation from '@/components/Navigation'
import TerminalWindow from '@/components/TerminalWindow'
import { getAllWu, getWuById } from '@/lib/wu-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 生成静态路径
export async function generateStaticParams() {
  const allWu = getAllWu()
  return allWu.map((wu) => ({
    id: wu.id,
  }))
}

export default function WuDetailPage({ params }: { params: { id: string } }) {
  const wu = getWuById(params.id)

  if (!wu) {
    notFound()
  }

  const formattedDate = format(new Date(wu.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })
  const formattedTime = format(new Date(wu.timestamp), 'HH:mm:ss', { locale: zhCN })

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <AsciiHeader />
      <Navigation />

      {/* 返回按钮 */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-terminal-dim hover:text-terminal-accent transition-all text-sm"
        >
          <span className="text-terminal-accent">$</span> cd .. <span className="text-terminal-dim/50">← 返回首页</span>
        </Link>
      </div>

      {/* 详情窗口 */}
      <TerminalWindow title={`cat /var/log/wu/${wu.date}.log`}>
        {/* 元信息 */}
        <div className="mb-6 pb-4 border-b border-terminal-dim/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-terminal-dim">日期：</span>
              <span className="text-terminal-fg">{formattedDate}</span>
            </div>
            <div>
              <span className="text-terminal-dim">生成时间：</span>
              <span className="text-terminal-fg">{formattedTime}</span>
            </div>
            <div>
              <span className="text-terminal-dim">ID：</span>
              <span className="text-terminal-fg/70 font-mono text-xs">{wu.id}</span>
            </div>
            <div>
              <span className="text-terminal-dim">字数：</span>
              <span className="text-terminal-accent">{wu.content.length}</span>
            </div>
          </div>
        </div>

        {/* 悟内容 */}
        <div className="mb-8">
          <div className="text-terminal-warning text-xs mb-3">
            <span className="text-terminal-accent">$</span> cat content.txt
          </div>
          <div className="bg-black/30 rounded-lg p-4 md:p-6 border border-terminal-dim/20">
            <p className="text-terminal-fg text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
              {wu.content}
            </p>
          </div>
        </div>

        {/* 信息来源 */}
        <div className="mb-6">
          <div className="text-terminal-warning text-xs mb-3">
            <span className="text-terminal-accent">$</span> cat sources.json
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-terminal-dim/20">
            <div className="space-y-4">
              {/* 微博来源 */}
              {wu.sources.weibo && wu.sources.weibo.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-terminal-warning font-bold">[微博热搜]</span>
                    <span className="text-terminal-dim text-xs">weibo.com</span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {wu.sources.weibo.map((item, i) => (
                      <li key={i} className="text-terminal-dim text-sm flex items-start gap-2">
                        <span className="text-terminal-warning">#{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 新闻来源 */}
              {wu.sources.news && wu.sources.news.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-terminal-cyan font-bold">[新闻动态]</span>
                    <span className="text-terminal-dim text-xs">news aggregator</span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {wu.sources.news.map((item, i) => (
                      <li key={i} className="text-terminal-dim text-sm flex items-start gap-2">
                        <span className="text-terminal-cyan">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Twitter 来源 */}
              {wu.sources.twitter && wu.sources.twitter.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-terminal-magenta font-bold">[Twitter/X]</span>
                    <span className="text-terminal-dim text-xs">x.com trends</span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {wu.sources.twitter.map((item, i) => (
                      <li key={i} className="text-terminal-dim text-sm flex items-start gap-2">
                        <span className="text-terminal-magenta">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI 生成信息 */}
        <div className="pt-4 border-t border-terminal-dim/30">
          <div className="text-terminal-dim/50 text-xs space-y-1">
            <p><span className="text-terminal-accent">$</span> cat /proc/ai_info</p>
            <p className="ml-4">Model: Claude (Anthropic)</p>
            <p className="ml-4">Type: 悟 Terminal Daily Generation</p>
            <p className="ml-4">Status: Completed</p>
          </div>
        </div>
      </TerminalWindow>

      {/* 底部导航 */}
      <div className="mt-8 flex justify-between items-center text-sm">
        <Link
          href="/archive"
          className="text-terminal-dim hover:text-terminal-accent transition-all"
        >
          <span className="text-terminal-accent">$</span> ls -la <span className="text-terminal-dim/50">查看全部</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-terminal-dim/30 text-center text-terminal-dim text-xs">
        <p>悟 Terminal - Detail View</p>
      </footer>
    </main>
  )
}
