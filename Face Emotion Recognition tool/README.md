# Face Emotion Recognition Tool

A web-based tool that uses your camera to detect faces and recognize emotions in real-time.

## Features

- Real-time face detection
- Emotion recognition (happy, sad, angry, surprised, etc.)
- Live video feed from your camera
- Clean, responsive UI

## How to Use

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Click "Start Camera" to begin
3. Allow camera access when prompted
4. The tool will detect faces and display emotions
5. Click "Stop Camera" to end the session

## Requirements

- A modern web browser with camera support
- Internet connection (for loading face detection models)
- Camera permission granted to the browser

## Technical Details

This tool uses:
- HTML5 for the user interface
- CSS3 for styling
- JavaScript for functionality
- face-api.js library for face detection and emotion recognition
- TensorFlow.js models for machine learning

## Privacy Note

This tool processes video locally in your browser. No video data is sent to external servers.
