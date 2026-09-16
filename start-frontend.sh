#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/home/josi-coder/.nvm/versions/node/v20.20.0/bin:$PATH"

cd "$DIR/frontend/back-office-ui"
exec npm run dev
