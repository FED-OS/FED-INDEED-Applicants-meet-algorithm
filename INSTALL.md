# Installation Guide

## Prerequisites

- **Python 3.8 or newer** (3.10+ recommended) — check with `python --version`
- pip 21+ (`python -m pip --version`)
- ~200 MB of free disk space for the virtualenv

## Standard Install (pip + venv)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/FED-Indeed.git
cd FED-Indeed

# 2. Create an isolated environment
python -m venv venv

# 3. Activate it
source venv/bin/activate          # Linux / macOS
venv\Scripts\activate             # Windows (PowerShell: venv\Scripts\Activate.ps1)

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run
streamlit run app.py
```

Your browser opens at `http://localhost:8501` automatically.

## pipenv

```bash
pip install pipenv
pipenv install -r requirements.txt
pipenv run streamlit run app.py
```

## conda / mamba

```bash
conda create -n fed-indeed python=3.11 -y
conda activate fed-indeed
pip install -r requirements.txt
streamlit run app.py
```

## uv (fast alternative)

```bash
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
streamlit run app.py
```

## Verifying the Install

1. The app header reads **FED-Indeed: Reverse AI Resume Filter**.
2. Upload any PDF and paste any job description — the audit panels render
   within a second or two.
3. If the app loads but a check errors, see [FAQ.md](FAQ.md) and
   [wiki/Troubleshooting.md](wiki/Troubleshooting.md).

## Platform Notes

| Platform | Notes |
|---|---|
| Linux | Works out of the box; on minimal distros you may need `python3-venv` (`apt install python3-venv`). |
| macOS | Apple Silicon: use native Python 3.9+; no Rosetta needed. |
| Windows | PowerShell execution policy may block activation: run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` first. |

## Uninstall

Delete the project folder and the virtualenv directory — FED-Indeed writes
no config files or caches outside its folder.

## Upgrading

```bash
git pull
pip install -r requirements.txt --upgrade
```

Breaking changes are documented in [CHANGELOG.md](CHANGELOG.md).
