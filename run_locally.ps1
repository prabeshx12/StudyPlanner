
# 1. Create virtual environment
python -m venv venv

# 2. Activate it (PowerShell)
.\venv\Scripts\activate

# 3. Upgrade pip
python.exe -m pip install --upgrade pip

# 4. Install LIGHTWEIGHT dependencies
pip install -r backend/requirements.txt

# 5. Run the server
cd backend
python main.py
