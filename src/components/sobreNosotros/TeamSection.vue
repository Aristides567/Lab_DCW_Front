<script setup>
//array de la muestra de nuestro equipo
const equipo = [
  {
    nombre: 'Miguel Hernandez',
    rol: 'CEO & Fundador',
    img: new URL('@/assets/img/Miguel.jpg', import.meta.url).href
  },
  {
    nombre: 'Kenneth Granados',
    rol: 'CTO & Desarrollador',
    img: new URL('@/assets/img/dddd.png', import.meta.url).href
  },
  {
    nombre: 'Aristides Fuentes',
    rol: 'Director de Diseño UX/UI',
    img: new URL('@/assets/img/gay.png', import.meta.url).href
  }
]
</script>

<template>
    <section id="equipo" class="py-24 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-4xl text-violet-600 font-bold mb-12">Conoce a Nuestro Equipo</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(miembro, index) in equipo"
            :key="index"
            class="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
          >
            <img
              :src="miembro.img"
              :alt="miembro.nombre"
              class="rounded-full w-32 h-32 mx-auto mb-4 object-cover transition-all duration-300 hover:scale-110"
            />
            <h3 class="text-2xl font-semibold text-gray-900">{{ miembro.nombre }}</h3>
            <p class="text-gray-700">{{ miembro.rol }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>

  