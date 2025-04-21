// src/pages/WebcamPage.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import '../styles/WebcamPage.css';

const videoConstraints = { width: 400, height: 300, facingMode: 'user' };

const WebcamPage = () => {
  const [gender, setGender]   = useState(null);
  const [cascade, setCascade] = useState(null);

  const webcamRef   = useRef(null);
  const canvasRef   = useRef(null);
  const detectTimer = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initCascade = async () => {
      if (!mounted) return;
      try {
        const buf   = await fetch('/haarcascade_frontalface_default.xml').then(r => r.arrayBuffer());
        const bytes = new Uint8Array(buf);

        try { window.cv.FS_unlink('/haarcascade_frontalface_default.xml'); } catch { /* ignore */ }
        window.cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml',
                                    bytes, true, false, false);

        const clf = new window.cv.CascadeClassifier();
        if (!clf.load('haarcascade_frontalface_default.xml')) throw new Error('cascade load failed');
        if (mounted) setCascade(clf);
      } catch (e) {
        console.error(e);
      }
    };

    const waitForCv = () => {
      if (!mounted) return;

      if (window.cv) {
        if (window.cv.ready) {
          window.cv.ready.then(initCascade);                
        } else if (window.cv.onRuntimeInitialized !== undefined) {
          window.cv.onRuntimeInitialized = initCascade;     
        } else {
          initCascade();                                     
        }
      } else {
        setTimeout(waitForCv, 50);                           
      }
    };

    waitForCv();
    return () => { mounted = false; };
  }, []);

  const detect = useCallback(() => {
    if (!cascade || !webcamRef.current || !canvasRef.current) return;

    const snap = webcamRef.current.getScreenshot();
    if (!snap) return;

    const img = new Image();
    img.src = snap;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx    = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const src  = window.cv.imread(img);
      const gray = new window.cv.Mat();
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

      const faces = new window.cv.RectVector();
      cascade.detectMultiScale(gray, faces, 1.1, 3, 0);

      for (let i = 0; i < faces.size(); i++) {
        const { x, y, width: w, height: h } = faces.get(i);
        ctx.strokeStyle = 'red';
        ctx.lineWidth   = 2;
        ctx.strokeRect(x, y, w, h);
      }
      src.delete(); gray.delete(); faces.delete();
    };
  }, [cascade]);

  useEffect(() => {
    if (!cascade) return;
    detectTimer.current = setInterval(detect, 200);
    return () => clearInterval(detectTimer.current);
  }, [cascade, detect]);

  const detectAndCropFace = base64 =>
    new Promise((resolve, reject) => {
      if (!cascade) return reject(new Error('cascade not ready'));

      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const src  = window.cv.imread(img);
        const gray = new window.cv.Mat();
        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

        const faces = new window.cv.RectVector();
        cascade.detectMultiScale(gray, faces, 1.1, 3, 0);

        if (faces.size() === 0) {
          src.delete(); gray.delete(); faces.delete();
          return resolve(null);
        }

        let best = faces.get(0), maxA = best.width * best.height;
        for (let i = 1; i < faces.size(); i++) {
          const f = faces.get(i), a = f.width * f.height;
          if (a > maxA) { best = f; maxA = a; }
        }

        const { x, y, width: w, height: h } = best;
        const crop = document.createElement('canvas');
        crop.width = w; crop.height = h;
        crop.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h);

        const out = crop.toDataURL('image/jpeg');
        src.delete(); gray.delete(); faces.delete();
        resolve(out);
      };
      img.onerror = reject;
    });

  const captureAndSubmit = useCallback(async () => {
    if (!gender) return alert('Select Male or Female first');

    const snap = webcamRef.current.getScreenshot();
    if (!snap) return alert('Could not capture frame');

    try {
      const cropped = await detectAndCropFace(snap);
      if (!cropped) return alert('No face detected, retry');

      const res  = await fetch('http://127.0.0.1:5000/api/analyze', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ image: cropped, gender }),
      });
      const data = await res.json();
      navigate('/results', {
        state: {
          faceShape : data.result,
          hairstyles: data.hairstyles,
          glasses   : data.glasses,
          gender,
        },
      });
    } catch (e) {
      console.error(e);
      alert('Error, check console');
    }
  }, [gender, cascade, navigate]);

  return (
    <div className="webcam-page">
      <h1>Take Your Picture!</h1>

      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          audio={false}
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
        Capture & Submit
      </button>
    </div>
  );
};

export default WebcamPage;
