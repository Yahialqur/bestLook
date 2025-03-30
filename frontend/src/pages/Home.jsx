import React from 'react'
import '../styles/Home.css'

const Home = () => {
    return (
      <main className="home">
        {/*  HERO SECTION (WHITE BACKGROUND) */}
        <section className="hero-section" id="hero">
          <div className="hero-content">
            <h1>
              Find Your <span className="gold-text">Best Look!</span>
            </h1>
            <p className="hero-subtitle">
              Discover the perfect hairstyle, facial hair, glasses, and accessories
              that complement your unique face shape.
            </p>
            <button className="gold-button">Get Started</button>
          </div>
  
          {/* The scroll indicator arrow.
              It can be a link to the next section (#transform) or any ID. */}
          <a href="#transform" className="hero-scroll-indicator">▼</a>
        </section>
  
        {/* ========== TRANSFORM SECTION (BLACK BACKGROUND) ========== */}
        <section className="transform-section" id="transform">
          <h2>
            Transform Your <span className="gold-text">Appearance</span>
          </h2>
  
          <div className="before-after-container">
            <div className="image-box">
              <h3>Before</h3>
              <div className="image-placeholder" />
              <p className="image-caption">Without personalized recommendations</p>
            </div>
            <div className="image-box">
              <h3>After</h3>
              <div className="image-placeholder" />
              <p className="image-caption">With our personalized recommendations</p>
            </div>
          </div>
  
          <button className="gold-button">Try It Now!</button>
        </section>
  
        {/* ========== ABOUT US SECTION (BLACK BACKGROUND) ========== */}
        <section className="about-section">
          <h2>About <span className="gold-text">Us</span></h2>
          <p className="about-text">
            We’re dedicated to helping you look your best. Our advanced face shape
            detection technology analyzes your unique features to provide personalized
            recommendations that enhance your natural beauty.
          </p>
  
          <div className="cards-container">
            <div className="info-card">
              <h3 className="gold-text">Face Shape Analysis</h3>
              <p>
                Our AI technology accurately identifies your face shape to provide
                tailored recommendations.
              </p>
            </div>
            <div className="info-card">
              <h3 className="gold-text">Personalized Suggestions</h3>
              <p>
                Get customized recommendations for hairstyles, facial hair, glasses,
                and accessories.
              </p>
            </div>
            <div className="info-card">
              <h3 className="gold-text">Virtual Try-On</h3>
              <p>
                See how different styles look on you before making any changes
                to your appearance.
              </p>
            </div>
          </div>
        </section>
  
        {/* ========== FINAL CTA SECTION (WHITE BACKGROUND) ========== */}
        <section className="final-cta-section">
          <h2>Ready to discover your perfect look?</h2>
          <button className="gold-button">Get Started Now</button>
        </section>
      </main>
    )
  }
  
  export default Home
  