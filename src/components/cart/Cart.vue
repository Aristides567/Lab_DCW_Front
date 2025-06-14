<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-violet-700 mb-8">Carrito de Compras</h1>

      <!-- Carrito vacío -->
      <div v-if="!cartState.items.length" class="text-center py-12">
        <p class="text-xl text-gray-600 mb-4">Tu carrito está vacío</p>
        <RouterLink to="/servicios" class="text-violet-600 hover:text-violet-800 font-semibold">
          Ver servicios disponibles
        </RouterLink>
      </div>

      <!-- Carrito con items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Lista de Items -->
        <div class="lg:col-span-2">
          <ul class="space-y-4">
            <li v-for="item in cartState.items" :key="item.servicioId._id" 
                class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0">
                  <img
                    v-if="item.servicioId.imagen"
                    :src="'https://lab-dcw-back.onrender.com' + item.servicioId.imagen"
                    :alt="item.servicioId.nombre"
                    class="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                </div>
                
                <div class="flex-1">
                  <h3 class="font-bold text-xl text-violet-700 mb-2">{{ item.servicioId.nombre }}</h3>
                  <p class="text-gray-600 mb-4">{{ item.servicioId.descripcion.substring(0, 100) + '...' }}</p>
                  
                  <!-- Tecnologías seleccionadas -->
                  <div v-if="item.tecnologiasSeleccionadas && item.tecnologiasSeleccionadas.length" class="mb-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2">Tecnologías seleccionadas:</h4>
                    <ul class="space-y-1">
                      <li v-for="tech in item.tecnologiasSeleccionadas" :key="tech._id"
                          class="text-sm text-gray-600 flex items-center gap-2">
                        <span class="w-2 h-2 bg-violet-500 rounded-full"></span>
                        {{ tech.name }} (+${{ tech.price }})
                      </li>
                    </ul>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <label for="cantidad" class="text-gray-600 font-medium">Cantidad:</label>
                      <div class="flex items-center border rounded-lg overflow-hidden">
                        <button @click="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad - 1)"
                                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                          -
                        </button>
                        <input
                          type="number"
                          v-model.number="item.cantidad"
                          @change="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad)"
                          min="1"
                          class="w-16 p-2 text-center focus:outline-none"
                        />
                        <button @click="actualizarCantidadEnCarrito(item.servicioId._id, item.cantidad + 1)"
                                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                          +
                        </button>
                      </div>
                    </div>

                    <div class="text-right">
                      <p class="text-lg font-semibold text-violet-600">
                        ${{ item.precioTotal * item.cantidad }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Resumen del carrito -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h2 class="text-2xl font-bold text-violet-700 mb-6">Resumen del Pedido</h2>
            
            <div class="space-y-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartState.total }}</span>
              </div>
              
              <div class="border-t pt-4">
                <div class="flex justify-between text-xl font-bold text-violet-700">
                  <span>Total</span>
                  <span>${{ cartState.total }}</span>
                </div>
              </div>
            </div>

            <button
              class="w-full mt-6 bg-violet-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerUsuario } from '@/utils/auth'
import { cartState, fetchCartData, updateCartItem, removeCartItem } from '@/utils/cartStore'
import { RouterLink } from 'vue-router'

const usuario = ref(null)

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

const totalCarrito = computed(() => cartState.total)
</script> 