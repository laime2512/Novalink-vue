#!/bin/bash

# Script para levantar la aplicación Novalink - versión mejorada

# Configuración de directorios
FRONTEND_DIR="/mnt/d/Users/Royeth/Desktop/saul/vfinal/novalink2"
BACKEND_DIR="/mnt/d/Users/Royeth/Desktop/saul/vfinal/novalink2/backend"

# Archivos de log
FRONTEND_LOG="frontend.log"
BACKEND_LOG="backend.log"

# Función para limpiar al salir
cleanup() {
    echo ""
    echo "Deteniendo la aplicación..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    echo "Aplicación detenida."
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

echo "========================================"
echo "  Iniciando Aplicación Novalink"
echo "========================================"
echo "Frontend: $FRONTEND_DIR"
echo "Backend:  $BACKEND_DIR"
echo "========================================"

# Iniciar frontend
echo "Iniciando frontend..."
cd "$FRONTEND_DIR"
npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "Frontend iniciado (PID: $FRONTEND_PID)"
echo "Logs en: $FRONTEND_DIR/$FRONTEND_LOG"

# Iniciar backend
echo "Iniciando backend..."
cd "$BACKEND_DIR"
npm run dev > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "Backend iniciado (PID: $BACKEND_PID)"
echo "Logs en: $BACKEND_DIR/$BACKEND_LOG"
echo "========================================"

# Mostrar logs en tiempo real
echo "Mostrando logs en tiempo real (Ctrl+C para detener)..."
echo ""

# Opción: mostrar logs de ambos procesos
tail -f "$FRONTEND_DIR/$FRONTEND_LOG" "$BACKEND_DIR/$BACKEND_LOG" &
TAIL_PID=$!

# Esperar señal de interrupción
wait $FRONTEND_PID $BACKEND_PID
