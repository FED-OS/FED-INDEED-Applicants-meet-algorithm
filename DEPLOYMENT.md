# Deployment Guide

FED-Indeed is deliberately trivial to host because it is stateless: no
database, no auth store, no user accounts. Any platform that can run a
Streamlit app can run it.

## Option 1 — Streamlit Community Cloud (recommended, free)

Best for a public demo tied to your GitHub repo.

1. Push the repository to GitHub (make sure `requirements.txt`,
   `app.py`, and `social-image.png` are committed).
2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with
   GitHub.
3. **New app** → select your repo → branch `main` → main file path `app.py`.
4. Click **Deploy**. First boot takes ~1–2 minutes; subsequent pushes to
   `main` redeploy automatically.

Notes:

- The free tier hosts one app per account — perfect for the official demo.
- Because the app stores nothing, there is no data-protection overhead for a
  public deployment.
- Keep `YOUR_USERNAME` in the ko-fi links consistent with your actual handle
   — find-and-replace across the repo before deploying.

## Option 2 — Docker

Create a `Dockerfile` (not shipped by default to keep the repo lean):

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

```bash
docker build -t fed-indeed .
docker run -p 8501:8501 fed-indeed
```

## Option 3 — Bare metal / VPS

```bash
git clone https://github.com/YOUR_USERNAME/FED-Indeed.git
cd FED-Indeed
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
streamlit run app.py --server.port 8501 --server.headless true
```

Put it behind nginx/caddy for TLS, and run it under `systemd` or `tmux` for
persistence.

## Configuration Reference

FED-Indeed reads no environment variables and has no config file. Optional
`styles.css` at the repo root is auto-loaded if present.

## Self-Hosting Security Notes

- **Run `--server.headless true`** on servers so Streamlit doesn't try to
  open a browser.
- Set `--server.enableCORS=false` only if you understand the implications;
  defaults are safe for single-app deployments.
- Add authentication (e.g., OAuth proxy) if you deploy a *modified* version
  that persists anything — the stock app is stateless and needs none.
- See [SECURITY.md](SECURITY.md) for the privacy model and reporting.
