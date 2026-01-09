# 🎓 StudyPlanner: Your AI Study Companion

StudyPlanner is a professional, high-performance local AI study assistant. It uses Retrieval-Augmented Generation (RAG) to turn your textbooks, notes, and syllabi into an interactive learning environment where you can chat with your documents, generate custom practice quizzes, and track your academic progress—all for free.

## ✨ Key Features

- 📚 **Smart Digital Library**: Upload text-based PDFs. The AI indexes them for instant semantic search and retrieval.
- 💬 **Contextual Study Chat**: Ask questions directly about your course materials. Get precise answers with Markdown formatting (lists, bolding, code) and source citations.
- 📝 **Dynamic Practice Quizzes**: Generate randomized MCQ quizzes from different parts of your material. Features diverse questions, instant feedback, and detailed explanations.
- 📊 **Progress Analytics**: Track your quiz history, average accuracy, and study trends. Reset your stats anytime to start a new subject.
- 🎨 **Ultra-Legible "Paper" Theme**: Optimized for long study sessions with a soft, anti-glare background and high-contrast charcoal text to reduce eye strain.
- 💾 **Local-First Storage**: All your study data (quiz results, history) is stored directly in your browser's local storage for privacy and speed.

## 🚀 Technical Architecture

### Backend (Python)
- **FastAPI**: High-performance asynchronous web framework.
- **LangChain**: Orchestrating the RAG pipeline and document processing.
- **FAISS**: Local vector database for lightning-fast semantic retrieval.
- **Groq (Llama 3.3 70B)**: State-of-the-art LLM provider for fast, intelligent reasoning.
- **HuggingFace Embeddings**: Uses `all-MiniLM-L6-v2` locally (no API key needed, zero latency).

### Frontend (React)
- **Vite**: Modern build tool for a snappy development experience.
- **Lucide-React**: Clean, professional iconography.
- **React-Markdown**: High-fidelity rendering of AI responses.
- **Modern CSS**: Custom responsive layout with internal scrolling ("Window-Fit" design).

## 🛠️ Installation & Setup

### 1. Requirements
- **Python 3.9+**
- **Node.js 18+**
- **Groq API Key** (Get one for free at [console.groq.com](https://console.groq.com/))

### 2. Backend Setup
```bash
# Enter project directory
cd CIC_latest

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # On Linux/Mac: source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure API Key
# Rename .env.example to .env and add your key:
# GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Running the App
- **Start Backend**: `cd backend && python main.py`
- **Start Frontend**: `cd frontend && npm run dev`
- **Access App**: `http://localhost:5173`

## 📖 Feature Guide

### 📂 Uploading Content
- Drag or select a **text-based PDF** (scanned images are not yet supported).
- Click **"Start Processing"** to index.
- Use **"Clear All Files"** to wipe your digital library and search index for a new subject.

### 📝 Taking Quizzes
- Select the number of questions (5, 10, or 15).
- The AI shuffles through your entire context to ensure **variety** and **no repetition**.
- Set to a higher "Temperature" (0.7) for creative and diverse question sets.

### 📈 Tracking Progress
- View your **Usage Statistics** (shown in KB or % in the sidebar).
- Review recent quiz history and performance insights.
- Use **"Reset Statistics"** in the Progress tab to clear your local records.

## 🏗️ Project Structure
```
StudyPlanner/
├── backend/
│   ├── api/           # Router endpoints (Chat, Quiz, Upload)
│   ├── core/          # RAGManager (Indexing, Search, Generation)
│   ├── db/            # FAISS Local index storage
│   ├── uploads/       # Physical PDF storage
│   └── main.py        # FastAPI Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Modular UI (Chat, Quiz, Sidebar, etc.)
│   │   ├── App.jsx      # Root component & Routing logic
│   │   └── index.css    # Paper Theme & Design System
│   └── package.json
└── README.md
```

## 🎯 Current Status
- ✅ **Fully Resolved**: Global scrolling issues removed.
- ✅ **Optimized**: High-legibility eye-care theme implemented.
- ✅ **Fixed**: Backend robust deletion for Windows file handling.
- ✅ **Upgraded**: Markdown support for better reading in Chat.

---

**Happy Studying! 📚✨** 
*StudyPlanner - Academic content at your fingertips.*
