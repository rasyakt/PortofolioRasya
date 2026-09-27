#!/bin/sh
# Container entrypoint: fix upload-dir ownership (named volumes mount as
# root), run migrations, then drop privileges and boot the server.
# Usage: entrypoint "server"  (any other arg is executed directly instead)
set -e

if [ "$1" = "server" ]; then
  mkdir -p /app/public/covers /app/public/badges /app/public/docs
  chown -R nextjs:nodejs /app/public/covers /app/public/badges /app/public/docs
  node node_modules/prisma/build/index.js migrate deploy
  exec su-exec nextjs node server.js
fi

exec "$@"
