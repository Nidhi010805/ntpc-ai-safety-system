# Fire & smoke inference worker

The Fire & Smoke page uploads a video to the backend, which queues it as a job
(`backend/routes/fire_smoke.py`). This worker processes those jobs.

For each job it runs the fire-and-smoke team's **Model 7** (DINOv3 ViT-S +
Faster R-CNN, 896 px) with that team's own script, `predict_video_dinov3.py`.
It then sends back three things:

- the annotated video, re-encoded to H.264 so the browser can play it;
- the alarm log (CSV);
- a summary: verdict, alarms, first alarm time, highest confidence.

The page shows the summary and the log. Clicking a time in the log jumps the
video to that moment.

An alarm needs the same fire or smoke in **6 of 15 checks** at confidence 0.80
or more, which are the values the model team uses for Model 7.

The worker only talks to the backend over HTTP. It can run on this laptop
(CPU) or in a Kaggle notebook (GPU).

## Files you need

- **The model.** Copy `weights/best.pt` from the training results
  (`dinov3_896_negs_smallfire_results.zip`) to
  `fire_smoke_worker/models/model7_dinov3_896_negs.pt`. It is about 160 MB
  and git-ignored. Never commit it: GitHub rejects files over 100 MB.
- **The model team's code.** Nothing to do. On first run the worker clones
  github.com/CoderIsSleeping/fire-and-smoke into `fire_smoke_worker/fire-and-smoke/`
  (git-ignored), pinned to the commit it was tested with.

## Run it on this laptop

The worker needs PyTorch, which needs a **python.org Python 3.11 or 3.12**. The
MSYS2 Python (`C:\msys64\...`) cannot install PyTorch. Create the environment
**outside OneDrive**, because it is about 1 GB:

```powershell
py -3.11 -m venv C:\venvs\heightx
C:\venvs\heightx\Scripts\activate
pip install -r backend\requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r fire_smoke_worker\requirements.txt
```

Then use two terminals, with the **same token** in both (any secret string):

```powershell
# terminal 1: backend
cd backend
$env:WORKER_API_TOKEN = "choose-a-secret"
uvicorn app:app --reload

# terminal 2: worker
$env:WORKER_API_TOKEN = "choose-a-secret"
python fire_smoke_worker\worker.py
```

The page now shows **"AI worker running"**. Upload a video and the progress bar
moves while the worker processes it.

**Speed on a laptop CPU:** about 2 s per checked frame. The worker checks every
5th frame, so one second of video takes roughly **10–15 s**. A 5 s clip took
78 s; a 20 s clip took 3.8 min. Short clips are best for a demo.

## Run it on Kaggle (GPU, much faster)

Kaggle has to reach the backend over the internet, so expose your local
backend with a tunnel first, for example
`cloudflared tunnel --url http://localhost:8000`. That prints a
`https://….trycloudflare.com` address.

In a notebook with **GPU T4** and **Internet on**, add the model file as a
dataset, then run:

```python
!pip install -q timm httpx imageio-ffmpeg
!git clone -q https://github.com/Nidhi010805/ntpc-ai-safety-system.git /kaggle/working/app
import os
os.environ["WORKER_API_TOKEN"] = "choose-a-secret"   # the same token as the backend
!python /kaggle/working/app/fire_smoke_worker/worker.py \
    --api https://YOUR-TUNNEL.trycloudflare.com/api/fire-smoke \
    --weights /kaggle/input/YOUR-DATASET/best.pt
```

On a GPU the worker checks every 2nd frame. The model team measured about 20
checks per second on a T4.

## Good to know

- **Worker stopped mid-job** (closed, crashed, Kaggle session ended): the job
  is put back in the queue the next time a worker starts.
- **Unreadable file:** the job is marked failed and the page shows why.
- **Options:** `python worker.py --help` lists them all: `--stride`, `--conf`,
  `--device`, `--once` (stop after one job), and others.
