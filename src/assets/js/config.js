/**
 * Configuración de entorno para Novalink
 * Este archivo debe ser ignorado en git (.gitignore)
 */

// Configuración para desarrollo
const CONFIG = {
    // API Dolibarr
    API_URL: 'https://erp.axarinternational.com/api/index.php/',
    API_USERNAME: 'axar.erp',
    API_PASSWORD: 'nvaxarerp2025',
    
    // Configuración de formulario
    FORM_SETTINGS: {
        autoReset: true,
        resetDelay: 3000,
        showSuccessMessage: true,
        enableValidation: true
    },
    
    // URLs para redirección
    REDIRECT_URLS: {
        success: 'gracias.html',
        error: 'error.html',
        privacy: 'politica-privacidad.html'
    }
};

// Para uso en navegador
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}