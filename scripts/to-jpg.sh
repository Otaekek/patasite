#!/usr/bin/env bash
# Convert images (any format ffmpeg can read) to compressed .jpg, in place.
# The original file is replaced by <name>.jpg.
#
# Usage: scripts/to-jpg.sh <image>...
# Env:   QUALITY   ffmpeg -q:v, 2 (best) .. 31 (worst), default 5
#        MAX_WIDTH downscale wider images to this width, default 1920 (0 = keep size)
set -euo pipefail

QUALITY="${QUALITY:-5}"
MAX_WIDTH="${MAX_WIDTH:-1920}"

if [ $# -eq 0 ]; then
  echo "usage: $0 <image>..." >&2
  exit 1
fi

filter="format=yuvj420p"
if [ "$MAX_WIDTH" -gt 0 ]; then
  filter="scale='min(iw,$MAX_WIDTH)':-2,$filter"
fi

for in in "$@"; do
  if [ ! -f "$in" ]; then
    echo "skip: $in (not a file)" >&2
    continue
  fi

  out="${in%.*}.jpg"
  tmp="${in%.*}.tmp-$$.jpg"

  if ffmpeg -nostdin -loglevel error -y -i "$in" \
      -vf "$filter" -q:v "$QUALITY" -frames:v 1 -update 1 -map_metadata -1 \
      "$tmp"; then
    before=$(stat -c %s "$in")
    [ "$in" != "$out" ] && rm -f -- "$in"
    mv -f -- "$tmp" "$out"
    after=$(stat -c %s "$out")
    echo "$in -> $out ($((before / 1024))K -> $((after / 1024))K)"
  else
    rm -f -- "$tmp"
    echo "fail: $in" >&2
  fi
done
