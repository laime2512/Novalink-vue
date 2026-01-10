<template>
  <div class="landing is-preload">
    <!-- Page Wrapper -->
    <div id="page-wrapper">
      <!-- Banner -->
      <section id="banner">
        <div class="inner">
          <h2>Novalink</h2><br />
          <img src="@/images/logo.png" alt="Novalink Ventas360" style="width: 200px; height: auto;" />
          <h4>Suite Integral de Gestión Comercial, Logística y CRM Georreferenciado<br /></h4>
          <p>Para Solicitar DEMO</p>
          <ul class="actions special">
            <li>
              <router-link to="/formulario" class="button primary button">Click Aquí</router-link>
            </li>
            <li><a href="https://wa.me/59171800808" class="button fit icon brands fa-whatsapp">71800808</a></li>
          </ul>
        </div>
      </section>

      <!-- One -->
      <section id="one" class="wrapper style1 special">
        <div class="inner">
          <header class="major">
            <h2>Ventas360 es un ecosistema tecnológico diseñado para empresas que requieren un control absoluto sobre sus operaciones.</h2>
            <blockquote>Fusionamos la potencia de un CRM, la gestión de un ERP y la inteligencia de la Geolocalización en una sola plataforma.
              Desde la preventa hasta la entrega final y la satisfacción del cliente, Ventas360 le permite monitorear, gestionar y optimizar cada paso de su cadena de valor.</blockquote>
          </header>
          <ul class="icons major">
            <li><span class="icon fa-gem major style1"><span class="label">Lorem</span></span></li>
            <li><span class="icon fa-heart major style2"><span class="label">Ipsum</span></span></li>
            <li><span class="icon solid fa-code major style3"><span class="label">Dolor</span></span></li>
          </ul>
        </div>
      </section>

      <!-- Two -->
      <section id="two" class="wrapper alt style2">
        <section class="spotlight">
          <div class="image"><img src="@/images/pic01.jpg" alt="" /></div>
          <div class="content">
            <h3>Gestión Inteligente de Clientes y Rutas</h3>
            <blockquote>Segmentación Avanzada:
              Clasificación de puntos de venta por zona, volumen de compra y frecuencia.<br>
              Ruteo Dinámico:
              Creación y actualización de rutas de distribución con asignación de puntos de origen y clientes específicos.<br>
              Historial Completo:
              detallado a preferencias de compra y comportamiento histórico de cada cliente.</blockquote>
          </div>
        </section>
        <section class="spotlight">
          <div class="image"><img src="@/images/pic02.jpg" alt="" /></div>
          <div class="content">
            <h3>Control de Pedidos 360°</h3>
            <blockquote>Flujo de Aprobación Flexible: Capacidad de aprobar, rechazar o aprobar parcialmente pedidos (modificando cantidades) antes del despacho.<br>
              Ciclo de Vida del Pedido: Monitoreo de estados: Nuevo > Procesado > Reprogramado > En Tránsito > Entregado.<br>
              Notificaciones Automáticas: Alertas de retrasos o incidencias para una gestión proactiva.</blockquote>
          </div>
        </section>
        <section class="spotlight">
          <div class="image"><img src="@/images/pic03.jpg" alt="" /></div>
          <div class="content">
            <h3>Georreferenciación y Mapas de Calor</h3>
            <blockquote>Visualización en Vivo: Ubicación en tiempo real de distribuidores, clientes y pedidos activos (integración con Google Maps).<br>
              Mapas de Calor (Heatmaps): Identifique zonas "calientes" de ventas clasificadas por volumen y frecuencia de pedidos.<br>
              Tracking de Entregas: Visualice el estado de las rutas programadas del día al instante.
            </blockquote>
          </div>
        </section>
        <section class="spotlight">
          <div class="image"><img src="@/images/pic02.jpg" alt="" /></div>
          <div class="content">
            <h3>Gestión de Inventarios</h3>
            <blockquote>Sincronización de Almacenes: Control de stock en tiempo real con alertas de inventario mínimo.<br>
              Análisis de Rotación: Identificación de productos con mayor movimiento y evolución de aceptación en el mercado.</blockquote>
          </div>
        </section>
      </section>

      <!-- Three -->
      <section id="three" class="wrapper style3 special">
        <div class="inner">
          <header class="major">
            <h2>Ecosistema Móvil</h2>
            <p>Aplicaciones nativas diseñadas para operar en el campo, incluso sin conexión a internet<br /></p>
          </header>
          <h3>App para Distribuidores (Logística y Preventa)</h3>
          <ul class="features">
            <li class="icon solid fa-mobile-alt">
              <h3>Oficina en el Bolsillo</h3>
              <p>Gestión de pedidos y registro de entregas desde el móvil.</p>
            </li>
            <li class="icon solid fa-cloud-slash">
              <h3>Modo Offline</h3>
              <p>Opere en zonas sin cobertura; el sistema sincroniza automáticamente al recuperar la conexión</p>
            </li>
            <li class="icon solid fa-route">
              <h3>Rutas Optimizadas:</h3>
              <p>Visualización georreferenciada de la ubicación del cliente para reducir tiempos de traslado.</p>
            </li>
            <li class="icon solid fa-award">
              <h3>Control de Calidad:</h3>
              <p>Registro de incidencias (si no se puede entregar) y validación de productos entregados.</p>
            </li>
          </ul>
          <h3>App para Distribuidores (Logística y Preventa)</h3>
          <ul class="features">
            <li class="icon solid fa-shopping-cart">
              <h3>Autogestión de Compras:</h3>
              <p>Carrito de compras intuitivo, acceso a promociones y repetición rápida de pedidos anteriores</p>
            </li>
            <li class="icon solid fa-eye">
              <h3>Transparencia Total:</h3>
              <p>El cliente puede modificar su pedido (antes de aprobación) y recibir alertas de estado en tiempo real.</p>
            </li>
            <li class="icon solid fa-comment-alt">
              <h3>Feedback Inmediato:</h3>
              <p>Encuestas de satisfacción post-entrega para medir la calidad del servicio.</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- CTA -->
      <section id="cta" class="wrapper style4">
        <div class="inner">
          <header>
            <h3>¿Por qué elegir Ventas360 de Novalink?</h3>
            <Blockquote><strong>Control Total:</strong> Sepa exactamente dónde está su mercadería y su personal en todo momento.
              <strong>Reducción de Costos:</strong>Optimice rutas para ahorrar combustible y tiempo.<br>
              <strong>Fidelización:</strong>Mejore la experiencia de sus clientes con entregas puntuales y apps de autogestión.
              <strong>Escalabilidad:</strong>Implementación paramétrica que se ajusta a las necesidades específicas y crecimiento de su empresa.</Blockquote>
          </header>
          <ul class="actions stacked">
            <li>
              <router-link to="/business" class="button fit primary">Business</router-link>
            </li>
            <li><a href="https://wa.me/59171800808" class="button fit icon brands fa-whatsapp">71800808</a></li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Lógica específica de la página de inicio si es necesaria
</script>

<style scoped>
/* Estilos específicos de la página de inicio si son necesarios */
</style>