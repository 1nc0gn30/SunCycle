#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/images

download() {
  local prompt="$1"
  local w="$2"
  local h="$3"
  local out="$4"
  local encoded
  encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$prompt'''))")
  curl -L -o "public/images/$out" "https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true"
  echo "Downloaded $out"
}

download "abstract golden sunrise aurora over dark ocean waves, warm amber and deep indigo, cinematic lighting, minimalist digital art, high contrast, no text" 1920 1080 hero-bg.jpg
download "cross section of human eye showing retina and ipRGC nerve cells glowing cyan blue, scientific medical illustration, dark background, high detail, anatomical diagram" 1024 1024 science-eye.jpg
download "human brain with suprachiasmatic nucleus highlighted in golden light, scientific visualization, dark background, neural pathways, minimalist" 1024 1024 science-brain.jpg
download "abstract light spectrum gradient from deep blue through cyan to warm amber and gold, representing melanopic sensitivity, dark background, scientific art" 1920 600 science-spectrum.jpg
download "elegant morning lark bird silhouetted against brilliant golden sunrise, minimalist illustration, warm amber tones, dark navy background, no text" 800 800 chronotype-lark.jpg
download "peaceful white dove in soft warm morning light, minimalist illustration, neutral warm tones, dark background, serene, no text" 800 800 chronotype-dove.jpg
download "majestic owl perched under crescent moon with stars, deep blue and silver tones, minimalist illustration, dark night background, no text" 800 800 chronotype-owl.jpg
download "abstract earth globe with sun rays and circadian cycle rings, golden light beams, dark space background, minimalist scientific art, no text" 1200 630 about-visual.jpg

echo "All images downloaded to public/images/"
