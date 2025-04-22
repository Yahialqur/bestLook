import React from 'react'
import '../styles/Home.css'

import Footer from '../components/Footer'

import logo from "/bestLook_whiteLogo.png"

import ugly from "../assets/home_images/home_ugly.png"
import sexy from "../assets/home_images/home_sexy.png"


const Home = () => {
    return (
      <>
        <main className="home">
        {/*  Hero */}
        <section className="hero-section" id="hero">
          <div className="hero-content">
            <img src={logo} alt='Best Look Logo' className='logo'></img>
            <h1>
              Find Your <span className="gold-text">Best Look!</span>
            </h1>
            <p className="hero-subtitle">
              Discover the perfect hairstyle, facial hair, glasses, and accessories
              that complement your unique face shape.
            </p>
            <button className="gold-button" onClick={() => window.location.href = '/webcam'}>Get Started</button>
          </div>
  
          <a href="#transform" className="hero-scroll-indicator">▼</a>
        </section>
  
        {/* Transform */}
        <section className="transform-section" id="transform">
          <h2>
            Transform Your <span className="gold-text">Appearance</span>
          </h2>
  
          <div className="before-after-container">
            <div className="image-box">
              <h3>Before</h3>
              <img src={ugly} alt="Before - Without personalized recommendations" className="image-placeholder" />
              <p className="image-caption">Without personalized recommendations</p>
            </div>
            <div className="arrow-box">
              <span className="gold-arrow">➜</span>
            </div>
            <div className="image-box">
              <h3>After</h3>
              <img src={sexy} alt="After - With our personalized recommendations" className="image-placeholder" />
              <p className="image-caption">With our personalized recommendations</p>
            </div>
          </div>
  
          <button className="gold-button" onClick={() => window.location.href = '/webcam'}>Try It Now!</button>
        </section>
  
        {/* About Us */}
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
  
        {/* CTA */}
        <section className="final-cta-section">
          <h2>Ready to discover your perfect look?</h2>
          <button className="gold-button" onClick={() => window.location.href = '/webcam'}>Get Started Now</button>
        </section>
      </main>
      < Footer />
      </>
    )
  }
  
  export default Home
  