// src/pages/ResultsPage.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/ResultsPage.css'

const ResultsPage = () => {
  const location = useLocation()
  const { faceShape, hairstyles } = location.state || {}
  const gender = location.state?.gender || 'male'

  /* Bail out if required data missing */
  if (!faceShape || !hairstyles) {
    return (
      <div className="results-page">
        <h1>No result data found</h1>
        <p>Please go back and capture an image first.</p>
      </div>
    )
  }

  /* Outline image from React public/face_outlines */
  const prefix   = gender.toLowerCase() === 'male' ? 'M' : 'F'
  const fileName = `${prefix}_${faceShape.toLowerCase()}.png`
  const outlineSrc = `/face_outlines/${gender}/${fileName}`

  return (
    <>
      <header className="results-header">
        <Link to="/" className="logo">Best Look</Link>
      </header>

      <div className="results-page">
        <h1>Your Results</h1>

        {/* Face‑shape card */}
        <h2>Your Face Shape</h2>
        <div className="face-shape-card">
          <img
            src={outlineSrc}
            alt={`${faceShape} outline`}
            className="face-shape-outline"
            onError={e => {
              e.currentTarget.src = '/face_outlines/placeholder.png'
            }}
          />
          <div className="face-shape-name">{faceShape.toUpperCase()}</div>
        </div>

        {/* Hairstyle cards */}
        <h2 className="section-title">Recommended Hairstyles</h2>
        <div className="hairstyle-list">
          {hairstyles.length > 0 ? (
            hairstyles.map(style => (
              <div key={style.id} className="hairstyle-card">
                <h3>{style.name}</h3>
                <img
                  /* root‑relative URL → served by React dev/prod server */
                  src={style.image}
                  alt={style.name}
                  className="hairstyle-image"
                  onError={e => {
                    e.currentTarget.style.opacity = 0.2
                  }}
                />
                <button className="try-now-button">Try Now</button>
              </div>
            ))
          ) : (
            <p>No recommended hairstyles found.</p>
          )}
        </div>

        {/* Glasses placeholder */}
        <h2 className="section-title">Recommended Glasses</h2>
        <div className="glasses-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="glasses-card">
              <div className="glasses-image-placeholder">Image Coming Soon</div>
              <p className="placeholder-text">Recommendation Coming Soon</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ResultsPage
