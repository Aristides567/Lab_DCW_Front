<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const mensaje = ref('')
const error = ref('')
const cargando = ref(false)

const router = useRouter()

const solicitarRestablecimiento = async () => {
  cargando.value = true
  mensaje.value = ''
  error.value = ''

  try {
    const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al enviar el correo de restablecimiento')
    }

    const data = await response.json()
    mensaje.value = data.message || 'Instrucciones enviadas si el correo está registrado.'
    
    setTimeout(() => {
      router.push({ name: 'VerifyResetCode', query: { email: email.value } })
    }, 2000)

  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error)
    error.value = error.message || 'Error al solicitar restablecimiento de contraseña. Inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-rose-100">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-violet-600 mb-6">¿Olvidaste tu contraseña?</h2>
      <p class="text-center text-gray-600 mb-6">Ingresa tu correo electrónico para recibir un código de verificación.</p>

      <form @submit.prevent="solicitarRestablecimiento" class="space-y-4">
        <input v-model="email" type="email" placeholder="Correo electrónico"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
               required>
        
        <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
        <p v-if="mensaje" class="text-green-600 text-sm text-center">{{ mensaje }}</p>

        <button type="submit" class="bg-violet-600 text-white p-3 rounded w-full"
                :disabled="cargando">
          {{ cargando ? 'Enviando...' : 'Enviar código de verificación' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        <router-link to="/login" class="text-violet-600 hover:underline font-semibold">
          Volver al inicio de sesión
        </router-link>
      </p>
    </div>
  </section>
</template> 