<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Header  from '@/components/layout/Header.vue'
import Footer  from '@/components/layout/Footer.vue'
import { obtenerUsuario } from '@/utils/auth'
import {
  cartState,
  fetchCartData,
  updateCartItem,
  removeCartItem
} from '@/utils/cartStore'

/* ───────── estado ───────── */
const usuario          = ref(null)
const hoveredServiceId = ref(null)
const router           = useRouter()

/* ───────── filtros ───────── */
const validItems = computed(() =>
  (cartState.items || []).filter(i => i?.servicioId)          // ← evita nulos
)

/* ───────── totales ───────── */
const subtotal   = computed(() =>
  validItems.value.reduce((t, i) => t + (i.servicioId?.costo || 0) * i.cantidad, 0)
)
const impuestos  = computed(() => +(subtotal.value * 0.13).toFixed(2))
const totalFinal = computed(() => +(subtotal.value + impuestos.value).toFixed(2))

/* ───────── helpers visuales ───────── */
const showTechnologiesHover = id => (hoveredServiceId.value = id)
const hideTechnologiesHover = () => (hoveredServiceId.value = null)
const getImageUrl = p => (p ? `https://lab-dcw-back.onrender.com${p}` : '/placeholder.png')

/* ───────── acciones carrito ───────── */
async function actualizarCantidad (id, n) {
  if (!id || n <= 0) return
  await updateCartItem(id, n)
}
async function quitarDelCarrito (id) {
  if (!id) return
  await removeCartItem(id)
}
const confirmarEliminar = id =>
  id && confirm('¿Eliminar este servicio del carrito?') && quitarDelCarrito(id)

/* ───────── navegación ───────── */
const irAlCheckout = () => router.push('/checkout')

/* ───────── carga inicial ───────── */
onMounted(() => {
  usuario.value = obtenerUsuario()
  fetchCartData()
})
</script>

<template>
  <Header />

  <section class="min-h-screen bg-gray-50 pt-24 p-8">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 flex items-center gap-2 text-3xl font-bold text-violet-700">
        <span class="text-4xl">🛒</span> Tu&nbsp;Carrito
      </h1>

      <!-- loader / error -->
      <div v-if="cartState.loading" class="flex min-h-[400px] items-center justify-center">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-violet-600"></div>
      </div>
      <div v-else-if="cartState.error" class="py-12 text-center">
        <div class="mb-4 text-xl text-red-500">❌</div>
        <p class="text-lg text-red-500">{{ cartState.error }}</p>
      </div>

      <!-- vacío -->
      <div v-else-if="!validItems.length" class="py-16 text-center">
        <div class="mb-6 text-6xl">🛍️</div>
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Tu carrito está vacío</h2>
        <p class="mb-8 text-gray-500">¡Aún no has agregado ningún servicio!</p>
        <RouterLink
          to="/servicios"
          class="inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-violet-700"
        >Explorar Servicios</RouterLink>
      </div>

      <!-- contenido -->
      <div v-else class="grid gap-8 lg:grid-cols-3">
        <!-- lista -->
        <div class="lg:col-span-2">
          <ul class="space-y-4">
            <li
              v-for="item in validItems"
              :key="item.servicioId._id"
              class="relative rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              @mouseover="showTechnologiesHover(item.servicioId._id)"
              @mouseleave="hideTechnologiesHover"
            >
              <div class="flex flex-col gap-6 md:flex-row">
                <!-- imagen -->
                <img
                  v-if="item.servicioId?.imagen"
                  :src="getImageUrl(item.servicioId.imagen)"
                  :alt="item.servicioId?.nombre"
                  class="h-32 w-32 flex-shrink-0 rounded-lg border object-cover"
                />

                <div class="flex-grow">
                  <h3 class="mb-2 text-xl font-bold text-violet-700">{{ item.servicioId?.nombre }}</h3>
                  <p class="mb-4 text-gray-600">
                    {{ (item.servicioId?.descripcion || '').slice(0, 100) }}…
                  </p>

                  <!-- hover tecnologías -->
                  <div
                    v-if="hoveredServiceId === item.servicioId._id && item.tecnologiasSeleccionadas?.length"
                    class="animate-fade-in-scale absolute left-0 top-0 w-64 -translate-x-full rounded-lg border border-violet-200 bg-white p-4 shadow-lg"
                  >
                    <h4 class="mb-2 text-sm font-semibold text-violet-700">Tecnologías:</h4>
                    <div class="flex flex-wrap gap-2">
                      <img
                        v-for="tech in item.tecnologiasSeleccionadas"
                        :key="tech._id"
                        :src="getImageUrl(tech.image)"
                        :alt="tech.name"
                        class="h-10 w-10 rounded-full border object-cover"
                        :title="tech.name"
                      />
                    </div>
                  </div>

                  <!-- cantidad / subtotal -->
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <label class="font-medium text-gray-600">Cantidad:</label>
                      <div class="overflow-hidden rounded-lg border">
                        <button
                          class="bg-gray-100 px-3 py-2 hover:bg-gray-200"
                          @click="actualizarCantidad(item.servicioId._id, item.cantidad - 1)"
                        >-</button>
                        <input
                          v-model.number="item.cantidad"
                          @change="actualizarCantidad(item.servicioId._id, item.cantidad)"
                          type="number" min="1"
                          class="w-16 p-2 text-center focus:outline-none"
                        />
                        <button
                          class="bg-gray-100 px-3 py-2 hover:bg-gray-200"
                          @click="actualizarCantidad(item.servicioId._id, item.cantidad + 1)"
                        >+</button>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold text-violet-800">
                        Subtotal: $ {{ (item.servicioId?.costo || 0) * item.cantidad }}
                      </p>
                      <button
                        @click="confirmarEliminar(item.servicioId._id)"
                        class="mt-2 text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                      >Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- resumen -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-bold text-gray-800">Resumen del Pedido</h2>

            <div class="mb-6 space-y-4">
              <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>$ {{ subtotal }}</span></div>
              <div class="flex justify-between text-gray-600"><span>Impuestos&nbsp;13 %</span><span>$ {{ impuestos }}</span></div>
              <div class="border-t pt-4 text-lg font-bold text-violet-800">
                <div class="flex justify-between"><span>Total</span><span>$ {{ totalFinal }}</span></div>
              </div>
            </div>

            <button
              @click="irAlCheckout"
              class="mb-4 w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition-colors duration-300 hover:bg-violet-700"
            >Proceder al Pago</button>

            <RouterLink to="/servicios" class="block text-center font-medium text-violet-600 hover:text-violet-700">
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
.animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out; }
@keyframes fade-in-scale {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1);   }
}
</style>