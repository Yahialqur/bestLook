# 🧠 Face Shape Analyzer & Style Recommender

This project uses AI to detect your face shape through a webcam and recommends personalized hairstyles based on your facial features and structure.

## 🌐 Live Demo
[Coming Soon]

## 🧩 Tech Stack

- **Frontend:** React, React Router, OpenCV.js, Webcam
- **Backend:** Flask, PyTorch, VGG16
- **Model:** Pre-trained VGG16 fine-tuned for face shape classification

## ✨ Features

- Real-time face detection with webcam
- Face shape classification using a fine-tuned VGG16 model
- Personalized hairstyle suggestions for both male and female users
- Interactive UI to view results and try different looks

---

## 📬 API Overview

### `POST /api/analyze`

Accepts a base64-encoded image and selected gender, returns a predicted face shape and corresponding hairstyle recommendations.

#### Request Body:
```json
{
  "image": "data:image/jpeg;base64,...",
  "gender": "male" | "female"
}
```

#### Response:
```json
{
  "result": "oval",
  "hairstyles": [
    {
      "id": 21,
      "name": "Buzz Cut",
      "image": "/images/male/buzz-cut.jpg"
    },
    ...
  ]
}
```

---

## 👨‍💻 Authors

- **Yahia Alqurnawi**  
  GitHub: [@Yahialqur](https://github.com/Yahialqur)

- **Jon Kruja**  
  GitHub: [@Spec1alKs](https://github.com/Spec1alKs)
