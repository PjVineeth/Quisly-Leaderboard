import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/globals.css'
import LeaderboardPage from '@/app/page'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="quilsy-theme">
      <LeaderboardPage />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
