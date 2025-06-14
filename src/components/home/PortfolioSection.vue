<script setup>
import { ref, computed } from 'vue'
import img1 from '@/assets/img/asd1.png'
import img2 from '@/assets/img/asd2.png'
import img3 from '@/assets/img/asd3.png'

const proyectos = ref([
  {
    nombre: 'Proyecto 1',
    descripcion: 'Diseño moderno para sitio de entretenimiento.',
    tecnologias: ['HTML', 'CSS', 'Vue.js'],
    imagen: img1,
    link: 'https://store.steampowered.com/',
    visto: false
  },
  {
    nombre: 'Proyecto 2',
    descripcion: 'Desarrollo de plataforma de ventas con carrito y panel admin.',
    tecnologias: ['Vue 3', 'TailwindCSS', 'Firebase'],
    imagen: img2,
    link: 'https://www.amazon.com/',
    visto: false
  },
  {
    nombre: 'Proyecto 3',
    descripcion: 'Portal informativo para una empresa tecnológica.',
    tecnologias: ['Nuxt', 'SASS', 'Node.js'],
    imagen: img3,
    link: 'https://www.zonadigitalsv.com/',
    visto: false
  }
])

const proyectosConTituloMayus = computed(() => {
  return proyectos.value.map(p => ({
    ...p,
    nombre: p.nombre.toUpperCase()
  }))
})

const proyectoSeleccionado = ref(null)

const verProyecto = (proyecto) => {
  proyectoSeleccionado.value = proyecto
}

const cerrarModal = () => {
  proyectoSeleccionado.value = null
}
</script>

<template>
  <section id="portafolio" class="py-24 bg-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl text-center text-violet-600 font-bold mb-16">Nuestro Portafolio</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div
          v-for="(proyecto, i) in proyectosConTituloMayus"
          :key="i"
          class="relative overflow-hidden rounded-xl shadow-xl group transform transition duration-300 hover:scale-[1.02]"
        >
          <p v-bind:class="['visto absolute top-3 left-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 opacity-100 group-hover:opacity-100', proyecto.visto ? 'bg-green-500' : '']">
            {{ proyecto.visto ? '✅ Visitado' : '' }}
          </p>

          <img 
            :src="proyecto.imagen" 
            :alt="proyecto.nombre" 
            class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
          />

          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 backdrop: backdrop-blur-[0.1em]">
            <h3 class="text-white text-xl font-bold">{{ proyecto.nombre }}</h3>
            <p class="text-white text-sm mt-1">{{ proyecto.descripcion }}</p>
            <button
              @click="verProyecto(proyecto)"
              class="mt-4 inline-block self-start bg-white text-violet-600 px-4 py-2 rounded-full font-semibold hover:bg-red-400 hover:text-white transition-colors duration-300"
            >
              Ver Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal detallado del proyecto -->
    <div v-if="proyectoSeleccionado" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full relative text-left">
        <h3 class="text-3xl font-bold text-violet-600 mb-2">{{ proyectoSeleccionado.nombre }}</h3>
        <p class="text-gray-700 mb-4">{{ proyectoSeleccionado.descripcion }}</p>

        <!-- Imagen principal -->
        <img
          :src="proyectoSeleccionado.imagen"
          class="w-full h-64 object-cover rounded-lg mb-6"
        />

        <!-- Tecnologías -->
        <div class="mb-4">
          <h4 class="font-semibold text-gray-800 mb-2">Tecnologías utilizadas:</h4>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="(tech, i) in proyectoSeleccionado.tecnologias"
              :key="i"
              class="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ tech }}
            </li>
          </ul>
        </div>

        <!-- Botones -->
        <div class="flex justify-between items-center mt-6">
          <a
            :href="proyectoSeleccionado.link"
            target="_blank"
            @click="proyectoSeleccionado.visto = true"
            class="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-500 transition-all"
          >
            Ver en vivo
          </a>
          <button
            @click="cerrarModal"
            class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-black transition-all"
          >
            Cerrar
          </button>
        </div>

        <!-- Botón de cierre -->
        <button
          @click="cerrarModal"
          class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  </section>
</template>
