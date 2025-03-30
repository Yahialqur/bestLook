import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WebcamPage from './pages/WebcamPage'
import Footer from './components/Footer'
import Home from './pages/Home'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webcam" element={<WebcamPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
