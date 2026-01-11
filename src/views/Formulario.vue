<script setup>
import { reactive, ref } from 'vue';

const formularioState = reactive({
  empresa: '',
  contacto: '',
  email: '',
  telefono: '',
  interes: '',
  mensaje: '',
  consulta: 'demo',
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// ⚠️ URL DIRECTA al backend Node.js
const API_BASE = 'http://localhost:3001/api/';

// --- FUNCIÓN PRINCIPAL PARA ENVIAR EL FORMULARIO ---
const formNovalink = async () => {
  //console.log('📤 Enviando formulario...');
  
  // Resetear mensajes
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  
  // Validación básica
  if (!formularioState.empresa || !formularioState.contacto || !formularioState.email || !formularioState.telefono) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios (*)';
    isLoading.value = false;
    return;
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formularioState.email)) {
    errorMessage.value = 'Por favor, ingresa un email válido';
    isLoading.value = false;
    return;
  }

  try {
    // PASO 1: Obtener token del backend
    //console.log('1. Obteniendo token...');
    console.log('URL token:', `${API_BASE}auth/token`);
    
    const tokenResponse = await fetch(`${API_BASE}auth/token`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json'
      }
    });

    console.log('Status token:', tokenResponse.status);
    
    // Leer respuesta como texto primero
    const tokenText = await tokenResponse.text();
    //console.log('Respuesta token (texto):', tokenText);
    
    if (!tokenResponse.ok) {
      throw new Error(`Error obteniendo token: ${tokenResponse.status} - ${tokenText}`);
    }

    // Parsear JSON
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      throw new Error(`Error parseando token: ${e.message}. Respuesta: ${tokenText}`);
    }
    
    if (!tokenData.token) {
      throw new Error('Token no recibido en la respuesta');
    }
    
    const API_TOKEN = tokenData.token;
   // console.log('✅ Token obtenido:', API_TOKEN);

    // PASO 2: Preparar datos para la API
    const datosParaAPI = {
      lastname: formularioState.contacto.trim(),
      firstname: formularioState.empresa.trim(), 
      email: formularioState.email.trim(),
      phone: formularioState.telefono.trim(),
      note_public: `Empresa: ${formularioState.empresa}\nInterés: ${formularioState.interes}\nConsulta: ${formularioState.consulta}\nMensaje: ${formularioState.mensaje}`,
      client: 1, 
    };
    
    console.log('📦 Datos a enviar:', datosParaAPI);
    
    // PASO 3: Enviar datos al backend
    console.log('URL crear contacto:', `${API_BASE}contacts`);
    
    const response = await fetch(`${API_BASE}contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        token: API_TOKEN,
        contactData: datosParaAPI
      })
    });

    console.log('Status crear contacto:', response.status);
    
    // Leer respuesta como texto
    const responseText = await response.text();
    console.log('Respuesta crear contacto (texto):', responseText);
    
    if (!response.ok) {
      let errorDetail = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson.error || errorJson.message || responseText;
      } catch {
        // Si no es JSON, usar el texto tal cual
      }
      throw new Error(`Error creando contacto: ${response.status} - ${errorDetail}`);
    }

    // Parsear respuesta JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // Si la API devuelve solo un número (ID), crear un objeto
      const contactId = responseText.trim();
      if (!isNaN(contactId)) {
        responseData = { success: true, contactId: contactId, message: 'Contacto creado' };
      } else {
        throw new Error(`Respuesta no válida: ${responseText}`);
      }
    }
    
    console.log('✅ Contacto creado exitosamente:', responseData);
    
    // Mostrar mensaje de éxito
    successMessage.value = '¡Solicitud enviada con éxito! Te contactaremos en 24 horas hábiles.';
    
    // Limpiar formulario después de éxito
    Object.assign(formularioState, {
      empresa: '',
      contacto: '',
      email: '',
      telefono: '',
      interes: '',
      mensaje: '',
      consulta: 'demo',
    });
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    errorMessage.value = `Error: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

// --- FUNCIÓN PARA PROBAR CONEXIÓN CON BACKEND ---
const testBackend = async () => {
  console.log('🔍 Probando conexión con backend...');
  try {
    const response = await fetch(`${API_BASE}health`);
    const text = await response.text();
    console.log('✅ Health check:', text);
    
    // Intentar parsear como JSON para mostrar bonito
    try {
      const data = JSON.parse(text);
      alert(`✅ Backend funcionando\nStatus: ${data.status}\nMensaje: ${data.message}`);
    } catch {
      alert(`✅ Backend funcionando\nRespuesta: ${text}`);
    }
  } catch (error) {
    console.error('❌ Error en conexión:', error);
    alert(`❌ Backend NO disponible\nError: ${error.message}`);
  }
};

// --- FUNCIÓN PARA PROBAR OBTENCIÓN DE TOKEN ---
const testToken = async () => {
  console.log('🔐 Probando obtención de token...');
  try {
    const response = await fetch(`${API_BASE}auth/token`);
    const text = await response.text();
    console.log('✅ Token response:', text);
    
    if (response.ok) {
      const data = JSON.parse(text);
      alert(`✅ Token obtenido\nToken: ${data.token.substring(0, 20)}...`);
    } else {
      alert(`❌ Error token: ${response.status}\n${text}`);
    }
  } catch (error) {
    console.error('❌ Error token:', error);
    alert(`❌ Error: ${error.message}`);
  }
};

// --- FUNCIÓN PARA LIMPIAR FORMULARIO ---
const limpiarFormulario = () => {
  Object.assign(formularioState, {
    empresa: '',
    contacto: '',
    email: '',
    telefono: '',
    interes: '',
    mensaje: '',
    consulta: 'demo',
  });
  errorMessage.value = '';
  successMessage.value = '';
};

// --- FUNCIÓN PARA LISTAR CONTACTOS (PARA CONSOLA) ---
const listarClientes = async () => {
  console.log('🔍 Obteniendo lista de contactos...');
  
  try {
    // 1. Obtener token
    const tokenResponse = await fetch(`${API_BASE}auth/token`);
    if (!tokenResponse.ok) {
      throw new Error(`Error token: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    const API_TOKEN = tokenData.token;
    console.log('Token obtenido:', API_TOKEN);
    
    // 2. Consultar contactos
    const response = await fetch(`${API_BASE}contacts?token=${encodeURIComponent(API_TOKEN)}`);
    
    if (!response.ok) {
      throw new Error(`Error consulta: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('====== CONTACTOS ======');
    
    if (data.contacts && data.contacts.length > 0) {
      console.table(data.contacts.map(c => ({
        ID: c.id,
        Nombre: c.firstname || 'N/A',
        Apellido: c.lastname || 'N/A',
        Email: c.email || 'N/A',
        Teléfono: c.phone || 'N/A'
      })));
    } else {
      console.log('No hay contactos registrados.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// ========== EXPONER FUNCIONES A LA CONSOLA ==========
if (typeof window !== 'undefined') {
  window.testBackend = testBackend;
  window.testToken = testToken;
  window.listarClientes = listarClientes;
  window.limpiarFormulario = limpiarFormulario;
  window.formNovalink = formNovalink;
}
</script>

<template>
  <article id="main">
    <header>
      <h2>Solicitar Demo / Cotización</h2>
      <p>Déjanos tus datos y un asesor experto en logística te contactará</p>
    </header>
    <section class="wrapper style5">
      <div class="inner">
        
        <div v-if="errorMessage" class="box" style="background-color: #fff5f5; border-left: 4px solid #e53e3e;">
          <p style="color: #c53030; margin: 0;">{{ errorMessage }}</p>
        </div>
        
        <div v-if="successMessage" class="box" style="background-color: #f0fff4; border-left: 4px solid #48bb78;">
          <p style="color: #2f855a; margin: 0;">{{ successMessage }}</p>
        </div>

        <section>
          <div class="box" style="max-width: 800px; margin: 0 auto;">
            <form @submit.prevent="formNovalink">
              <div class="row gtr-uniform">
                
                <!-- Nombre de la Empresa -->
                <div class="col-12">
                  <label for="empresa">Nombre de la Empresa / Negocio *</label>
                  <input 
                    v-model="formularioState.empresa" 
                    type="text" 
                    name="empresa" 
                    id="empresa" 
                    placeholder="Ingresa el nombre de tu empresa" 
                    :disabled="isLoading"
                    required 
                  />
                </div>
                
                <!-- Nombre de Contacto -->
                <div class="col-12">
                  <label for="contacto">Nombre de Contacto *</label>
                  <input 
                    v-model="formularioState.contacto" 
                    type="text" 
                    name="contacto" 
                    id="contacto" 
                    placeholder="Tu nombre completo" 
                    :disabled="isLoading"
                    required 
                  />
                </div>
                
                <!-- Email y Teléfono -->
                <div class="col-6 col-12-xsmall">
                  <label for="email">Correo Electrónico *</label>
                  <input 
                    v-model="formularioState.email" 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="ejemplo@empresa.com" 
                    :disabled="isLoading"
                    required 
                  />
                </div>
                
                <div class="col-6 col-12-xsmall">
                  <label for="telefono">Celular/Whatsapp *</label>
                  <input 
                    v-model="formularioState.telefono" 
                    type="tel" 
                    name="telefono" 
                    id="telefono" 
              
                    :disabled="isLoading"
                     
                  />
                </div>
                
                <!-- Área de interés -->
                <div class="col-12">
                  <label for="interes">Área de interés principal</label>
                  <select 
                    v-model="formularioState.interes" 
                    name="interes" 
                    id="interes"
                    :disabled="isLoading"
                  >
                    <option value="">-- Selecciona una opción --</option>
                    <option value="logistica">Logística y Distribución</option>
                    <option value="inventario">Gestión de Inventarios</option>
                    <option value="transporte">Optimización de Transporte</option>
                    <option value="rastreo">Rastreo de Envíos</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                
                <!-- Mensaje -->
                <div class="col-12">
                  <label for="mensaje">¿Qué necesidad principal buscas resolver?</label>
                  <textarea 
                    v-model="formularioState.mensaje" 
                    name="mensaje" 
                    id="mensaje" 
                    placeholder="Describe brevemente tus necesidades logísticas..." 
                    rows="4"
                    :disabled="isLoading"
                  ></textarea>
                </div>
                
                <!-- Tipo de consulta -->
                <div class="col-12">
                  <p style="margin-bottom: 10px;">Tipo de consulta:</p>
                  <div class="col-4 col-12-small">
                    <input 
                      v-model="formularioState.consulta" 
                      type="radio" 
                      id="consulta-demo" 
                      name="consulta" 
                      value="demo" 
                      :disabled="isLoading"
                    >
                    <label for="consulta-demo">Demo del Producto</label>
                  </div>
                  <div class="col-4 col-12-small">
                    <input 
                      v-model="formularioState.consulta" 
                      type="radio" 
                      id="consulta-cotizacion" 
                      name="consulta" 
                      value="cotizacion"
                      :disabled="isLoading"
                    >
                    <label for="consulta-cotizacion">Cotización</label>
                  </div>
                  <div class="col-4 col-12-small">
                    <input 
                      v-model="formularioState.consulta" 
                      type="radio" 
                      id="consulta-informacion" 
                      name="consulta" 
                      value="informacion"
                      :disabled="isLoading"
                    >
                    <label for="consulta-informacion">Información General</label>
                  </div>
                </div>
                
                <!-- Botones principales -->
                <div class="col-12">
                  <ul class="actions" style="justify-content: center;">
                    <li>
                      <button 
                        type="submit" 
                        class="button primary" 
                        id="submit-btn"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading">
                          <span class="loading-spinner"></span> Enviando...
                        </span>
                        <span v-else>ENVIAR SOLICITUD</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        type="button" 
                        class="button"
                        @click="limpiarFormulario"
                        :disabled="isLoading"
                      >
                        LIMPIAR FORMULARIO
                      </button>
                    </li>
                  </ul>
                </div>
                
                <!-- Nota -->
                <div class="col-12">
                  <p style="font-size: 0.9em; color: #666; text-align: center; margin-top: 20px;">
                    * Campos obligatorios<br>
                    Te contactaremos en un plazo máximo de 24 horas hábiles.
                  </p>
                </div>
                
              </div>
            </form>
          </div>
          
          <!-- Información adicional -->
          <div class="row" style="margin-top: 40px;">
            <div class="col-4 col-12-medium">
              <h4><span class="icon solid fa-clock"></span> Respuesta Rápida</h4>
              <p>Te contactaremos en menos de 24 horas hábiles con información personalizada.</p>
            </div>
            <div class="col-4 col-12-medium">
              <h4><span class="icon solid fa-shield-alt"></span> Información Segura</h4>
              <p>Tus datos están protegidos y solo serán usados para atender tu solicitud.</p>
            </div>
            <div class="col-4 col-12-medium">
              <h4><span class="icon solid fa-headset"></span> Soporte Personalizado</h4>
              <p>Un asesor especializado te guiará según las necesidades de tu empresa.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Estilos para el estado de carga */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animación de carga */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}
</style>