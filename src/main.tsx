import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { queryClient } from './core/api/queryClient'
import { ThemeProvider } from './shared/providers/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)