<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navigateTo = (path) => {
  router.push(path)
  isMenuOpen.value = false
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header id="header" :class="{ 'alt': $route.path === '/' }">
    <h1><a href="#" @click.prevent="goHome">Novalink</a></h1>
    <nav id="nav">
      <ul>
        <li class="special">
          <a href="#menu" class="menuToggle" @click.prevent="toggleMenu">
            <span>Menu</span>
          </a>
          <div id="menu" :style="{ display: isMenuOpen ? 'block' : 'none' }">
            <ul>
              <li><a href="#" @click.prevent="navigateTo('/')">Inicio</a></li>
              <li><a href="#" @click.prevent="navigateTo('/business')">Business</a></li>
              <li><a href="#" @click.prevent="navigateTo('/caracteristicas')">Características</a></li>
              <li><a href="#" @click.prevent="navigateTo('/formulario')">Solicitar Demo</a></li>
              <li><a href="https://wa.me/59174054547" target="_blank">WhatsApp</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
/* Estilos específicos del header si son necesarios */
</style>