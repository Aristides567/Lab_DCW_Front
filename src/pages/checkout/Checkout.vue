<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../../components/layout/Header.vue'
import Footer from '../../components/layout/Footer.vue'
import { cartState, fetchCartData } from '../../utils/cartStore'

const router = useRouter()

const formData = ref({
  nombre: '',
  apellido: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
  numeroTarjeta: '',
  fechaExpiracion: '',
  cvv: ''
})

onMounted(() => {
  fetchCartData()
})

// Formatea el número de tarjeta en bloques de 4
watch(() => formData.value.numeroTarjeta, (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 16)
  formData.value.numeroTarjeta = digits.replace(/(.{4})/g, '$1 ').trim()
})

// Formatea la fecha de expiración como MM/AA
watch(() => formData.value.fechaExpiracion, (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    formData.value.fechaExpiracion = `${digits.slice(0, 2)}/${digits.slice(2)}`
  } else {
    formData.value.fechaExpiracion = digits
  }
})

// CVV: Solo permite 3 dígitos
watch(() => formData.value.cvv, (val) => {
  formData.value.cvv = val.replace(/\D/g, '').slice(0, 3)
})

const validarFechaExpiracion = () => {
  const [mes, año] = formData.value.fechaExpiracion.split('/')
  if (!mes || !año || mes.length !== 2 || año.length !== 2) return false
  const expDate = new Date(`20${año}`, mes - 1)
  const now = new Date()
  expDate.setMonth(expDate.getMonth() + 1)
  return expDate > now
}

const subtotal = computed(() => cartState.total)
const impuestos = computed(() => +(subtotal.value * 0.13).toFixed(2))
const total = computed(() => +(subtotal.value + impuestos.value).toFixed(2))

const getImageUrl = (path) => `http://localhost:5000${path}`

const procesarCompra = async () => {
  if (!validarFechaExpiracion()) {
    alert('La fecha de expiración es inválida o ya venció.')
    return
  }

  try {
    const response = await fetch('http://localhost:5000/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        items: cartState.items.map(item => ({
          producto_id: item.servicioId._id,
          cantidad: item.cantidad
        })),
        direccion: {
          nombre: formData.value.nombre,
          apellido: formData.value.apellido,
          direccion: formData.value.direccion,
          ciudad: formData.value.ciudad,
          codigoPostal: formData.value.codigoPostal
        }
      })
    })

    if (!response.ok) throw new Error('Error al procesar la compra')

    cartState.items = []
    localStorage.removeItem('cart')
    router.push('/confirmacion')
  } catch (err) {
    console.error(err)
    alert('Hubo un error al procesar tu compra.')
  }
}
</script>

<template>
  <Header />
  <section class="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-violet-700 mb-6 flex items-center gap-2">
        <span class="text-4xl">💳</span> Finalizar Compra
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario -->
        <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <form @submit.prevent="procesarCompra" class="space-y-8">
            <!-- Información de Envío -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">📦 Información de Envío</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input v-model="formData.nombre" type="text" required
                         class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input v-model="formData.apellido" type="text" required
                         class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input v-model="formData.direccion" type="text" required
                         class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input v-model="formData.ciudad" type="text" required
                         class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input v-model="formData.codigoPostal" type="text" required
                         class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                </div>
              </div>
            </div>

            <!-- Información de Pago -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">💳 Información de Pago</h2>
              <div class="space-y-6">
                <!-- Tarjeta -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                  <div class="relative">
                    <input v-model="formData.numeroTarjeta" type="text" required placeholder="1234 5678 9012 3456"
                           class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">💳</span>
                  </div>
                </div>

                <!-- Fecha y CVV -->
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración</label>
                    <div class="relative">
                      <input v-model="formData.fechaExpiracion" type="text" required placeholder="MM/AA"
                             class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                      <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">📅</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <div class="relative">
                      <input v-model="formData.cvv" type="text" required placeholder="123"
                             class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" />
                      <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón -->
            <button type="submit"
                    class="w-full bg-violet-600 text-white py-3 rounded-xl shadow-md hover:bg-violet-700 hover:shadow-lg transition-all duration-300 text-lg font-semibold tracking-wide">
              Confirmar Compra
            </button>
          </form>
        </div>

        <!-- Resumen del Pedido -->
        <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-gray-200 sticky top-24">
          <h2 class="text-xl font-bold text-gray-800 mb-6">🧾 Resumen del Pedido</h2>
          <div class="space-y-4">
            <div v-for="item in cartState.items" :key="item.servicioId._id" class="flex items-center space-x-4">
              <img :src="getImageUrl(item.servicioId.imagen)" class="w-20 h-20 object-cover rounded-xl border" />
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-900">{{ item.servicioId.nombre }}</h3>
                <p class="text-sm text-gray-500">Cantidad: {{ item.cantidad }}</p>
                <p class="text-sm font-semibold text-violet-700">
                  ${{ item.servicioId.costo * item.cantidad }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 mt-6 pt-4 space-y-2">
            <div class="flex justify-between text-base text-gray-600">
              <p>Subtotal</p>
              <p>${{ subtotal }}</p>
            </div>
            <div class="flex justify-between text-base text-gray-600">
              <p>Impuestos (13%)</p>
              <p>${{ impuestos }}</p>
            </div>
            <div class="flex justify-between text-lg font-bold text-violet-800">
              <p>Total</p>
              <p>${{ total }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>
