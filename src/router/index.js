import { createRouter, createWebHistory } from 'vue-router'

// Importar las vistas
import Home from '../views/Home.vue'
import Business from '../views/Business.vue'
import Formulario from '../views/Formulario.vue'
import Caracteristicas from '../views/Caracteristicas.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/business',
    name: 'Business',
    component: Business
  },
  {
    path: '/formulario',
    name: 'Formulario',
    component: Formulario
  },
  {
    path: '/caracteristicas',
    name: 'Caracteristicas',
    component: Caracteristicas
  },
  // Redirección para mantener compatibilidad
  {
    path: '/index.html',
    redirect: '/'
  },
  {
    path: '/generic.html',
    redirect: '/business'
  },
  {
    path: '/elements.html',
    redirect: '/caracteristicas'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router