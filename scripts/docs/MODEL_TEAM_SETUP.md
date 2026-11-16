# Fire & Smoke: how the model team connects their model

The HeightX-Safe dashboard does **not** contain the model. It has a job queue.
You run a **worker** on your own machine (laptop or Kaggle GPU). The worker takes
uploaded videos from our queue, runs **your** model on them, and sends the results
back. Because you pass your own weights, code and settings to the worker, you can
change the model whenever you like and we change nothing.

We will send you two things separately (never put them in a public repo):

- **API URL**, e.g. `https://xxxx.trycloudflare.com/api/fire-smoke`
- **Worker token**, a secret string

## 1. Get the worker

```
git clone https://github.com/Nidhi010805/ntpc-ai-safety-system.git
cd ntpc-ai-safety-system/fire_smoke_worker
pip install -r requirements.txt
```

PyTorch must be installed as well (CPU build is enough for a laptop).

## 2. Run it with your model

Windows (PowerShell):

```
$env:WORKER_API_TOKEN = "<token we sent>"
python worker.py `
  --api "<API URL we sent>" `
  --weights "C:\path\to\your\best.pt" `
  --model-code "C:\path\to\your\fire-and-smoke" `
  --model-name "Model 8 - short description" `
  --conf 0.80 --exit-conf 0.65 --window 15 --enter-hits 6
```

Kaggle notebook (GPU):

```python
import os
os.environ["WORKER_API_TOKEN"] = "<token we sent>"
!pip install -q timm httpx imageio-ffmpeg
!git clone -q https://github.com/Nidhi010805/ntpc-ai-safety-system.git /kaggle/working/app
!python /kaggle/working/app/fire_smoke_worker/worker.py \
    --api "<API URL we sent>" \
    --weights /kaggle/input/YOUR-DATASET/best.pt \
    --model-code /kaggle/working/fs \
    --model-name "Model 8 - short description"
```

When it works you will see `Waiting for videos ...`. The dashboard then shows
**AI worker running** together with the `--model-name` you passed.

## 3. Changing your model later

Just restart the worker with a different `--weights`, `--model-code`,
`--model-name`, `--conf`, `--window` or `--enter-hits`. Nothing changes on our side.
Please keep the worker running while we demo.

## 4. What must NOT change (or tell us first)

The worker depends on these. If you change any of them, we must update `worker.py`.

**Script and arguments** (inside your repo):

```
scripts/predict_video_dinov3.py
  --weights --label --source --output --events
  --conf --exit-conf --window --enter-hits --stride --device
```

**Events CSV columns:**

```
frame, time_s, event, class, score, x1, y1, x2, y2, detail
```

**Event names:** `ALARM_ON`, `OCCLUDED_FIRE_CUE`.
**Class names:** `fire`, `smoke`.

If your new model needs a different script or different outputs, send us the new
script name, its arguments and a sample CSV before you switch.