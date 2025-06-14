<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerUsuario } from '@/utils/auth'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { cartState, fetchCartData, updateCartItem, removeCartItem } from '@/utils/cartStore'
import { RouterLink, useRouter } from 'vue-router'

const usuario = ref(null)
const hoveredServiceId = ref(null)

const showTechnologiesHover = (serviceId) => {
  hoveredServiceId.value = serviceId
}
const hideTechnologiesHover = () => {
  hoveredServiceId.value = null
}

const actualizarCantidadEnCarrito = async (servicioId, nuevaCantidad) => {
  if (nuevaCantidad <= 0) {
    quitarDelCarrito(servicioId)
    return
  }
  await updateCartItem(servicioId, nuevaCantidad)
}
const quitarDelCarrito = async (servicioId) => {
  await removeCartItem(servicioId)
}
const confirmarEliminar = (servicioId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio del carrito?')) {
    quitarDelCarrito(servicioId)
  }
}

onMounted(() => {
  usuario.value = obtenerUsuario()
  fetchCartData()
})

const router = useRouter()
const irAlCheckout = () => {
  router.push('/checkout')
}

const getTechnologyImageUrl = (imagePath) => {
  if (imagePath && !imagePath.startsWith('/uploads/technologies/')) {
    return `http://localhost:5000/uploads/technologies/${imagePath.substring(imagePath.lastIndexOf('/') + 1)}`
  }
  return `http://localhost:5000${imagePath}`
}

// Corrección del cálculo
const subtotal = computed(() => cartState.total)
const impuestos = computed(() => +(subtotal.value * 0.13).toFixed(2))
const totalFinal = computed(() => +(subtotal.value + impuestos.value).toFixed(2))
</script>

<template>
  <Header />
  <section class="min-h-screen pt-24 p-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-violet-700 mb-6 flex items-center gap-2">
        <span class="text-4xl">🛒</span> Tu Carrito
      </h1>

      <div v-if="cartState.loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>

      <div v-else-if="cartState.error" class="text-center py-12">
        <div class="text-red-500 text-xl mb-4">❌</div>
        <p class="text-red-500 text-lg">{{ cartState.error }}</p>
      </div>

      <div v-else-if="!cartState.items || cartState.items.length === 0" class="text-center py-16">
        <div class="text-6xl mb-6">🛍️</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Tu carrito está vacío</h2>
        <p class="text-gray-500 mb-8">¡Aún no has agregado ningún servicio a tu carrito!</p>
        <RouterLink to="/servicios"
          class="inline-block bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300 font-semibold">
          Explorar Servicios
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Lista de Items -->
        <div class="lg:col-span-2">
          <ul class="space-y-4">
            <li v-for="item in cartState.items" :key="item.servicioId._id"
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 relative"
              @mouseover="showTechnologiesHover(item.servicioId._id)" @mouseleave="hideTechnologiesHover()">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0">
                  <img v-if="item.servicioId.imagen" :src="'http://localhost:5000' + item.servicioId.imagen"
                    :alt="item.servicioId.nombre" class="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                </div>
                <div class="flex-grow">
                  <h3 class="font-bold text-xl text-violet-700 mb-2">{{ item.servicioId.nombre }}</h3>
                  <p class="text-gray-600 mb-4">{{ item.servicioId.descripcion.substring(0, 100) + '...' }}</p>

                  <!-- Tecnologías Hover -->
                  <div
                    v-if="hoveredServiceId === item.servicioId._id && item.tecnologiasSeleccionadas && item.tecnologiasSeleccionadas.length"
                    class="absolute top-0 left-0 p-4 bg-white rounded-lg shadow-lg border border-violet-200 z-10 w-64 animate-fade-in-scale transform -translate-x-full origin-top-right">
                    <h4 class="text-sm font-semibold text-violet-700 mb-2">Tecnologías:</h4>
                    <div class="flex flex-wrap gap-2">
                      <img v-for="tech in item.tecnologiasSeleccionadas" :key="tech._id"
                        :src="getTechnologyImageUrl(tech.image)" :alt="tech.name"
                        class="h-10 w-10 object-cover rounded-full border border-gray-200" :title="tech.name" />
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <label for="cantidad" class="text-gray-600 font-medium">Cantidad:</label>
                      <div class="flex items-center border rounded-lg overflow-hidden">
                        <button @click="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad - 1)"
                          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">-</button>
                        <input type="number" v-model.number="item.cantidad"
                          @change="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad)" min="1"
                          class="w-16 p-2 text-center focus:outline-none" />
                        <button @click="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad + 1)"
                          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">+</button>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold text-violet-800">
                        Subtotal: $ {{ item.precioTotal * item.cantidad }}
                      </p>
                      <button @click="confirmarEliminar(item.servicioId._id)"
                        class="text-red-500 hover:text-red-700 text-sm font-medium mt-2 transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Resumen -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>$ {{ subtotal }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Impuestos (13%)</span>
                <span>$ {{ impuestos }}</span>
              </div>
              <div class="border-t pt-4 flex justify-between text-lg font-bold text-violet-800">
                <span>Total</span>
                <span>$ {{ totalFinal }}</span>
              </div>
            </div>

            <button
              @click="irAlCheckout"
              class="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300 font-semibold mb-4">
              Proceder al Pago
            </button>

            <RouterLink to="/servicios" class="block text-center text-violet-600 hover:text-violet-700 font-medium">
              Continuar Comprando
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<style scoped>
.animate-fade-in-scale {
  animation: fade-in-scale 0.2s ease-out;
}
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
