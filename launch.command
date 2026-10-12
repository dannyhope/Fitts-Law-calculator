#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DOMAIN="$(tr -d '[:space:]' < "$ROOT/.local-domain")"
SESSION="${DEV_TMUX_SESSION:-danny-dev}"
WINDOW="$(basename "$ROOT")"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is required. Install it with: brew install tmux"
  read -r -p "Press Return to close..."
  exit 1
fi

"$ROOT/scripts/ensure-local-domain.sh"

"$HOME/.claude/scripts/dev-tmux.sh" ensure \
  --name "$WINDOW" \
  --dir "$ROOT" \
  -- npm run dev

open "http://$DOMAIN/"
echo "Fitts' Law Calculator is running at http://$DOMAIN/"
echo "Attach to the development session with: tmux attach -t $SESSION"
