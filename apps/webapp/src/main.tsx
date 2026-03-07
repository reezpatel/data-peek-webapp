import './assets/global.css'

import { SocketTransport } from './socket'
import { createApi } from './api-shim'

// Initialize Socket.IO transport and create the API shim
// In production (same origin), use undefined so Socket.IO connects to the serving host.
// In dev, use VITE_SERVER_URL to point to the separate server process.
const serverUrl = import.meta.env.VITE_SERVER_URL || undefined
const transport = new SocketTransport(serverUrl)

// Assign to window.api — all stores/components use this
window.api = createApi(transport)

// Provide a stub for window.electron (used for platform detection in some components)
window.electron = {
  process: {
    platform: 'browser',
    versions: {}
  }
}

// Mount React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
