import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { ApiKeyModal } from '@/components/ui/ApiKeyModal'
import { useTheme } from '@/hooks/useTheme'

function ThemeApplier() {
  useTheme()
  return null
}

export function App() {
  return (
    <>
      <ThemeApplier />
      <RouterProvider router={router} />
      <ApiKeyModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(51,65,85,0.6)',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1e293b' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
        }}
      />
    </>
  )
}
