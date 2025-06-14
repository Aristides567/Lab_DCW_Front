<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">¡Compra Exitosa!</h1>
        <p class="text-base sm:text-lg text-gray-600 mb-8">
          Gracias por tu compra. Hemos recibido tu pedido y te enviaremos un correo electrónico con los detalles.
        </p>

        <RouterLink
          to="/"
          class="inline-block bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300 font-semibold w-full sm:w-auto"
        >
          Volver a la Tienda
        </RouterLink>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '../../components/layout/Header.vue'
import Footer from '../../components/layout/Footer.vue'
</script>
