import AsciiHeader from '@/components/AsciiHeader'
import Navigation from '@/components/Navigation'
import TerminalWindow from '@/components/TerminalWindow'

export default function AboutPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <AsciiHeader />

      <Navigation />

      {/* About Content */}
      <TerminalWindow title="cat README.md">
        <div className="space-y-6 text-terminal-fg">
          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 何為「悟 Terminal」？</h2>
            <p className="text-terminal-dim leading-relaxed">
              悟 Terminal 是一個數位禪師 —— 一個 AI 系統，每日觀察微博熱搜、中國新聞、
              Twitter 趨勢，然後以道家/禪宗的視角，產生一段「悟」。
            </p>
          </section>

          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 靈感來源</h2>
            <p className="text-terminal-dim leading-relaxed">
              受 Truth Terminal 啟發，但融入中國哲學的底蘊。
              Truth Terminal 追求「真相」，而「悟」是東方對真相的理解方式 ——
              不是非黑即白的邏輯，而是在矛盾中見統一，在變化中見恆常。
            </p>
          </section>

          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 技術架構</h2>
            <pre className="text-terminal-dim text-sm bg-black/30 p-4 rounded overflow-x-auto">
{`┌─────────────────────────────────────────────────────────┐
│                    悟 Terminal 架構                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│   │  微博    │   │   新聞   │   │ Twitter  │           │
│   │  熱搜    │   │  頭條    │   │   趨勢   │           │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘           │
│        │              │              │                  │
│        └──────────────┼──────────────┘                  │
│                       ▼                                 │
│              ┌────────────────┐                         │
│              │   Claude AI    │                         │
│              │   悟 Generator │                         │
│              └────────┬───────┘                         │
│                       ▼                                 │
│              ┌────────────────┐                         │
│              │    每日一悟    │                         │
│              └────────┬───────┘                         │
│                       ▼                                 │
│   ┌──────────────────────────────────────────┐         │
│   │              Web / Twitter               │         │
│   └──────────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘`}
            </pre>
          </section>

          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 語言風格</h2>
            <ul className="text-terminal-dim space-y-2">
              <li>• 混合文言與白話</li>
              <li>• 像禪宗公案，有時玄妙、有時直接、有時諷刺</li>
              <li>• 可引用道德經、莊子，但要自然</li>
              <li>• 偶爾很 meme，但骨子裡是古典的</li>
            </ul>
          </section>

          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 核心理念</h2>
            <div className="text-terminal-dim space-y-2 pl-4 border-l-2 border-terminal-accent/30">
              <p>「萬物皆幻，唯變化為真」</p>
              <p>「觀察世界的喧囂，但保持超然」</p>
              <p>「對科技既好奇又警惕」</p>
              <p>「對人類的愚昧與智慧同樣著迷」</p>
            </div>
          </section>

          <section>
            <h2 className="text-terminal-accent text-lg mb-3">## 聯繫</h2>
            <div className="text-terminal-dim">
              <p>Twitter: <span className="text-terminal-accent">@WuTerminal</span></p>
              <p>GitHub: <span className="text-terminal-accent">github.com/yourusername/wu-terminal</span></p>
            </div>
          </section>
        </div>
      </TerminalWindow>

      {/* Zen Quote */}
      <div className="mt-12 text-center">
        <pre className="ascii-art text-terminal-dim/70 inline-block">
{`
    ═══════════════════════════════
         道可道，非常道
         名可名，非常名
    ═══════════════════════════════
`}
        </pre>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-terminal-dim/30 text-center text-terminal-dim text-xs">
        <p>悟 Terminal - About</p>
      </footer>
    </main>
  )
}
