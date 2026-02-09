# Emotion Companion - Project Overview

## 📖 Introduction
**Emotion Companion** is an interactive AI application that detects a user's real-time emotions via webcam and responds with an empathetic 3D avatar. The avatar converses with the user using voice interaction and lip-syncing driven by state-of-the-art LLMs.

## 🏗 Tech Stack

### Backend (Python)
- **FastAPI**: Main web server and API handler.
- **Socket.IO**: Real-time bidirectional communication for video frames and emotion states.
- **DeepFace (OpenCV/RetinaFace)**: specialized facial attribute analysis for detecting emotions from images.
- **Groq API (Llama-3)**: Generates conversational, empathetic AI responses.
- **Pydantic**: Data validation.

### Frontend (Web)
- **HTML5 / CSS3**: Core structure and glassmorphism styling.
- **JavaScript (Vanilla)**: Main logic for camera handling, events, and API calls.
- **Three.js**: Renders the 3D animated avatar (`.glb` model).
- **Socket.IO Client**: Communicates with the backend.
- **Web Speech API**: Handles Speech-to-Text (STT) and Text-to-Speech (TTS).

## 🧩 Architecture Flow
1.  **Input**: User's webcam captures video frames.
2.  **Transmission**: Frames are sent via Socket.IO/REST to the backend.
3.  **Processing**:
    -   `emotion.py` detects raw emotions (Happy, Sad, Angry, etc.).
    -   `emotion_smoothing.py` stabilizes detections to prevent flickering.
4.  **Interaction**:
    -   User speaks -> Speech converted to text.
    -   Text + Emotion sent to `chatbot_llm.py`.
    -   LLM generates a supportive response.
5.  **Output**:
    -   Avatar animates and lip-syncs to the TTS response.
    -   Avatar changes expression/pose based on the user's emotion.

## 📂 Key File Structure

### Backend (`/backend`)
| File | Description |
| :--- | :--- |
| `main.py` | Entry point. Configures FastAPI, CORS, and Socket.IO server. |
| `ws.py` | Handles WebSocket events for real-time emotion processing. |
| `emotion.py` | Core logic using DeepFace to analyze facial expressions. |
| `emotion_smoothing.py` | Implements a rolling window to stabilize emotion outputs. |
| `chatbot_llm.py` | Interface for the Groq LLM to generate character responses. |
| `requirements.txt` | Python dependencies list. |

### Frontend (`/frontend`)
| File | Description |
| :--- | :--- |
| `index.html` | Application UI layout with 3D canvas and controls. |
| `script.js` | Orchestrates the camera, Three.js scene, lip-sync, and network calls. |
| `style.css` | visual styling for the application. |
| `models/` | Directory containing the 3D Avatar assets (`avatar.glb`). |

## 🚀 Setup & Usage
1.  **Backend**: Install dependencies (`pip install -r requirements.txt`) and run `uvicorn main:app --reload`.
2.  **Frontend**: Open `index.html` via a local server (e.g., Live Server) or simply open the file (though local server is recommended for camera permissions).
3.  **Env Vars**: Ensure `GROQ_API_KEY` is set for the backend LLM features.
