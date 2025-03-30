// src/pages/WebcamPage.jsx
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { useNavigate } from 'react-router-dom'
import '../styles/WebcamPage.css'

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user'
}

const WebcamPage = () => {
  const [gender, setGender] = useState(null)
  const webcamRef = useRef(null)
  const navigate = useNavigate()

  const captureAndSubmit = useCallback(() => {
    if (!gender) {
      alert('Please select Male or Female before taking the picture.')
      return
    }

    // 1. Capture screenshot from webcam as a base64 data URL
    const imageSrc = webcamRef.current.getScreenshot()

    // 2. Send to Flask backend
    fetch('http://127.0.0.1:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageSrc,
        gender: gender,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // The server should return JSON like:
        //   {
        //     "result": "square", 
        //     "hairstyles": [
        //        {"id": 41, "name": "Crew Cut", "image": "..."},
        //        ...
        //     ]
        //   }

        console.log('Server response:', data)

        if (data.error) {
          alert(`Error: ${data.error}`)
          return
        }

        // Navigate to /results, passing faceShape & hairstyles via router state
        navigate('/results', {
          state: {
            faceShape: data.result,
            hairstyles: data.hairstyles || []
          },
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error submitting image')
      })
  }, [gender, navigate])

  return (
    <div className="webcam-page">
      <h1>Take Your Picture!</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="webcam-video"
      />

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

      <button className="capture-button" onClick={captureAndSubmit}>
        Capture & Submit
      </button>
    </div>
  )
}

export default WebcamPage
