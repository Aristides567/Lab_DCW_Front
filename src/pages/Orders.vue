<template>
  <Header />
  <section class="min-h-screen pt-24 p-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-violet-700 mb-6 flex items-center gap-2">
        <span class="text-4xl">📦</span> Mis Compras
      </h1>

      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 text-xl mb-4">❌</div>
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <div v-else-if="!orders || orders.length === 0" class="text-center py-16">
        <div class="text-6xl mb-6">🛍️</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">No tienes compras aún</h2>
        <p class="text-gray-500 mb-8">¡Explora nuestros servicios y realiza tu primera compra!</p>
        <RouterLink to="/servicios"
          class="inline-block bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300 font-semibold">
          Ver Servicios
        </RouterLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order._id" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Orden #{{ order._id.slice(-6) }}</h3>
              <p class="text-sm text-gray-500">
                {{ new Date(order.fechaCompra).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="item in order.items" :key="item._id" class="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <img v-if="item.servicio.imagen" :src="'http://localhost:5000' + item.servicio.imagen"
                :alt="item.servicio.nombre" class="w-20 h-20 object-cover rounded-lg" />
              <div class="flex-grow">
                <h4 class="font-medium text-gray-800">{{ item.servicio.nombre }}</h4>
                <p class="text-sm text-gray-600">Cantidad: {{ item.cantidad }}</p>
                <div v-if="item.tecnologiasSeleccionadas && item.tecnologiasSeleccionadas.length" class="mt-2">
                  <p class="text-sm text-gray-600">Tecnologías:</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span v-for="tech in item.tecnologiasSeleccionadas" :key="tech._id"
                      class="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full">
                      {{ tech.name }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-800">${{ item.precioUnitario * item.cantidad }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${{ order.subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Impuestos (13%)</span>
              <span>${{ order.impuestos }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-violet-800">
              <span>Total</span>
              <span>${{ order.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { obtenerUsuario } from '@/utils/auth'

const orders = ref([])
const loading = ref(true)
const error = ref(null)

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/ordenes', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) {
      throw new Error('Error al obtener las órdenes')
    }
    const data = await response.json()
    orders.value = data
    loading.value = false
  } catch (err) {
    error.value = 'Error al cargar el historial de compras. Por favor, intente nuevamente.'
    loading.value = false
    console.error('Error fetching orders:', err)
  }
}

onMounted(() => {
  fetchOrders()
})
</script> 