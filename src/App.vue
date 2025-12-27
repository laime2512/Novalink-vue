<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <!-- Header presente en todas las páginas -->
    <Header />
    
    <!-- Contenido principal que cambia según la ruta -->
    <main>
      <router-view />
    </main>
    
    <!-- Footer presente en todas las páginas -->
    <Footer />
  </div>
</template>

<style>
/* Estilos globales si son necesarios */
</style>