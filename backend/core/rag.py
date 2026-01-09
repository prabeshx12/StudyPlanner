import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_openai import OpenAIEmbeddings, ChatOpenAI # Commented out to prevent import error
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
# from langchain_huggingface import HuggingFaceEmbeddings # Removed global import
from dotenv import load_dotenv

load_dotenv(override=True)

class RAGManager:
    def __init__(self, db_path: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.db_path = db_path if db_path else os.path.join(base_dir, "db", "faiss_index")
        
        # 1. Embeddings: Always need some embedding model.
        # Fallback to OpenAI if available, otherwise would need HuggingFace (locally).
        # 1. Embeddings: Always need some embedding model.
        # Use local HuggingFace embeddings explicitly.
        print("Using local HuggingFace embeddings...")
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
            self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        except ImportError:
             # CRITICAL: If you use Groq for Chat, you still need Embeddings! 
             # Since we removed heavy libraries, this might be a blocker unless you have OpenAI key JUST for embeddings 
             # or install sentence-transformers.
             # For now, let's assume the user might have an OpenAI Key with SOME quota, or we guide them.
             # Actually, most users use OpenAI embeddings (cheap) + Groq (fast LLM).
             # If quota is totally out, we MUST use local embeddings.
             raise ImportError(
                "No embedding model available! OpenAI quota exceeded/missing AND langchain_huggingface not installed. "
                "Install 'langchain-huggingface' to use free local embeddings."
            )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        self.vector_store = None
        self._load_vector_store()

    def _get_llm(self, temperature: float = 0):
        # Prefer Groq if available
        if os.getenv("GROQ_API_KEY"):
            return ChatGroq(model_name="llama-3.3-70b-versatile", temperature=temperature)
        
        raise ValueError("GROQ_API_KEY not found! Please check your .env file.")
            
    def _load_vector_store(self):
        if os.path.exists(self.db_path):
            try:
                self.vector_store = FAISS.load_local(
                    self.db_path, 
                    self.embeddings, 
                    allow_dangerous_deserialization=True
                )
            except Exception as e:
                print(f"Error loading vector store: {e}")

    def ingest_pdf(self, file_path: str):
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(chunks, self.embeddings)
        else:
            self.vector_store.add_documents(chunks)
        
        self.vector_store.save_local(self.db_path)
        return len(chunks)

    def query(self, question: str):
        if not self.vector_store:
            self._load_vector_store() # Try loading again just in case
        
        if not self.vector_store:
            return {"answer": "No documents uploaded yet. Please upload study materials first.", "sources": []}

        llm = self._get_llm()
        
        system_prompt = (
            "You are an AI Study Assistant. Use the following pieces of context to answer the student's question. "
            "If you don't know the answer, just say that you don't know, don't try to make up an answer. "
            "Stay grounded in the provided context. If the question is not related to the context, "
            "politely inform the student that you can only answer questions based on their study materials.\\n\\n"
            "{context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(self.vector_store.as_retriever(), question_answer_chain)
        
        result = rag_chain.invoke({"input": question})
        
        return {
            "answer": result["answer"],
            "sources": [doc.metadata.get("source", "Unknown") for doc in result["context"]]
        }

    def generate_quiz(self, num_questions: int = 5):
        if not self.vector_store:
            self._load_vector_store()
            
        if not self.vector_store:
            return "No documents uploaded yet."

        import random
        # Higher temperature for variety in questions
        llm = self._get_llm(temperature=0.7)
        
        # Define a few potential search seeds for variety
        seeds = ["key concepts", "important definitions", "summary", "main topics", "details", "core principles"]
        query = random.choice(seeds)
        
        # Get more docs and shuffle them for variety
        docs = self.vector_store.similarity_search(query, k=15)
        random.shuffle(docs)
        selected_docs = docs[:6] # Grab a random slice for variety
        
        context = "\n\n".join([doc.page_content for doc in selected_docs])

        prompt_text = f"""Based on the following context from study materials, generate {num_questions} Multiple Choice Questions (MCQs).
        
IMPORTANT: Ensure the questions are diverse and cover different parts of the context provided. Do not repeat the same questions.

Each question should:
- Have 4 options labeled A, B, C, D
- Specify the correct answer
- Include a brief explanation

Format your response as a valid JSON array like this:
[
  {{
    "question": "What is...",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "answer": "A",
    "explanation": "..."
  }}
]

Context:
{context}

Generate exactly {num_questions} questions BASED ON THE CONTEXT. Return ONLY the JSON array, no other text."""

        response = llm.invoke(prompt_text)
        return response.content

    def clear_database(self):
        import shutil
        import time
        # Clear in-memory state
        self.vector_store = None
        
        # Give a moment for file handles to close
        time.sleep(0.5)
        
        # Clear database folder
        if os.path.exists(self.db_path):
            try:
                shutil.rmtree(self.db_path)
            except Exception as e:
                print(f"Retry clearing db: {e}")
                # If rmtree fails, the folder stays but we try to clear contents
                pass
            
        # Clear uploads folder
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        uploads_dir = os.path.join(base_dir, "uploads")
        if os.path.exists(uploads_dir):
            try:
                shutil.rmtree(uploads_dir)
                os.makedirs(uploads_dir, exist_ok=True)
            except:
                pass
            
        return True

rag_manager = RAGManager()
