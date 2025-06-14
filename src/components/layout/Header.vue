<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/img/d8624d2c-5598-49f5-a392-f666ed71d940.png'
import { obtenerUsuario, cerrarSesion } from '@/utils/auth'
import { cartState, fetchCartData, updateCartItem, removeCartItem } from '@/utils/cartStore'

/* ───────── router & estado ───────── */
const route  = useRoute()
const router = useRouter()

const usuario               = computed(() => obtenerUsuario())
const mostrarMenu           = ref(false)
const mostrarResumenCarrito = ref(false)
let   mouseLeaveTimeout     = null

/* ───────── links navegación ───────── */
const rutas = ['/', '/servicios', '/sobre-nosotros']
const clasesRuta = computed(() =>
  rutas.reduce((acc, p) => {
    acc[p] = route.path === p
      ? 'text-violet-600 font-bold'
      : 'text-gray-900 font-semibold hover:text-violet-600 transition-colors duration-300'
    return acc
  }, {})
)

/* ───────── acciones ───────── */
function logout ()          { cerrarSesion(); router.push('/login'); mostrarMenu.value = false }
const toggleMenu      = ()  => (mostrarMenu.value = !mostrarMenu.value)
const irAEditarPerfil = ()  => { router.push('/editar-perfil'); mostrarMenu.value = false }
const irAMisCompras   = ()  => { router.push('/mis-compras');   mostrarMenu.value = false }

async function actualizarCantidadResumen (id, e) {
  const n = +e.target.value
  if (!n || n < 1) return
  await updateCartItem(id, n)
}
const quitarItemResumen = async id =>
  confirm('¿Eliminar este servicio del carrito?') && removeCartItem(id)

/* ───────── hover resumen ───────── */
const entered = () => { clearTimeout(mouseLeaveTimeout); mostrarResumenCarrito.value = true }
const left    = () => { mouseLeaveTimeout = setTimeout(() => (mostrarResumenCarrito.value = false), 200) }

/* ───────── bootstrap ───────── */
onMounted(() => { if (usuario.value) fetchCartData() })
watch(() => route.fullPath, () => { mostrarMenu.value = false; mostrarResumenCarrito.value = false })

/* ───────── cálculos & filtros ───────── */
const validItems  = computed(() => (cartState.items || []).filter(i => i?.servicioId))
const itemsCount  = computed(() => cartState.count ?? validItems.value.length)
const subtotal    = computed(() => validItems.value.reduce((t, i) => t + (i.servicioId?.costo || 0) * i.cantidad, 0))
const impuestos   = computed(() => +(subtotal.value * 0.13).toFixed(2))
const totalFinal  = computed(() => +(subtotal.value + impuestos.value).toFixed(2))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center text-2xl font-bold text-violet-600 hover:text-red-400">
        <img :src="logo" alt="logo" class="mr-2 h-10 w-10" />
        <span>Novaweb Designers</span>
      </RouterLink>

      <!-- Links desktop -->
      <ul class="hidden items-center space-x-8 md:flex">
        <li><RouterLink to="/"              :class="clasesRuta['/']">Inicio</RouterLink></li>
        <li><RouterLink to="/servicios"     :class="clasesRuta['/servicios']">Servicios</RouterLink></li>
        <li><RouterLink to="/sobre-nosotros":class="clasesRuta['/sobre-nosotros']">Sobre&nbsp;Nosotros</RouterLink></li>

        <!-- Carrito -->
        <li v-if="usuario" class="relative flex items-center" @mouseenter="entered" @mouseleave="left">
          <RouterLink to="/cart" class="relative rounded-full p-2 text-gray-900 hover:bg-gray-100 hover:text-violet-600">
            🛒 Carrito
            <span v-if="itemsCount" class="animate-bounce-once absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {{ itemsCount }}
            </span>
          </RouterLink>

          <!-- Resumen -->
          <div
            v-if="mostrarResumenCarrito"
            class="absolute right-0 top-full mt-0 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
            @mouseenter="entered" @mouseleave="left"
          >
            <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2 font-bold text-gray-800">
              <span>Resumen del Carrito</span>
              <span class="text-sm text-gray-500">({{ itemsCount }} art.)</span>
            </div>

            <div v-if="cartState.loading"    class="py-4 text-center text-gray-500">Cargando…</div>
            <div v-else-if="cartState.error" class="py-4 text-center text-red-500">Error: {{ cartState.error }}</div>

            <ul v-else-if="validItems.length" class="max-h-60 divide-y divide-gray-100 overflow-y-auto">
              <li v-for="it in validItems" :key="it.servicioId._id" class="flex items-start gap-3 px-4 py-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">{{ it.servicioId?.nombre }}</p>
                  <p class="mt-1 text-xs text-gray-600">Costo: $ {{ it.servicioId?.costo }}</p>

                  <div class="mt-2 flex items-center">
                    <label class="mr-2 text-xs text-gray-600">Cant.:</label>
                    <input
                      :value="it.cantidad"
                      @change="actualizarCantidadResumen(it.servicioId._id, $event)"
                      type="number" min="1"
                      class="w-14 rounded-md border border-gray-300 p-1 text-center text-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                    <button @click="quitarItemResumen(it.servicioId._id)" class="ml-3 text-sm text-red-500 hover:text-red-700">
                      Eliminar
                    </button>
                  </div>
                </div>
                <p class="text-base font-semibold text-violet-700">
                  $ {{ (it.servicioId?.costo || 0) * it.cantidad }}
                </p>
              </li>
            </ul>

            <div v-else class="py-4 text-center text-gray-500">Tu carrito está vacío.</div>

            <!-- Totales -->
            <div class="space-y-1 border-t border-gray-200 px-4 py-2 text-right text-sm">
              <div class="flex justify-between"><span class="text-gray-600">Subtotal:</span><span class="font-medium text-gray-800">$ {{ subtotal }}</span></div>
              <div class="flex justify-between"><span class="text-gray-600">Impuestos (13 %):</span><span class="font-medium text-gray-800">$ {{ impuestos }}</span></div>
              <div class="flex justify-between border-t border-gray-200 pt-1 text-base font-bold text-violet-800"><span>Total:</span><span>$ {{ totalFinal }}</span></div>
            </div>

            <RouterLink to="/cart" class="block w-full rounded-b-lg bg-violet-600 py-2 text-center font-semibold text-white hover:bg-violet-700">
              Ver carrito completo
            </RouterLink>
          </div>
        </li>

        <!-- Login / Perfil -->
        <li v-if="!usuario">
          <RouterLink to="/login" class="rounded-full bg-violet-600 px-4 py-2 text-white hover:bg-red-500">Iniciar Sesión</RouterLink>
        </li>
        <li v-else class="relative">
          <button @click="toggleMenu" class="flex items-center gap-2 text-gray-800 hover:text-violet-600">
            <span class="font-semibold">{{ usuario.nombre }}</span><span class="text-xl">▼</span>
          </button>
          <div v-if="mostrarMenu" class="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            <button @click="irAEditarPerfil" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-600">Editar Perfil</button>
            <button @click="irAMisCompras"   class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-violet-50 hover:text-violet-600">Mis Compras</button>
            <button @click="logout"          class="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">Cerrar Sesión</button>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50%{ transform: scale(1.2); opacity: 1; }
  100%{ transform: scale(1);   }
}
.animate-bounce-once{ animation: bounce-in 0.5s ease-out; }
</style>