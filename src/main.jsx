import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Mobile Drag and Drop Polyfill
// (Removed - standard native DnD replaced with dnd-kit for mobile)

// Fix for iOS scrolling/dragging conflict
window.addEventListener('touchmove', function () { }, { passive: false });

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
