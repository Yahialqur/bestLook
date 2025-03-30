import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WebcamPage from './pages/WebcamPage'
import ResultsPage from './pages/ResultsPage'
import Home from './pages/Home'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webcam" element={<WebcamPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
