
# 🎭 Emotion Companion AI

> **An interactive AI that sees, hears, and empathizes with you.**

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Backend-FastAPI-blue?logo=fastapi)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)

**Emotion Companion** is a cutting-edge web application that uses real-time computer vision to detect your emotions via webcam and responds with an empathetic 3D avatar. The avatar interacts with you using natural voice conversations and lip-syncing animations, powered by state-of-the-art Large Language Models (LLMs).

## ✨ Features

- **👀 Real-time Emotion Detection**: Analyzes facial expressions instantly using DeepFace and OpenCV.
- **🗣️ Natural Voice Interaction**: Talk to the avatar, and it talks back with lip-sync.
- **🤖 Empathetic AI**: Powered by Groq (Llama-3) to provide supportive and context-aware responses.
- **🎨 3D Avatar**: A fully animated 3D character rendered with Three.js / React Three Fiber.
- **⚡ Reactive UI**: Modern, glassmorphism-inspired interface built with Next.js and TailwindCSS.

## 🏗️ Tech Stack

### Frontend (`/myapp`)
- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Communication**: Socket.IO Client

### Backend (`/backend`)
- **Server**: [FastAPI](https://fastapi.tiangolo.com/)
- **Vision**: DeepFace, OpenCV
- **AI/LLM**: Groq API (Llama-3)
- **Real-time**: Python-SocketIO

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **Groq API Key**: You need an API key from [Groq Console](https://console.groq.com/).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/emotion-companion.git
cd emotion-companion
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration:**
Create a `.env` file in the `backend/` directory and add your API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory (`myapp`), and install dependencies.

```bash
cd myapp
npm install
```

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers.

### Option A: Run Separately (Recommended)

**Terminal 1 (Backend):**
```bash
cd backend
# Ensure venv is activated
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd myapp
npm run dev
```

### Option B: Run Concurrently (Root Script)
If you have set up your backend virtual environment specifically in `backend/venv2`, you can use the root script:

```bash
# In the root directory
npm install
npm run dev
```
*Note: This requires the backend venv to be named `venv2` inside the `backend` folder.*

## 📂 Project Structure

```
├── backend/                # FastAPI Backend
│   ├── main.py             # Entry point, API & Socket.IO
│   ├── emotion.py          # Emotion detection logic
│   ├── emotion_smoothing.py # Stabilizes emotion capability
│   ├── chatbot_llm.py      # Groq LLM integration
│   └── requirements.txt    # Python dependencies
│
├── myapp/                  # Next.js Frontend
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Shared utilities
│   ├── public/             # Static assets (3D models, icons)
│   │   └── models/         # Contains avatar.glb
│   └── package.json        # Frontend dependencies
│
└── package.json            # Root scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
