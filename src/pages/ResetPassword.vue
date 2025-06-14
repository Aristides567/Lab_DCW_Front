<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const password = ref('')
const confirmPassword = ref('')
const mensaje = ref('')
const error = ref('')
const cargando = ref(false)
const token = ref('')

const route = useRoute()
const router = useRouter()

onMounted(() => {
  token.value = route.params.resettoken
  if (!token.value) {
    error.value = 'Token de restablecimiento no encontrado.'
  }
})

const resetearContrasena = async () => {
  cargando.value = true
  mensaje.value = ''
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    cargando.value = false
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    cargando.value = false
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/api/auth/resetpassword/${token.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newPassword: password.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al restablecer la contraseña')
    }

    const data = await response.json()
    mensaje.value = data.message || 'Contraseña restablecida correctamente.'
    
    // Redirigir al login después de un breve mensaje de éxito
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (error) {
    console.error('Error al restablecer contraseña:', error)
    error.value = error.message || 'Error al restablecer la contraseña. Inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-rose-100">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-violet-600 mb-6">Restablecer Contraseña</h2>
      <p class="text-center text-gray-600 mb-6">Ingresa tu nueva contraseña.</p>

      <form @submit.prevent="resetearContrasena" class="space-y-4">
        <input v-model="password" type="password" placeholder="Nueva Contraseña"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
               required>
        <input v-model="confirmPassword" type="password" placeholder="Confirmar Contraseña"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
               required>
        
        <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
        <p v-if="mensaje" class="text-green-600 text-sm text-center">{{ mensaje }}</p>

        <button type="submit" class="bg-violet-600 text-white p-3 rounded w-full"
                :disabled="cargando">
          {{ cargando ? 'Restableciendo...' : 'Restablecer Contraseña' }}
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