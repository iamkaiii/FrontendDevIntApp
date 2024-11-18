import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,

  
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/FrontendDevIntApp/serviceWorker.js")
      .then(res => console.log("service worker registered", res))
      .catch(err => console.log("service worker not registered", err))
  })
}