import React, { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useNavigate } from 'react-router-dom' 
import '../styles/WebcamPage.css'

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user',
}

const WebcamPage = () => {
  const [gender, setGender] = useState(null)
  const [cascade, setCascade] = useState(null) 
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const detectionIntervalRef = useRef(null)

  // Use navigate hook to redirect to results page
  const navigate = useNavigate()

  // === Load the Haar cascade from public folder ===
  useEffect(() => {
    fetch('/haarcascade_frontalface_default.xml')
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const data = new Uint8Array(buffer)
        try {
          window.cv.FS_unlink('/haarcascade_frontalface_default.xml')
        } catch (e) {
          // file didn't exist, that's okay
        }

        // Create the file in the in-memory filesystem
        window.cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false)
        
        // Load cascade
        const classifier = new window.cv.CascadeClassifier()
        classifier.load('haarcascade_frontalface_default.xml')
        setCascade(classifier)
        console.log('Cascade loaded successfully.')
      })
      .catch((err) => console.error('Failed to load cascade file:', err))
  }, [])

  // === Function to detect faces in the current frame and draw boxes ===
  const detectFaceInRealTime = useCallback(() => {
    if (!webcamRef.current || !canvasRef.current || !cascade) return

    // 1) Get the current frame from react-webcam
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      // Clear old drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Convert to OpenCV Mat
      let src = new window.cv.Mat(canvas.height, canvas.width, window.cv.CV_8UC4)
      src.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data)

      // Convert to grayscale
      let gray = new window.cv.Mat()
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0)

      // Detect faces
      let faces = new window.cv.RectVector()
      cascade.detectMultiScale(gray, faces, 1.1, 3, 0)

      // Draw bounding boxes in red
      for (let i = 0; i < faces.size(); i++) {
        let face = faces.get(i)
        let x = face.x
        let y = face.y
        let w = face.width
        let h = face.height
        
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.stroke()
      }

      src.delete()
      gray.delete()
      faces.delete()
    }
  }, [cascade])

  // === Run detection on an interval (200ms) as soon as the page loads ===
  useEffect(() => {
    detectionIntervalRef.current = setInterval(() => {
      detectFaceInRealTime()
    }, 200)

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
        detectionIntervalRef.current = null
      }
    }
  }, [detectFaceInRealTime])

  // === Capture + Crop logic ===
  const detectAndCropFace = (base64Image) => {
    return new Promise((resolve, reject) => {
      if (!cascade) {
        return reject(new Error('Cascade not loaded yet!'))
      }
      const img = new Image()
      img.src = base64Image
      img.onload = () => {
        const offCanvas = document.createElement('canvas')
        offCanvas.width = img.width
        offCanvas.height = img.height
        const offCtx = offCanvas.getContext('2d')
        offCtx.drawImage(img, 0, 0)

        let src = new window.cv.Mat(offCanvas.height, offCanvas.width, window.cv.CV_8UC4)
        src.data.set(offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data)

        let gray = new window.cv.Mat()
        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0)

        let faces = new window.cv.RectVector()
        cascade.detectMultiScale(gray, faces, 1.1, 3, 0)

        if (faces.size() === 0) {
          resolve(null)
          src.delete()
          gray.delete()
          faces.delete()
          return
        }

        // Pick largest face
        let largestFace = faces.get(0)
        let maxArea = largestFace.width * largestFace.height
        for (let i = 1; i < faces.size(); i++) {
          let faceRect = faces.get(i)
          let area = faceRect.width * faceRect.height
          if (area > maxArea) {
            largestFace = faceRect
            maxArea = area
          }
        }

        const { x, y, width, height } = largestFace
        const faceCanvas = document.createElement('canvas')
        faceCanvas.width = width
        faceCanvas.height = height
        const faceCtx = faceCanvas.getContext('2d')
        faceCtx.drawImage(img, x, y, width, height, 0, 0, width, height)

        const croppedBase64 = faceCanvas.toDataURL('image/jpeg')

        src.delete()
        gray.delete()
        faces.delete()
        resolve(croppedBase64)
      }
      img.onerror = (err) => reject(err)
    })
  }

  // === Capture from webcam, crop, submit to Flask ===
  const captureAndSubmit = useCallback(async () => {
    if (!gender) {
      alert('Please select Male or Female before taking the picture.')
      return
    }
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) {
      alert('Could not capture image from webcam!')
      return
    }
    try {
      const croppedImage = await detectAndCropFace(imageSrc)
      if (!croppedImage) {
        alert('No face detected in captured frame! Please try again.')
        return
      }
      fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: croppedImage,
          gender: gender,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Server response:', data)
          // Instead of alerting, we navigate to /results
          // passing faceShape & hairstyles in location.state
          navigate('/results', {
            state: {
              faceShape: data.result,    
              hairstyles: data.hairstyles // array of {id, name, image}
            },
          })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    } catch (err) {
      console.error('Face detection error:', err)
    }
  }, [gender, cascade, navigate])

  return (
    <div className="webcam-page">
      <h1>Take Your Picture!</h1>

      {/* Stacked webcam + overlay canvas */}
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam-video"
        />
        <canvas
          ref={canvasRef}
          className="canvas-overlay"
          width={400}
          height={300}
        />
      </div>

      {/* Gender buttons */}
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
