import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import OS from './os/OS.jsx'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource/inter-tight/400.css'
import '@fontsource/inter-tight/500.css'
import '@fontsource/inter-tight/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './index.css'

// "/" is MohitOS; "/classic" is the scrolling one-page site.
const isClassic = window.location.pathname.replace(/\/+$/, '') === '/classic'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isClassic ? <App /> : <OS />}
  </React.StrictMode>,
)
