<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import logo from '@/assets/img/d8624d2c-5598-49f5-a392-f666ed71d940.png'
import { obtenerUsuario, cerrarSesion } from '@/utils/auth'
import { cartState, fetchCartData, updateCartItem, removeCartItem } from '@/utils/cartStore'

const route = useRoute()
const router = useRouter()
const mostrarMenu = ref(false)
const mostrarResumenCarrito = ref(false)
let mouseLeaveTimeout = null

const usuario = computed(() => obtenerUsuario())

const rutas = ['/', '/servicios', '/sobre-nosotros']

const clasesRuta = computed(() => {
  return rutas.reduce((acc, path) => {
    acc[path] = route.path === path
      ? 'text-violet-600 font-bold'
      : 'text-gray-900 font-semibold hover:text-violet-600 transition-colors duration-300'
    return acc
  }, {})
})

const logout = () => {
  cerrarSesion()
  router.push('/login')
  mostrarMenu.value = false
}

const toggleMenu = () => {
  mostrarMenu.value = !mostrarMenu.value
}

const irAEditarPerfil = () => {
  router.push('/editar-perfil')
  mostrarMenu.value = false
}

const irAMisCompras = () => {
  router.push('/mis-compras')
  mostrarMenu.value = false
}

const actualizarCantidadResumen = async (servicioId, event) => {
  const nuevaCantidad = parseInt(event.target.value)
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return
  await updateCartItem(servicioId, nuevaCantidad)
}

const quitarItemResumen = async (servicioId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio del carrito?')) {
    await removeCartItem(servicioId)
  }
}

const handleMouseEnterCart = () => {
  clearTimeout(mouseLeaveTimeout)
  mostrarResumenCarrito.value = true
}

const handleMouseLeaveCart = () => {
  mouseLeaveTimeout = setTimeout(() => {
    mostrarResumenCarrito.value = false
  }, 200)
}

onMounted(() => {
  fetchCartData()
})

// Cálculos
const subtotal = computed(() => cartState.total)
const impuestos = computed(() => +(subtotal.value * 0.13).toFixed(2))
const totalFinal = computed(() => +(subtotal.value + impuestos.value).toFixed(2))
</script>

<template>
  <header class="fixed w-full top-0 z-50 bg-white/90 shadow-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4">
      <nav class="flex justify-between items-center py-4">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center text-violet-600 font-bold text-2xl hover:text-red-400">
          <img :src="logo" alt="Logo" class="mr-2 w-10 h-10" />
          <span>Novaweb Designers</span>
        </RouterLink>

        <!-- Navegación -->
        <ul class="hidden md:flex space-x-8 items-center">
          <li><RouterLink to="/" :class="clasesRuta['/']">Inicio</RouterLink></li>
          <li><RouterLink to="/servicios" :class="clasesRuta['/servicios']">Servicios</RouterLink></li>
          <li><RouterLink to="/sobre-nosotros" :class="clasesRuta['/sobre-nosotros']">Sobre Nosotros</RouterLink></li>

          <!-- Carrito -->
          <li v-if="usuario" class="relative h-full flex items-center" @mouseenter="handleMouseEnterCart" @mouseleave="handleMouseLeaveCart">
            <RouterLink to="/cart" class="text-gray-900 hover:text-violet-600 relative p-2 rounded-full hover:bg-gray-100">
              🛒 Carrito
              <span v-if="cartState.count > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-once">
                {{ cartState.count }}
              </span>
            </RouterLink>

            <!-- Resumen Carrito -->
            <div v-if="mostrarResumenCarrito" class="absolute right-0 top-full mt-0 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <div class="px-4 py-2 font-bold text-gray-800 border-b border-gray-200 flex justify-between items-center">
                <span>Resumen del Carrito</span>
                <span class="text-sm text-gray-500">({{ cartState.count }} artículos)</span>
              </div>

              <div v-if="cartState.loading" class="text-center py-4 text-gray-500">Cargando resumen...</div>
              <div v-else-if="cartState.error" class="text-center py-4 text-red-500">Error al cargar resumen.</div>

              <ul v-else-if="cartState.items.length > 0" class="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                <li v-for="item in cartState.items" :key="item.servicioId._id"
                    class="px-4 py-3 flex justify-between items-start gap-3">
                  <div class="flex-1">
                    <p class="text-gray-800 font-medium text-sm leading-tight">{{ item.servicioId.nombre }}</p>
                    <p class="text-gray-600 text-xs mt-1">Costo: $ {{ item.servicioId.costo }}</p>
                    <div class="flex items-center mt-2">
                      <label class="text-gray-600 text-xs mr-2">Cantidad:</label>
                      <input type="number" :value="item.cantidad"
                             @change="actualizarCantidadResumen(item.servicioId._id, $event)"
                             min="1"
                             class="w-14 p-1 border border-gray-300 rounded-md text-center text-sm focus:outline-none focus:ring-1 focus:ring-violet-500" />
                      <button @click="quitarItemResumen(item.servicioId._id)"
                              class="ml-3 text-red-500 hover:text-red-700 text-sm">
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <p class="text-violet-700 font-semibold text-base">$ {{ item.servicioId.costo * item.cantidad }}</p>
                </li>
              </ul>

              <div v-else class="text-center py-4 text-gray-500">Tu carrito está vacío.</div>

              <!-- Subtotal, impuestos, total -->
              <div class="px-4 py-2 space-y-1 border-t border-gray-200 text-sm text-right">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal:</span>
                  <span class="text-gray-800 font-medium">$ {{ subtotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Impuestos (13%):</span>
                  <span class="text-gray-800 font-medium">$ {{ impuestos }}</span>
                </div>
                <div class="flex justify-between text-violet-800 text-base font-bold pt-1 border-t border-gray-200">
                  <span>Total:</span>
                  <span>$ {{ totalFinal }}</span>
                </div>
              </div>

              <div class="px-4 py-2">
                <RouterLink to="/cart"
                            class="block w-full text-center bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition duration-300 font-semibold">
                  Ver Carrito Completo
                </RouterLink>
              </div>
            </div>
          </li>

          <!-- Login / Perfil -->
          <li v-if="!usuario">
            <RouterLink to="/login" class="text-white bg-violet-600 px-4 py-2 rounded-full hover:bg-red-500 transition">
              Iniciar Sesión
            </RouterLink>
          </li>
          <li v-else class="relative">
            <button @click="toggleMenu" class="flex items-center gap-2 text-gray-800 hover:text-violet-600 transition">
              <span class="font-semibold">{{ usuario.nombre }}</span>
              <span class="text-xl">▼</span>
            </button>

            <div v-if="mostrarMenu"
                 class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <button @click="irAEditarPerfil"
                      class="w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                Editar Perfil
              </button>
              <button @click="irAMisCompras"
                      class="w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600">
                Mis Compras
              </button>
              <button @click="logout"
                      class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                Cerrar Sesión
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-once {
  animation: bounce-in 0.5s ease-out;
}
</style>
