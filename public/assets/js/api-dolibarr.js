/**
 * API Dolibarr Integration for Novalink
 * Conexión con ERP Dolibarr para manejo de leads
 */

class DolibarrAPI {
    constructor() {
        // Configuración de la API - EN PRODUCCIÓN USAR VARIABLES DE ENTORNO
        this.apiUrl = 'https://erp.axarinternational.com/api/index.php/';
        this.username = 'axar.erp';
        this.password = 'nvaxarerp2025'; // En producción, usar variables de entorno
        
        // Credenciales codificadas en Base64
        this.authHeader = 'Basic ' + btoa(this.username + ':' + this.password);
        
        // Headers comunes
        this.headers = {
            'Authorization': this.authHeader,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Elementos del formulario
        this.form = document.getElementById('formNovalink');
        this.messageContainer = document.getElementById('message-container');
        this.messageBox = document.getElementById('message-box');
        this.submitBtn = document.getElementById('submit-btn');
        
        // Inicializar
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!this.validateForm()) {
            return;
        }
        
        // Deshabilitar botón de envío
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            // Preparar datos para Dolibarr
            const formData = this.prepareFormData();
            
            // Intentar primero crear en contacts (si es contacto individual)
            const contactResult = await this.createContact(formData);
            
            // Si es una empresa, también crear en thirdparties
            if (formData.empresa && formData.empresa.trim() !== '') {
                await this.createThirdParty(formData);
            }
            
            // Crear un ticket/propuesta para seguimiento
            await this.createTicket(formData);
            
            // Mostrar mensaje de éxito
            this.showMessage('¡Solicitud enviada con éxito! Te contactaremos en menos de 24 horas.', 'success');
            
            // Resetear formulario después de 3 segundos
            setTimeout(() => {
                this.form.reset();
                this.submitBtn.disabled = false;
                this.submitBtn.innerHTML = 'ENVIAR SOLICITUD';
            }, 3000);
            
        } catch (error) {
            console.error('Error al enviar datos:', error);
            
            // Mostrar mensaje de error
            this.showMessage('Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente o contáctanos directamente.', 'error');
            
            // Rehabilitar botón
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = 'ENVIAR SOLICITUD';
        }
    }
    
    /**
     * Validar datos del formulario
     */
    validateForm() {
        const empresa = document.getElementById('empresa').value.trim();
        const contacto = document.getElementById('contacto').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const privacidad = document.getElementById('privacidad').checked;
        
        // Validaciones básicas
        if (!empresa) {
            this.showMessage('Por favor, ingresa el nombre de tu empresa.', 'error');
            return false;
        }
        
        if (!contacto) {
            this.showMessage('Por favor, ingresa tu nombre de contacto.', 'error');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            return false;
        }
        
        if (!telefono || telefono.length < 10) {
            this.showMessage('Por favor, ingresa un número de teléfono válido (mínimo 10 dígitos).', 'error');
            return false;
        }
        
        if (!privacidad) {
            this.showMessage('Debes aceptar la Política de Privacidad para continuar.', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar formato de email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /**
     * Preparar datos del formulario para la API
     */
    prepareFormData() {
        const interesMap = {
            'logistica': 'Logística y Distribución',
            'inventario': 'Gestión de Inventarios',
            'transporte': 'Optimización de Transporte',
            'rastreo': 'Rastreo de Envíos',
            'otros': 'Otros'
        };
        
        const consultaMap = {
            'demo': 'Demo del Producto',
            'cotizacion': 'Cotización',
            'informacion': 'Información General'
        };
        
        return {
            empresa: document.getElementById('empresa').value.trim(),
            contacto: document.getElementById('contacto').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            interes: document.getElementById('interes').value,
            interes_texto: interesMap[document.getElementById('interes').value] || 'No especificado',
            mensaje: document.getElementById('mensaje').value.trim(),
            consulta: document.querySelector('input[name="consulta"]:checked').value,
            consulta_texto: consultaMap[document.querySelector('input[name="consulta"]:checked').value],
            origen: document.getElementById('origen').value,
            fecha: new Date().toISOString()
        };
    }
    
    /**
     * Crear contacto en Dolibarr
     */
    async createContact(formData) {
        // Separar nombre y apellido
        const nombres = formData.contacto.split(' ');
        const lastname = nombres.pop() || '';
        const firstname = nombres.join(' ') || formData.contacto;
        
        const contactData = {
            "lastname": lastname,
            "firstname": firstname,
            "email": formData.email,
            "phone_pro": formData.telefono,
            "phone_mobile": formData.telefono,
            "note_public": `Lead desde formulario web - ${formData.origen}\n\nEmpresa: ${formData.empresa}\nInterés: ${formData.interes_texto}\nConsulta: ${formData.consulta_texto}\nMensaje: ${formData.mensaje}\nFecha: ${new Date().toLocaleString()}`,
            "status": 1, // Activo
            "array_options": {
                "options_origen": formData.origen,
                "options_interes": formData.interes,
                "options_consulta": formData.consulta
            }
        };
        
        const response = await fetch(this.apiUrl + 'contacts', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al crear contacto: ${response.status}`);
        }
        
        return await response.json();
    }
    
    /**
     * Crear empresa (thirdparty) en Dolibarr
     */
    async createThirdParty(formData) {
        const thirdPartyData = {
            "name": formData.empresa,
            "client": 2, // Prospecto
            "status": 1, // Activo
            "email": formData.email,
            "phone": formData.telefono,
            "note_public": `Lead generado desde formulario web\nContacto: ${formData.contacto}\nInterés: ${formData.interes_texto}\nTipo consulta: ${formData.consulta_texto}`,
            "array_options": {
                "options_origen_lead": "formulario_web",
                "options_fecha_contacto": new Date().toISOString().split('T')[0]
            }
        };
        
        const response = await fetch(this.apiUrl + 'thirdparties', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(thirdPartyData)
        });
        
        if (!response.ok) {
            console.warn('No se pudo crear empresa, pero el contacto se guardó.');
            return null;
        }
        
        return await response.json();
    }
    
    /**
     * Crear ticket para seguimiento
     */
    async createTicket(formData) {
        const subject = `Lead Web: ${formData.empresa} - ${formData.consulta_texto}`;
        
        const ticketData = {
            "track_id": `WEB-${Date.now()}`,
            "subject": subject,
            "message": `Nuevo lead generado desde formulario web:\n\nEmpresa: ${formData.empresa}\nContacto: ${formData.contacto}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono}\n\nInterés principal: ${formData.interes_texto}\nTipo de consulta: ${formData.consulta_texto}\n\nMensaje del cliente:\n${formData.mensaje}\n\nDatos técnicos:\nOrigen: ${formData.origen}\nFecha: ${formData.fecha}`,
            "type_code": "COM", // Comercial
            "category_code": "SERV", // Servicio
            "severity_code": 3, // Normal
            "origin_email": formData.email,
            "fk_soc": 0, // Sin empresa asociada inicialmente
            "notify_tiers_at_create": 0 // No notificar al cliente
        };
        
        const response = await fetch(this.apiUrl + 'tickets', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(ticketData)
        });
        
        if (!response.ok) {
            console.warn('No se pudo crear ticket, pero los datos se guardaron.');
            return null;
        }
        
        return await response.json();
    }
    
    /**
     * Mostrar mensaje al usuario
     */
    showMessage(message, type = 'info') {
        if (!this.messageContainer || !this.messageBox) return;
        
        // Configurar colores según tipo
        const colors = {
            'success': '#4CAF50',
            'error': '#f44336',
            'info': '#2196F3',
            'warning': '#ff9800'
        };
        
        const icons = {
            'success': '✓',
            'error': '✗',
            'info': 'ℹ',
            'warning': '⚠'
        };
        
        this.messageBox.innerHTML = `
            <div style="display: flex; align-items: center; padding: 15px; border-left: 4px solid ${colors[type]}; background: ${colors[type]}10;">
                <span style="font-size: 20px; margin-right: 10px; color: ${colors[type]};">${icons[type]}</span>
                <span>${message}</span>
            </div>
        `;
        
        this.messageContainer.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos para mensajes de éxito/info
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                this.messageContainer.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Método para probar conexión a la API
     */
    async testConnection() {
        try {
            const response = await fetch(this.apiUrl + 'status', {
                method: 'GET',
                headers: this.headers
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Conexión API exitosa:', data);
                return true;
            } else {
                console.error('Error en conexión API:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            return false;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia de la API
    const api = new DolibarrAPI();
    
    // Opcional: Probar conexión al cargar (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        api.testConnection().then(success => {
            if (success) {
                console.log('✅ Conexión API Dolibarr configurada correctamente');
            } else {
                console.warn('⚠ No se pudo conectar a la API Dolibarr');
            }
        });
    }
    
    // Exponer API globalmente para debugging (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.dolibarrAPI = api;
    }
});