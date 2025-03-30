// src/pages/ResultsPage.jsx
import React from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/ResultsPage.css'

const ResultsPage = () => {
  const location = useLocation()
  const { faceShape, hairstyles } = location.state || {}

  if (!faceShape || !hairstyles) {
    return (
      <div className="results-page">
        <h1>No result data found</h1>
        <p>Please go back and capture an image first.</p>
      </div>
    )
  }

  return (
    <div className="results-page">
      <h1>Your Results</h1>

      <h2>Your Face Shape</h2>
      <div className="face-shape-name">{faceShape.toUpperCase()}</div>

      <h2>Recommended Hairstyle</h2>
      <div className="hairstyle-list">
        {hairstyles.length > 0 ? (
          hairstyles.map((style) => (
            <div key={style.id} className="hairstyle-card">
              <h3>{style.name}</h3>
              {/* Make sure you have an image at this path */}
              <img src={style.image} alt={style.name} className="hairstyle-image" />
              <button className="try-now-button">Try Now</button>
            </div>
          ))
        ) : (
          <p>No recommended hairstyles found.</p>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
