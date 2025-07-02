#!/bin/bash

echo "🕷️  Démarrage du scan OWASP ZAP..."

# Variables
ZAP_API_KEY="zap-api-key"
TARGET_URL="http://vulnerable-app:3000"
ZAP_URL="http://localhost:8080"

# Attendre que les services soient prêts
sleep 10

# Scan rapide
docker exec zap-scanner zap-baseline.py \
  -t $TARGET_URL \
  -J zap-report.json \
  -r zap-report.html \
  -w zap-report.md

# Copier les rapports
docker cp zap-scanner:/zap/wrk/zap-report.json ./reports/
docker cp zap-scanner:/zap/wrk/zap-report.html ./reports/
docker cp zap-scanner:/zap/wrk/zap-report.md ./reports/

echo "✅ Scan terminé! Rapports dans ./reports/"