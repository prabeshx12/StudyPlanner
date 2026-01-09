# 🎓 AI Study Assistant (PrepAI)

An intelligent study companion that uses AI to help students learn more effectively through RAG-based chat, quiz generation, and progress tracking.

## ✨ Features

- 📚 **Document Upload**: Upload PDF study materials (textbooks, notes, syllabi)
- 💬 **AI Chat**: Ask questions about your study materials and get contextual answers
- 📝 **Quiz Generation**: Auto-generate MCQ quizzes from your uploaded content
- 📊 **Analytics**: Track your progress and identify weak areas
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - RAG orchestration
- **FAISS** - Vector database for semantic search
- **Groq** - Fast, free LLM API (Llama 3.3 70B)
- **HuggingFace** - Local embeddings (free, no API key needed)

### Frontend
- **React** (Vite) - Fast, modern UI framework
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icon set
- **Framer Motion** - Smooth animations

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **Groq API Key** (free from https://console.groq.com/)

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd CIC_latest
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev -- --port 5173
```

**Access the app:** http://localhost:5173

## 🔑 API Keys

### Groq API Key (Required)
1. Go to https://console.groq.com/
2. Sign up for a free account
3. Create an API key
4. Add it to `backend/.env`:
   ```
   GROQ_API_KEY=your_key_here
   ```

### OpenAI API Key (Optional)
- Only needed if you want to use OpenAI embeddings instead of local HuggingFace embeddings
- The app works perfectly with free local embeddings!

## 📖 Usage

1. **Upload Study Materials**
   - Click "Upload Study Materials"
   - Select a PDF file (must be text-based, not scanned images)
   - Wait for processing to complete

2. **Chat with Your Materials**
   - Go to "Study Chat"
   - Ask questions about your uploaded content
   - Get AI-powered answers with source citations

3. **Generate Quizzes**
   - Go to "Generate Quiz"
   - Click "Generate New Quiz"
   - Answer questions and get instant feedback

4. **Track Progress**
   - Go to "Analytics"
   - View your quiz scores and identify weak areas

## 📝 Supported PDF Formats

✅ **Works with:**
- Text-based PDFs (where you can select/copy text)
- Digital documents (Word → PDF, typed documents)
- Most modern PDFs with embedded text

❌ **Doesn't work with:**
- Scanned images (without OCR)
- Image-heavy PDFs with no text
- Handwritten notes (scanned)

**How to check:** Open your PDF and try to select text. If you can select it, it will work!

## 🏗️ Project Structure

```
CIC_latest/
├── backend/
│   ├── api/           # API endpoints
│   ├── core/          # RAG logic
│   ├── db/            # FAISS vector store
│   ├── uploads/       # Uploaded PDFs
│   └── main.py        # FastAPI app
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app
│   │   └── index.css    # Styles
│   └── package.json
└── README.md
```

## 🐛 Troubleshooting

### "No documents uploaded yet"
- Make sure you uploaded a PDF successfully
- Check that the PDF is text-based (not a scanned image)
- Restart the backend server

### "Model decommissioned" error
- The Groq model name in `.env` might be outdated
- Update `MODEL_NAME` to `llama-3.3-70b-versatile`

### Quiz generation fails
- Ensure your PDF has extractable text
- Try uploading a different PDF
- Check backend logs for errors

### Frontend won't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify frontend is pointing to `http://localhost:8000`

## 🎯 Current Status

✅ **Fully Functional:**
- PDF upload and processing
- RAG-based chat with citations
- Quiz generation from study materials
- Progress tracking and analytics
- 100% free to run (using Groq + local embeddings)

## 📄 License

MIT License - feel free to use for your studies!

## 🙏 Acknowledgments

- **Groq** for providing fast, free LLM API
- **HuggingFace** for free local embeddings
- **LangChain** for RAG framework
- **FastAPI** for the amazing Python web framework

---

**Happy Studying! 📚✨**
