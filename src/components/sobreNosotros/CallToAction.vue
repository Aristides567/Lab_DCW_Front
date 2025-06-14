<script setup>
import { ref } from 'vue'
import ConsultationForm from '@/components/home/ConsultationForm.vue'

const mostrarModalFormulario = ref(false)
const mostrarModalContacto = ref(false)

const abrirFormulario = () => {
  mostrarModalFormulario.value = true
}

const abrirContacto = () => {
  mostrarModalContacto.value = true
}

const cerrarModales = () => {
  mostrarModalFormulario.value = false
  mostrarModalContacto.value = false
}
</script>

<template>
  <section id="cta" class="py-24 bg-gradient-to-r from-indigo-100 to-rose-100 text-center relative z-10">
    <div class="max-w-4xl mx-auto px-4">
      <template v-if="$route.name === 'SobreNosotros'">
        <h2 class="text-4xl text-violet-600 font-bold mb-6">¿Quieres trabajar con nosotros?</h2>
        <p class="text-xl text-gray-900 mb-8">Contáctanos y descubre cómo podemos ayudarte a lograr tus objetivos digitales.</p>
        <button
          v-on:click="abrirContacto"
          v-bind:class="'bg-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-400 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'"
        >
          Contáctanos
        </button>
      </template>

      <template v-else>
        <h2 class="text-4xl text-violet-600 font-bold mb-6">¿Listo para transformar tu negocio?</h2>
        <p class="text-xl text-gray-900 mb-8">Contáctanos y trabajemos juntos en tu próximo proyecto digital.</p>
        <button
          v-on:click="abrirFormulario"
          v-bind:class="'bg-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-400 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'"
        >
          Solicita una Consulta
        </button>
      </template>
    </div>

    <!-- Modal: Formulario -->
    <div v-if="mostrarModalFormulario" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="relative w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto border-0">
        <ConsultationForm />
        <button
          v-on:click="cerrarModales"
          v-bind:class="'absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition-all'"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Modal: Información de contacto -->
    <div v-if="mostrarModalContacto" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="relative bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
        <h3 class="text-2xl text-violet-600 font-bold mb-4">Información de Contacto</h3>
        <p class="text-gray-800 mb-2">📍 Calle Principal, San Miguel</p>
        <p class="text-gray-800 mb-2">📞 +503 1234-5678</p>
        <p class="text-gray-800 mb-4">📧 contacto@novawebdesigners.com</p>
        <button
          v-on:click="cerrarModales"
          v-bind:class="'mt-4 bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-900 transition-all'"
        >
          Cerrar
        </button>
      </div>
    </div>
  </section>
</template>
