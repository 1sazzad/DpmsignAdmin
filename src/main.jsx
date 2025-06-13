import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx' // Removed as App component is no longer directly rendered here
import { RouterProvider } from 'react-router-dom'
import router from './Components/router/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} ></RouterProvider> */}
    <div>
      <h1>Hello World from main.jsx!</h1>
      <p>If you see this, basic React rendering is working.</p>
    </div>
  </StrictMode>,
)
