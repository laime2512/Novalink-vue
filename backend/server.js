import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configurado
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Variables de entorno
const ERP_API_URL = 'https://erp.axarinternational.com/api/index.php/';
const ERP_LOGIN = process.env.ERP_LOGIN || 'axar.erp';
const ERP_PASSWORD = process.env.ERP_PASSWORD || 'nvaxarerp2025';

// Endpoint de salud
app.get('/api/health', (req, res) => {
  console.log('✅ Health check recibido');
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para obtener token
app.get('/api/auth/token', async (req, res) => {
  try {
    console.log('🔐 Solicitando token de ERP...');
    
    const response = await fetch(`${ERP_API_URL}login?login=${ERP_LOGIN}&password=${ERP_PASSWORD}`);
    
    if (!response.ok) {
      throw new Error(`ERP API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Token obtenido');
    
    res.json({ 
      success: true, 
      token: data.success.token,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en /api/auth/token:', error.message);
    res.status(500).json({ 
      error: 'Error interno',
      message: error.message 
    });
  }
});

// Endpoint para crear contactos
app.post('/api/contacts', async (req, res) => {
  try {
    const { token, contactData } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    
    console.log('📝 Creando contacto:', contactData);
    
    const response = await fetch(`${ERP_API_URL}contacts`, {
      method: 'POST',
      headers: {
        'DOLAPIKEY': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    
    const responseText = await response.text();
    console.log('📊 Respuesta ERP:', response.status, responseText);
    
    if (response.ok) {
      res.json({ 
        success: true, 
        contactId: responseText.trim(),
        message: 'Contacto creado exitosamente'
      });
    } else {
      res.status(response.status).json({ 
        error: 'Error ERP', 
        details: responseText 
      });
    }
    
  } catch (error) {
    console.error('❌ Error en /api/contacts:', error);
    res.status(500).json({ 
      error: 'Error interno',
      message: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend Node.js corriendo en:`);
  console.log(`   📍 http://localhost:${PORT}`);
  console.log(`   📍 http://127.0.0.1:${PORT}`);
  console.log(`🔐 Usando credenciales para: ${ERP_LOGIN}`);
  console.log(`🌐 CORS habilitado para: http://localhost:5173`);
});