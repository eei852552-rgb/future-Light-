#!/usr/bin/env bash
set -euo pipefail

if [[ ! -d android ]]; then
  echo "android/ is missing; generating it with Capacitor..."
  npx cap add android
else
  echo "android/ already exists; preserving the native project."
fi

npx cap sync android
