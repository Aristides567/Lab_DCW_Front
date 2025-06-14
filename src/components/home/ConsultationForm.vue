<script setup>
import { ref } from 'vue'

// Campos del formulario
const nombre = ref('')
const email = ref('')
const telefono = ref('')
const mensaje = ref('')
const formularioEnviado = ref(false)
const cargando = ref(false)
const error = ref('')

// Mensajes de error
const errores = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

// Validación
const validarFormulario = () => {
  errores.value = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  }

  let valido = true

  if (!nombre.value.trim()) {
    errores.value.nombre = 'El nombre es obligatorio.'
    valido = false
  }

  if (!email.value.trim()) {
    errores.value.email = 'El correo es obligatorio.'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errores.value.email = 'El correo no es válido.'
    valido = false
  }

  if (!telefono.value.trim()) {
    errores.value.telefono = 'El teléfono es obligatorio.'
    valido = false
  } else if (!/^\d{8,}$/.test(telefono.value)) {
    errores.value.telefono = 'El teléfono debe tener al menos 8 dígitos numéricos.'
    valido = false
  }

  if (!mensaje.value.trim()) {
    errores.value.mensaje = 'El mensaje no puede estar vacío.'
    valido = false
  }

  return valido
}

// Envío
const enviarFormulario = async () => {
  if (!validarFormulario()) return

  cargando.value = true
  error.value = ''

  try {
    const response = await fetch('http://localhost:5000/api/consultas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        mensaje: mensaje.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al enviar la consulta')
    }

    const data = await response.json()
    formularioEnviado.value = true
    
    // Limpiar campos
    nombre.value = ''
    email.value = ''
    telefono.value = ''
    mensaje.value = ''

    // Ocultar mensaje de "¡Enviado!" después de 5 segundos
    setTimeout(() => {
      formularioEnviado.value = false
    }, 5000)
  } catch (error) {
    console.error('Error al enviar la consulta:', error)
    error.value = error.message || 'Error al enviar la consulta. Por favor, intente nuevamente.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section id="consultas" class="py-24 bg-white border-gray-200">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl text-center text-violet-600 mb-12 font-bold">Solicita una Consulta</h2>

      <form @submit.prevent="enviarFormulario" class="max-w-2xl mx-auto space-y-6">
        <div>
          <input
            v-model="nombre"
            type="text"
            placeholder="Nombre"
            class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 transition"
            :disabled="cargando"
          />
          <p v-if="errores.nombre" class="text-red-600 text-sm mt-1">{{ errores.nombre }}</p>
        </div>

        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 transition"
            :disabled="cargando"
          />
          <p v-if="errores.email" class="text-red-600 text-sm mt-1">{{ errores.email }}</p>
        </div>

        <div>
          <input
            v-model="telefono"
            type="tel"
            placeholder="Teléfono"
            class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 transition"
            :disabled="cargando"
          />
          <p v-if="errores.telefono" class="text-red-600 text-sm mt-1">{{ errores.telefono }}</p>
        </div>

        <div>
          <textarea
            v-model="mensaje"
            placeholder="Mensaje"
            class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 transition"
            :disabled="cargando"
          ></textarea>
          <p v-if="errores.mensaje" class="text-red-600 text-sm mt-1">{{ errores.mensaje }}</p>
        </div>

        <p v-if="error" class="text-red-600 text-center">{{ error }}</p>

        <button
          type="submit"
          :class="[
            'w-full text-white py-4 px-8 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg',
            formularioEnviado ? 'bg-green-500 hover:bg-green-400' : 'bg-violet-600 hover:bg-violet-400',
            cargando ? 'opacity-50 cursor-not-allowed' : ''
          ]"
          :disabled="cargando"
        >
          {{ cargando ? 'Enviando...' : formularioEnviado ? '¡Enviado! ✔' : 'Enviar Solicitud' }}
        </button>
      </form>
    </div>
  </section>
</template>
