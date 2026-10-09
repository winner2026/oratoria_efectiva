#!/bin/bash
set -e

echo "Running prisma generate..."
npx prisma generate

if [ "$VERCEL_ENV" = "preview" ]; then
  echo "Preview environment detected. Running prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "Production environment. Skipping automatic migrations."
fi

echo "Running next build..."
npx next build
