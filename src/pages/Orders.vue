<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

/* ───────── estado ───────── */
const orders  = ref([])
const loading = ref(true)
const error   = ref(null)

/* ───────── obtener órdenes ───────── */
async function fetchOrders () {
  try {
    const res = await fetch('https://lab-dcw-back.onrender.com/api/ordenes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (!res.ok) throw new Error('Error al obtener las órdenes')
    const data = await res.json()

    /* limpia cada orden: quita items sin servicio */
    orders.value = data.map(o => ({
      ...o,
      items: (o.items || []).filter(it => it?.servicio)
    }))
    loading.value = false
  } catch (err) {
    console.error(err)
    error.value   = 'No se pudo cargar el historial. Intenta de nuevo.'
    loading.value = false
  }
}

/* ───────── imagen segura ───────── */
const getImg = p => (p ? `https://lab-dcw-back.onrender.com${p}` : '/placeholder.png')

/* ───────── totales por si faltan ───────── */
const ordersWithTotals = computed(() =>
  orders.value.map(o => {
    if (o.subtotal == null) {
      const subtotal = o.items.reduce((t, i) => t + i.precioUnitario * i.cantidad, 0)
      const impuestos = +(subtotal * 0.13).toFixed(2)
      const total     = +(subtotal + impuestos).toFixed(2)
      return { ...o, subtotal, impuestos, total }
    }
    return o
  })
)

onMounted(fetchOrders)
</script>

<template>
  <Header />

  <section class="min-h-screen bg-gray-50 pt-24 p-8">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 flex items-center gap-2 text-3xl font-bold text-violet-700">
        <span class="text-4xl">📦</span> Mis&nbsp;Compras
      </h1>

      <!-- loader / error -->
      <div v-if="loading" class="flex min-h-[400px] items-center justify-center">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-violet-600" />
      </div>
      <div v-else-if="error" class="py-12 text-center">
        <div class="mb-4 text-xl text-red-500">❌</div>
        <p class="text-lg text-red-500">{{ error }}</p>
      </div>

      <!-- sin compras -->
      <div v-else-if="!ordersWithTotals.length" class="py-16 text-center">
        <div class="mb-6 text-6xl">🛍️</div>
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">No tienes compras aún</h2>
        <p class="mb-8 text-gray-500">¡Explora nuestros servicios y realiza tu primera compra!</p>
        <RouterLink
          to="/servicios"
          class="inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-violet-700"
        >Ver Servicios</RouterLink>
      </div>

      <!-- listado de órdenes -->
      <div v-else class="space-y-6">
        <div
          v-for="order in ordersWithTotals"
          :key="order._id"
          class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <!-- cabecera orden -->
          <div class="mb-4 flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Orden&nbsp;#{{ order._id.slice(-6) }}</h3>
              <p class="text-sm text-gray-500">
                {{ new Date(order.fechaCompra).toLocaleDateString('es-ES', {
                  year:'numeric', month:'long', day:'numeric',
                  hour:'2-digit', minute:'2-digit'
                }) }}
              </p>
            </div>
          </div>

          <!-- items -->
          <div class="space-y-4">
            <div
              v-for="it in order.items"
              :key="it._id || (it.servicio?._id + '-detalle')"
              class="flex gap-4 rounded-lg bg-gray-50 p-4"
            >
              <img
                :src="getImg(it.servicio?.imagen)"
                :alt="it.servicio?.nombre"
                class="h-20 w-20 rounded-lg object-cover"
              />
              <div class="flex-grow">
                <h4 class="font-medium text-gray-800">{{ it.servicio?.nombre }}</h4>
                <p class="text-sm text-gray-600">Cantidad: {{ it.cantidad }}</p>

                <div v-if="it.tecnologiasSeleccionadas?.length" class="mt-2">
                  <p class="text-sm text-gray-600">Tecnologías:</p>
                  <div class="mt-1 flex flex-wrap gap-2">
                    <span
                      v-for="t in it.tecnologiasSeleccionadas"
                      :key="t._id"
                      class="rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-800"
                    >{{ t.name }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-800">
                  ${{ it.precioUnitario * it.cantidad }}
                </p>
              </div>
            </div>
          </div>

          <!-- totales -->
          <div class="mt-6 border-t border-gray-100 pt-4">
            <div class="mb-2 flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>${{ order.subtotal }}</span>
            </div>
            <div class="mb-2 flex justify-between text-sm text-gray-600">
              <span>Impuestos&nbsp;13 %</span><span>${{ order.impuestos }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-violet-800">
              <span>Total</span><span>${{ order.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>