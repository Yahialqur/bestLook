// src/pages/WebcamPage.jsx
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import '../styles/WebcamPage.css'

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user', 
}

const WebcamPage = () => {
  const [gender, setGender] = useState(null)
  const webcamRef = useRef(null)

  // This function captures the screenshot and sends it to the Flask backend
  const captureAndSubmit = useCallback(() => {
    if (!gender) {
      alert('Please select Male or Female before taking the picture.')
      return
    }

    // Get the image from the webcam as a base64 data URL
    const imageSrc = webcamRef.current.getScreenshot()

    // Send the base64 + gender to the backend
    fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageSrc,
        gender: gender,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // The server response after running the model
        console.log('Server response:', data)
        alert(`Model result: ${data.result}`)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [gender])

  return (
    <div className="webcam-page">
      <h1>Take Your Picture!</h1>

      {/* Webcam feed */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="webcam-video"
      />

      {/* Gender selection buttons */}
      <div className="gender-buttons">
        <button
          className={`gender-button ${gender === 'male' ? 'selected' : ''}`}
          onClick={() => setGender('male')}
        >
          Male
        </button>
        <button
          className={`gender-button ${gender === 'female' ? 'selected' : ''}`}
          onClick={() => setGender('female')}
        >
          Female
        </button>
      </div>

      {/* Capture button */}
      <button className="capture-button" onClick={captureAndSubmit}>
        Capture & Submit
      </button>
    </div>
  )
}

export default WebcamPage
