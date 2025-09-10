#!/bin/sh

npx prisma migrate dev --name init --skip-generate

npx prisma generate

npm run dev