#!/bin/bash
echo "🚀 Iniciando servidores..."
cd backend && npm run dev &
cd .. && npm run dev &
wait