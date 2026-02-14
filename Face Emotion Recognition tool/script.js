// Global variables
let stream = null;
let isDetecting = false;
let lastDetectionTime = 0;
const detectionInterval = 100;
let modelsLoaded = false;

const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    disgusted: '🤢',
    fearful: '😨'
};

// Show status message
function showStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status show ${type}`;
    setTimeout(() => status.classList.remove('show'), 4000);
}

// Show loading
function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Hide loading
function hideLoading() {
    showLoading(false);
}

// Navigation functions
function goHome() {
    console.log('Going home');
    try {
        // Stop camera if running
        stopCamera();
        
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Show home screen
        const homeScreen = document.getElementById('homeScreen');
        if (homeScreen) {
            homeScreen.style.display = 'block';
            homeScreen.classList.add('active');
        }
        
        // Reset image screen
        const imageOutput = document.getElementById('imageOutput');
        const uploadArea = document.getElementById('uploadArea');
        if (imageOutput) imageOutput.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'block';
        
        // Clear results
        const imageResults = document.getElementById('imageResults');
        const videoResults = document.getElementById('videoResults');
        if (imageResults) imageResults.innerHTML = '';
        if (videoResults) videoResults.innerHTML = '';
        
        console.log('✓ Back to home');
    } catch (error) {
        console.error('Error going home:', error);
    }
}

function openImageMode() {
    console.log('Opening image mode');
    try {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        const imageScreen = document.getElementById('imageScreen');
        if (imageScreen) {
            imageScreen.style.display = 'block';
            imageScreen.classList.add('active');
        }
    } catch (error) {
        console.error('Error opening image mode:', error);
    }
}

function openVideoMode() {
    console.log('Opening video mode');
    try {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        const videoScreen = document.getElementById('videoScreen');
        if (videoScreen) {
            videoScreen.style.display = 'block';
            videoScreen.classList.add('active');
        }
    } catch (error) {
        console.error('Error opening video mode:', error);
    }
}

// Logo click handler
function handleLogoClick() {
    console.log('Logo clicked');
    const homeScreen = document.getElementById('homeScreen');
    if (homeScreen && !homeScreen.classList.contains('active')) {
        goHome();
    }
}

// Load models once
async function loadModels() {
    if (modelsLoaded) {
        console.log('Models already loaded');
        return;
    }
    
    try {
        showLoading(true);
        console.log('Loading models...');
        
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        
        console.log('Loading TinyFaceDetector...');
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        
        console.log('Loading FaceLandmark68Net...');
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
        console.log('Loading FaceExpressionNet...');
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        modelsLoaded = true;
        console.log('✓ All models loaded');
        hideLoading();
        showStatus('✓ Models ready! Choose a mode', 'success');
    } catch (error) {
        console.error('Error loading models:', error);
        hideLoading();
        showStatus('❌ Failed to load models. Check internet.', 'error');
    }
}

// Image processing
async function processImage(file) {
    if (!file) return;
    
    if (!modelsLoaded) {
        showStatus('⏳ Loading models...', 'success');
        await loadModels();
    }
    
    try {
        showLoading(true);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    const canvas = document.getElementById('detectionCanvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceExpressions();
                    
                    detections.forEach((detection) => {
                        const { x, y, width, height } = detection.detection.box;
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(x, y, width, height);
                    });
                    
                    const uploadArea = document.getElementById('uploadArea');
                    const imageOutput = document.getElementById('imageOutput');
                    if (uploadArea) uploadArea.style.display = 'none';
                    if (imageOutput) imageOutput.style.display = 'block';
                    
                    displayResults(detections, 'image');
                    
                    hideLoading();
                    showStatus(`✓ Found ${detections.length} face(s)`, 'success');
                } catch (error) {
                    console.error('Detection error:', error);
                    hideLoading();
                    showStatus('❌ Error detecting faces', 'error');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error processing image:', error);
        hideLoading();
        showStatus('❌ Error processing image', 'error');
    }
}

// Video functions
async function startCamera() {
    if (!modelsLoaded) {
        showStatus('⏳ Loading models...', 'success');
        await loadModels();
    }
    
    try {
        console.log('Starting camera...');
        showLoading(true);
        
        const constraints = {
            video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('video');
        
        if (!video) {
            throw new Error('Video element not found');
        }
        
        video.srcObject = stream;
        
        // Wait for video to be ready
        let attempts = 0;
        const checkReady = setInterval(() => {
            attempts++;
            console.log(`Video ready check ${attempts}: ${video.videoWidth}x${video.videoHeight}`);
            
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                clearInterval(checkReady);
                
                const startBtn = document.getElementById('startBtn');
                const stopBtn = document.getElementById('stopBtn');
                if (startBtn) startBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = false;
                
                isDetecting = true;
                hideLoading();
                showStatus('✓ Camera ready! Detecting emotions...', 'success');
                console.log('✓ Camera ready, starting detection');
                detectFaces();
            }
            
            // Give up after 10 attempts (1 second)
            if (attempts > 10) {
                clearInterval(checkReady);
                stopCamera();
                hideLoading();
                showStatus('❌ Camera timeout. Try again.', 'error');
            }
        }, 100);
        
    } catch (error) {
        console.error('Camera error:', error);
        hideLoading();
        
        if (error.name === 'NotAllowedError') {
            showStatus('❌ Camera permission denied', 'error');
        } else if (error.name === 'NotFoundError') {
            showStatus('❌ No camera found', 'error');
        } else if (error.name === 'NotReadableError') {
            showStatus('❌ Camera in use by another app', 'error');
        } else {
            showStatus(`❌ ${error.message}`, 'error');
        }
    }
}

function stopCamera() {
    console.log('Stopping camera');
    isDetecting = false;
    
    if (stream) {
        stream.getTracks().forEach(track => {
            console.log('Stopping track:', track.kind);
            track.stop();
        });
        stream = null;
    }
    
    const video = document.getElementById('video');
    if (video) {
        video.srcObject = null;
    }
    
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    
    const videoResults = document.getElementById('videoResults');
    if (videoResults) videoResults.innerHTML = '';
    
    const canvas = document.getElementById('videoCanvas');
    if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
}

async function detectFaces() {
    if (!isDetecting) return;
    
    try {
        const now = Date.now();
        if (now - lastDetectionTime < detectionInterval) {
            requestAnimationFrame(detectFaces);
            return;
        }
        lastDetectionTime = now;
        
        const video = document.getElementById('video');
        const canvas = document.getElementById('videoCanvas');
        
        if (!video || !canvas || !video.srcObject) {
            if (isDetecting) {
                requestAnimationFrame(detectFaces);
            }
            return;
        }
        
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            if (isDetecting) {
                requestAnimationFrame(detectFaces);
            }
            return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!faceapi || !faceapi.nets) {
            showStatus('Error: Face API not available', 'error');
            isDetecting = false;
            return;
        }
        
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        
        // Draw boxes
        detections.forEach((detection) => {
            const { x, y, width, height } = detection.detection.box;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
        });
        
        displayResults(detections, 'video');
        
        if (isDetecting) {
            requestAnimationFrame(detectFaces);
        }
    } catch (error) {
        console.error('Detection error:', error);
        if (isDetecting) {
            requestAnimationFrame(detectFaces);
        }
    }
}

// Display results
function displayResults(detections, mode) {
    const container = mode === 'image' ? 
        document.getElementById('imageResults') : 
        document.getElementById('videoResults');
    
    if (!container || detections.length === 0) {
        if (container) container.innerHTML = '';
        return;
    }
    
    let html = '';
    detections.forEach((detection, index) => {
        const expressions = detection.expressions;
        const topEmotion = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
        );
        const confidence = Math.round(expressions[topEmotion] * 100);
        const emoji = emotionEmojis[topEmotion] || '😐';
        
        html += `
            <div class="emotion-card">
                <div class="emotion-label">Face ${index + 1}</div>
                <div class="emotion-emoji">${emoji}</div>
                <div class="emotion-name">${topEmotion}</div>
                <div class="emotion-percentage">${confidence}% Confident</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('✓ Page loaded, ready to use');
    
    if (typeof faceapi === 'undefined') {
        console.error('❌ Face-API library not loaded');
        showStatus('❌ Face-API library failed to load', 'error');
    } else {
        console.log('✓ Face-API library detected');
        // Load models in background
        loadModels();
    }
});

console.log('✓ Script ready');