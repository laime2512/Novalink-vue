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

// ⚠️ ¡IMPORTANTE! Usa el proxy LOCAL, no la URL directa
const API_BASE = '/api-proxy/';  
const LOGIN = 'axar.erp';
const PASSWORD = 'nvaxarerp2025';

const formNovalink = async () => {
  console.log('Formulario enviado:', formularioState);
  
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  
  // Validación básica
  if (!formularioState.empresa || !formularioState.contacto || !formularioState.email || !formularioState.telefono) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios (*)';
    isLoading.value = false;
    return;
  }

  try {
    // PASO 1: Obtener token de API
    console.log('1. Obteniendo token de API...');
    const loginUrl = `${API_BASE}login?login=${LOGIN}&password=${PASSWORD}`;
    console.log('URL con proxy:', loginUrl); // Debería mostrar: /api-proxy/login?...
    
    const loginResponse = await fetch(loginUrl, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Status login:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Error en login: ${loginResponse.status} - ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const API_TOKEN = loginData.success.token;
    console.log('Token obtenido:', API_TOKEN);

    // PASO 2: Preparar datos para la API
    const datosParaAPI = {
      lastname: formularioState.contacto,
      firstname: formularioState.empresa, 
      email: formularioState.email,
      phone: formularioState.telefono,
      note_public: `Empresa: ${formularioState.empresa}\nInterés: ${formularioState.interes}\nConsulta: ${formularioState.consulta}\nMensaje: ${formularioState.mensaje}`,
      client: 1, 
    };
    
    console.log('Enviando a API:', datosParaAPI);
    
    // PASO 3: Enviar datos con el token
    const response = await fetch(`${API_BASE}contacts`, {
      method: 'POST',
      headers: {
        'DOLAPIKEY': API_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(datosParaAPI)
    });

    // Verificar respuesta
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Contacto creado exitosamente. ID:', data);
    
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
    console.error('Error al enviar formulario:', error);
    errorMessage.value = `Error: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

// --- FUNCIÓN PARA LISTAR CONTACTOS ---
const listarClientes = async () => {
  console.log('🔍 Obteniendo lista de contactos...');
  
  try {
    // 1. Obtener token
    const loginUrl = `${API_BASE}login?login=${LOGIN}&password=${PASSWORD}`;
    const loginResponse = await fetch(loginUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!loginResponse.ok) {
      throw new Error(`Error en login: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const API_TOKEN = loginData.success.token;
    console.log('Token obtenido:', API_TOKEN);

    // 2. Consultar contactos
    const contactsUrl = `${API_BASE}contacts?sortfield=t.datec&sortorder=DESC&limit=50`;
    
    const response = await fetch(contactsUrl, {
      method: 'GET',
      headers: {
        'DOLAPIKEY': API_TOKEN,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const contactsData = await response.json();
    
    // 3. Mostrar en consola
    console.log('====== CONTACTOS REGISTRADOS ======');
    console.log(`Total: ${contactsData.length || '0'}`);
    
    console.table(contactsData.map(contact => ({
      ID: contact.id,
      'Apellido': contact.lastname || 'N/A',
      'Nombre': contact.firstname || 'N/A',
      'Email': contact.email || 'N/A',
      'Teléfono': contact.phone || 'N/A'
    })));
    
    return contactsData;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

// --- FUNCIONES DE UTILIDAD ---
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

// ========== EXPONER FUNCIONES A LA CONSOLA ==========
if (typeof window !== 'undefined') {
  window.listarClientes = listarClientes;
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
        <!-- Mensajes de estado -->
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
                    placeholder="+52 123 456 7890" 
                    :disabled="isLoading"
                    required 
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
                
                <!-- Botones -->
                <div class="col-12">
                  <ul class="actions" style="justify-content: center;">
                    <li>
                      <button 
                        type="submit" 
                        class="button primary" 
                        id="submit-btn"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading">Enviando...</span>
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
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>