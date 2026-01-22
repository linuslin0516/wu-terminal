'use client'

import { useState, useEffect } from 'react'

interface CommandLineProps {
  command: string
  delay?: number
  onComplete?: () => void
}

export default function CommandLine({ command, delay = 50, onComplete }: CommandLineProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < command.length) {
        setDisplayedText(command.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, delay)

    return () => clearInterval(timer)
  }, [command, delay, onComplete])

  return (
    <div className="flex items-center gap-2 font-mono">
      <span className="text-terminal-accent">$</span>
      <span className="text-terminal-fg">
        {displayedText}
        {!isComplete && <span className="animate-blink">▊</span>}
      </span>
    </div>
  )
}
