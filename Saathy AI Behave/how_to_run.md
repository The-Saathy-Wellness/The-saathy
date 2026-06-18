# How to Run the Saathy AI Prompt Engineering Control Plane

Follow these step-by-step instructions to run the Streamlit control plane on your local machine.

---

### Step 1: Open Your Terminal
Open PowerShell, Command Prompt, or your terminal of choice and navigate to the project directory:
```powershell
cd "M:\Durvesh Developments\Companion App\The-saathy\Saathy AI Behave"
```

### Step 2: Configure Environment Variables
You must configure your API credentials before launching:
1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Open the newly created `.env` file in your text editor.
3. Fill in your API keys (and save the file):
   ```env
   OPENAI_API_KEY=your-actual-openai-key
   ANTHROPIC_API_KEY=your-actual-anthropic-key
   ```

### Step 3: Run the Application
Start the Streamlit web server using the local virtual environment (`venv`) to run the application:
```powershell
venv\Scripts\python -m streamlit run app.py
```

### Step 4: Access the UI
Once the server initializes, you will see output in the terminal:
```text
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.1.103:8501
```
Open your web browser and navigate to **[http://localhost:8501](http://localhost:8501)**.

---

### Troubleshooting
* **Error: Streamlit command not recognized**
  Ensure you are using the virtual environment path: `venv\Scripts\python -m streamlit run app.py`. Do **not** run raw `streamlit run app.py` unless you have Streamlit installed globally on your machine's environment path.
* **Missing packages**
  If you get a `ModuleNotFoundError`, re-install the dependencies using:
  ```powershell
  venv\Scripts\python -m pip install -r requirements.txt
  ```
