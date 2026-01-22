'use client'

export default function AsciiHeader() {
  // 更紧凑的 ASCII art
  const asciiArt = `
██╗    ██╗██╗   ██╗
██║    ██║██║   ██║
██║ █╗ ██║██║   ██║
██║███╗██║██║   ██║
╚███╔███╔╝╚██████╔╝
 ╚══╝╚══╝  ╚═════╝
`

  return (
    <header className="mb-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        {/* ASCII WU */}
        <pre className="ascii-art text-terminal-fg glow text-center leading-none text-[0.5rem] sm:text-[0.6rem] md:text-[0.7rem]">
          {asciiArt}
        </pre>

        {/* TERMINAL 文字 */}
        <div className="text-terminal-fg text-lg sm:text-xl md:text-2xl tracking-[0.3em] font-bold glow">
          T E R M I N A L
        </div>
      </div>

      {/* 副标题框 */}
      <div className="mt-4 text-center">
        <div className="inline-block border border-terminal-accent/50 rounded px-6 py-2">
          <span className="text-terminal-accent text-xs sm:text-sm">
            ☯️ 观万物之变 · 悟道之常 ☯️
          </span>
        </div>
      </div>
    </header>
  )
}
