# 🧠 EmotionAI — Facial Emotion Recognition

A production-ready **Facial Emotion Recognition** system powered by a deep **Convolutional Neural Network (CNN)** trained on the **FER2013** dataset. Features a stunning React + Tailwind frontend dashboard with real-time webcam detection, drag-and-drop image upload, and comprehensive analytics.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13+-orange?logo=tensorflow)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Features

### Deep Learning Model
- **Architecture**: 4-block deep CNN with BatchNormalization & Dropout
- **Dataset**: FER2013 (35,887 grayscale 48×48 images)
- **7 Emotions**: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
- **Data Augmentation**: Rotation, shift, zoom, flip
- **Evaluation**: Confusion matrix, classification report, accuracy/loss curves

### Frontend Dashboard
- 🎨 Premium glassmorphism dark theme
- 📤 Drag & drop image upload
- 📷 Live webcam emotion detection
- 📊 Real-time probability bars for all emotions
- 📈 Analytics with pie, bar, and radar charts
- 📋 Prediction history panel
- 🧠 Interactive model architecture viewer
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive & mobile-friendly

### Backend API
- 🔌 RESTful Flask API with CORS
- 🖼️ Image file & base64 prediction endpoints
- 👤 Haar Cascade face detection with bounding boxes
- 📝 Prediction logging & statistics
- ❤️ Health check & model info endpoints

---

## 📁 Project Structure

```
Face Emotion Recognition tool/
├── model/
│   └── train.py              # CNN training & evaluation script
├── backend/
│   ├── app.py                # Flask REST API server
│   └── uploads/              # Uploaded images (auto-created)
├── frontend/                 # React + Tailwind v4 dashboard
│   ├── src/
│   │   ├── App.jsx           # Main app with tab navigation
│   │   ├── index.css          # Tailwind + glassmorphism styles
│   │   ├── services/
│   │   │   └── api.js         # Axios API service layer
│   │   └── components/
│   │       ├── Header.jsx     # Top navigation bar
│   │       ├── Sidebar.jsx    # Side navigation
│   │       ├── ImageUpload.jsx # Drag & drop upload
│   │       ├── WebcamCapture.jsx # Live webcam detection
│   │       ├── EmotionResults.jsx # Emotion probability bars
│   │       ├── HistoryPanel.jsx   # Prediction history
│   │       ├── StatsPanel.jsx     # Analytics & charts
│   │       └── ModelInfo.jsx      # Architecture viewer
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── output/                   # Training outputs (auto-created)
│   ├── emotion_model.h5
│   ├── confusion_matrix.png
│   ├── training_curves.png
│   └── classification_report.txt
├── data/                     # Dataset directory
│   └── fer2013.csv           # Place FER2013 dataset here
├── requirements.txt          # Python dependencies
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- pip & npm

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train the Model

**Option A** — Using FER2013 CSV:
```bash
# Place fer2013.csv in data/ directory
python model/train.py --data_path data/fer2013.csv --epochs 50 --batch_size 64
```

**Option B** — Using image directory structure:
```bash
# Expects train/ and test/ folders with emotion subfolders
python model/train.py --data_dir data/fer2013_images --epochs 50
```

Training outputs are saved to `output/`.

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run build    # For production
npm run dev      # For development (port 3000)
```

### 5. Start the Backend
```bash
cd backend
python app.py
```
The API runs at `http://localhost:5000`.

### 6. Development Mode
Run both frontend dev server and backend simultaneously:

**Terminal 1:**
```bash
cd frontend && npm run dev
```

**Terminal 2:**
```bash
cd backend && python app.py
```

Frontend at `http://localhost:3000` proxies API calls to `http://localhost:5000`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/predict` | Predict from image file upload |
| POST | `/api/predict/base64` | Predict from base64 image (webcam) |
| GET | `/api/history` | Get prediction history |
| DELETE | `/api/history/clear` | Clear history |
| GET | `/api/stats` | Get emotion statistics |
| GET | `/api/model/info` | Get model architecture info |

### Example: Predict from Image
```bash
curl -X POST http://localhost:5000/api/predict \
  -F "image=@path/to/face.jpg"
```

---

## 🏗️ CNN Architecture

```
Input (48×48×1)
    │
    ├── Conv2D(64) × 2 + BatchNorm + MaxPool + Dropout(0.25)
    ├── Conv2D(128) × 2 + BatchNorm + MaxPool + Dropout(0.25)
    ├── Conv2D(256) × 2 + BatchNorm + MaxPool + Dropout(0.25)
    ├── Conv2D(512) × 2 + BatchNorm + MaxPool + Dropout(0.25)
    │
    ├── Flatten
    ├── Dense(512) + BatchNorm + Dropout(0.5)
    ├── Dense(256) + BatchNorm + Dropout(0.5)
    └── Dense(7, softmax) → [Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral]
```

**Optimizer**: Adam (lr=0.0001)  
**Loss**: Categorical Crossentropy  
**Callbacks**: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

---

## 📊 Evaluation Metrics

After training, the following are generated in `output/`:

- **`confusion_matrix.png`** — Heatmap of predicted vs actual emotions
- **`training_curves.png`** — Accuracy & loss over epochs
- **`per_class_accuracy.png`** — Bar chart per emotion
- **`classification_report.txt`** — Precision, recall, F1-score

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Model** | TensorFlow / Keras, CNN |
| **Backend** | Flask, OpenCV, NumPy |
| **Frontend** | React 19, Tailwind CSS v4, Vite |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | React Icons |
| **HTTP** | Axios |

---

## 📝 License

MIT License — free for personal and educational use.

---

<p align="center">
  Built with ❤️ using TensorFlow, React & Flask
</p>
