<script setup>
import { computed } from 'vue'
import { obtenerUsuario } from '@/utils/auth'

const usuario = computed(() => obtenerUsuario())
</script>

<template>
  <section id="inicio" class="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-r from-indigo-100 to-rose-100">
    <div class="max-w-7xl mx-auto px-4">
      <template v-if="$route.path === '/'">
        <h1 class="text-6xl md:text-7xl font-bold text-violet-900 mb-4 glitch" :data-text="usuario && usuario.nombre ? `Bienvenido, ${usuario.nombre}` : 'Innovación Digital'">
          <template v-if="usuario && usuario.nombre">
            Bienvenido, {{ usuario.nombre }}
          </template>
          <template v-else>
            Innovación Digital
          </template>
        </h1>
        <p class="text-xl md:text-2xl text-gray-800 mb-8">
          <template v-if="usuario && usuario.nombre">
            ¡Nos alegra verte de nuevo!
          </template>
          <template v-else>
            Transformamos ideas en experiencias web extraordinarias
          </template>
        </p>
        <template v-if="usuario && usuario.nombre">
          <router-link to="/servicios">
            <button class="inline-block bg-violet-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-500 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
              Ver nuestros servicios
            </button>
          </router-link>
        </template>
        <template v-else>
          <a href="#consultas"
            class="inline-block bg-violet-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-500 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
            Solicita una consulta
          </a>
        </template>
      </template>

      <template v-if="$route.name === 'Servicios'">
        <h1 class="text-6xl font-bold text-violet-900 mb-4">Nuestros Servicios</h1>
        <p class="text-xl text-gray-800 mb-8">Descubre cómo podemos llevar tu presencia digital al siguiente nivel.</p>
        <a href="#cta"
            class="inline-block bg-violet-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-500 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
          Solicita una Consulta
        </a>
      </template>

      <template v-if="$route.name === 'SobreNosotros'">
        <h1 class="text-6xl font-bold text-violet-900 mb-4">Sobre Nosotros</h1>
        <p class="text-xl text-gray-800 mb-8">Descubre quiénes somos y nuestra pasión por la innovación digital.</p>
        <a href="#cta"
            class="inline-block bg-violet-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-500 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
          Contáctanos
        </a>
      </template>
    </div>
  </section>
</template>