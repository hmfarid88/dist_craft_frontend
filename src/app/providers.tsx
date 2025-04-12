
'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { useState, useEffect } from 'react';
export function Providers({ children }: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }
  return <ThemeProvider>{children}</ThemeProvider>
}