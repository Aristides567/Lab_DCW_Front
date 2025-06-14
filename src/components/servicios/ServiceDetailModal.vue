<template>
  <div v-if="show" class="fixed inset-0 bg-gradient-to-br from-purple-900/70 to-fuchsia-900/70 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-8 relative animate-fade-in-up flex flex-col md:flex-row gap-8">
      <!-- Botón de cerrar -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none z-10"
      >
        &times;
      </button>

      <div class="flex-1 flex items-center justify-center">
        <img
          v-if="service.imagen"
          :src="'http://localhost:5000' + service.imagen"
          :alt="service.nombre"
          class="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-gray-100" />
      </div>

      <div v-if="service" class="flex-1 flex flex-col justify-between">
        <div>
          <h2 class="text-4xl font-bold text-violet-700 mb-3">{{ service.nombre }}</h2>
          <p class="text-gray-700 mb-5 text-lg leading-relaxed">{{ service.descripcion }}</p>
          
          <!-- Precio base -->
          <p class="text-2xl font-bold text-violet-600 mb-6">${{ service.costo }}</p>

          <!-- Botón para mostrar tecnologías -->
          <button
            @click="mostrarTecnologias = !mostrarTecnologias"
            class="w-full mb-6 bg-gray-100 text-violet-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>{{ mostrarTecnologias ? 'Ocultar' : 'Agregar' }} Tecnologías</span>
            <svg 
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': mostrarTecnologias }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Sección de tecnologías (visible solo cuando mostrarTecnologias es true) -->
          <div v-if="mostrarTecnologias" class="mb-6 animate-fade-in">
            <div class="space-y-3">
              <div v-for="tech in tecnologiasFiltradas" :key="tech._id" 
                   class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200"
                   :class="{
                     'bg-white border-gray-200 hover:bg-gray-100': !isSelected(tech._id),
                     'bg-violet-100 border-violet-600 shadow-md': isSelected(tech._id)
                   }"
                   @click="toggleTechnology(tech._id)"
              >
                <div class="flex items-center gap-3">
                  <img
                    v-if="tech.image"
                    :src="`http://localhost:5000${tech.image}`"
                    :alt="tech.name"
                    class="h-8 w-8 object-cover rounded-full"
                  />
                  <span class="text-gray-700" :class="{ 'text-violet-900 font-semibold': isSelected(tech._id) }">{{ tech.name }}</span>
                </div>
                <span class="text-violet-600 font-semibold">+${{ tech.price }}</span>
              </div>
            </div>
          </div>

          <!-- Resumen de precios -->
          <div v-if="precioTecnologias > 0" class="space-y-2 mb-6 p-4 bg-violet-50 rounded-lg">
            <p class="text-gray-700">
              Precio base: <span class="font-semibold">${{ service.costo }}</span>
            </p>
            <p class="text-gray-700">
              Tecnologías seleccionadas: <span class="font-semibold">+${{ precioTecnologias }}</span>
            </p>
            <p class="text-xl font-bold text-violet-600">
              Total: ${{ precioTotal }}
            </p>
          </div>
        </div>

        <button
          @click="agregarAlCarrito"
          class="w-full bg-violet-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  service: { type: Object, default: null },
})

const emit = defineEmits(['close', 'add-to-cart'])

const tecnologias = ref([])
const tecnologiasSeleccionadas = ref([])
const mostrarTecnologias = ref(false)

// Filtrar tecnologías según la categoría del servicio
const tecnologiasFiltradas = computed(() => {
  if (!props.service) return []
  const filtered = tecnologias.value.filter(tech => tech.categoria === props.service.categoria)
  return filtered
})

// Verificar si una tecnología está seleccionada
const isSelected = (techId) => {
  return tecnologiasSeleccionadas.value.includes(techId)
}

// Toggle la selección de una tecnología
const toggleTechnology = (techId) => {
  const index = tecnologiasSeleccionadas.value.indexOf(techId)
  if (index > -1) {
    tecnologiasSeleccionadas.value.splice(index, 1) // Eliminar
  } else {
    tecnologiasSeleccionadas.value.push(techId) // Añadir
  }
}

// Calcular el precio de las tecnologías seleccionadas
const precioTecnologias = computed(() => {
  return tecnologiasSeleccionadas.value.reduce((total, techId) => {
    const tech = tecnologias.value.find(t => t._id === techId)
    return total + (tech ? tech.price : 0)
  }, 0)
})

// Calcular el precio total
const precioTotal = computed(() => {
  return props.service.costo + precioTecnologias.value
})

// Cargar tecnologías al montar el componente
const fetchTechnologies = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:5000/api/tecnologias', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener tecnologías')
    }

    const data = await response.json()
    tecnologias.value = data
  } catch (error) {
    console.error('Error:', error)
  }
}

// Agregar al carrito con las tecnologías seleccionadas
const agregarAlCarrito = () => {
  emit('add-to-cart', {
    ...props.service,
    tecnologiasSeleccionadas: tecnologiasSeleccionadas.value,
    precioTotal: precioTotal.value
  })
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchTechnologies()
    tecnologiasSeleccionadas.value = []
    mostrarTecnologias.value = false 
  } else {
    tecnologiasSeleccionadas.value = []
    mostrarTecnologias.value = false
  }
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 