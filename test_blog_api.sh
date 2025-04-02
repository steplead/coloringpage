#!/bin/bash
curl -X POST http://localhost:3000/api/blog/auto-generate \
  -H "Content-Type: application/json" \
  -d '{"count": 1, "targetLength": 800}'
