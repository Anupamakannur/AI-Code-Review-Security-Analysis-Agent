Run instructions

Backend (PowerShell):

1. From workspace root run:

```powershell
# create venv, install deps, and run backend
powershell -ExecutionPolicy Bypass -File backend\scripts\setup_backend.ps1
```

2. The backend will be served at: http://127.0.0.1:8000/

3. To seed the knowledge base (optional, may download models and index):

```powershell
# activate the venv created by the script, then
. .venv\Scripts\Activate.ps1
python backend\scripts\seed_kb.py
```

Frontend (PowerShell):

1. From workspace root run:

```powershell
powershell -ExecutionPolicy Bypass -File frontend\scripts\run_frontend.ps1
```

2. Vite dev server URL appears in terminal (commonly http://localhost:5173/).

Notes:
- Ensure Python and Node.js are installed and on PATH.
- The first seed run downloads the sentence-transformers model and may take time and disk space.
- To change ports or host, edit `backend/app/config.py`.
