<script setup>
import { ref } from 'vue'
import { register } from '@/utils/api'

const nombre = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const exito = ref(false)
const cargando = ref(false)

const registrar = async () => {
  console.log('[✔] Se ejecutó la función registrar')

  cargando.value = true
  error.value = ''
  exito.value = false

  try {
    const data = await register(nombre.value, email.value, password.value)
    console.log('[📦] Respuesta del backend:', data)

    if (data.token) {
      exito.value = true
    } else {
      error.value = data.message || 'Error al registrarse'
    }
  } catch (err) {
    console.error('[❌] Error en la solicitud:', err)
    error.value = 'Error al conectar con el servidor'
  }

  cargando.value = false
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-rose-100">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-violet-600 mb-6">Crear cuenta</h2>

      <form @submit.prevent="registrar" class="space-y-4">
        <input v-model="nombre" type="text" placeholder="Nombre"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
        <input v-model="email" type="email" placeholder="Correo electrónico"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
        <input v-model="password" type="password" placeholder="Contraseña"
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <p v-if="exito" class="text-green-600 text-sm">Registro exitoso. Ya puedes iniciar sesión.</p>

        <!-- Reemplaza temporalmente BaseButton para depurar -->
        <button type="submit" class="bg-violet-600 text-white p-3 rounded w-full">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="text-sm mt-4 text-center">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-violet-600 hover:underline font-semibold">Inicia sesión</router-link>
      </p>
    </div>
  </section>
</template>
