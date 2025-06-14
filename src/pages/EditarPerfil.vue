<script setup>
import { ref, onMounted } from 'vue'
import { obtenerUsuario } from '@/utils/auth'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const router = useRouter()
const usuario = ref({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const mensaje = ref('')
const error = ref('')
const cargando = ref(false)

onMounted(() => {
  const usuarioActual = obtenerUsuario()
  if (usuarioActual) {
    usuario.value = { 
      ...usuarioActual,
      password: '',
      confirmPassword: ''
    }
  }
})

const guardarCambios = async () => {
  try {
    cargando.value = true
    error.value = ''
    mensaje.value = ''

    // Validar que las contraseñas coincidan si se están cambiando
    if (usuario.value.password && usuario.value.password !== usuario.value.confirmPassword) {
      error.value = 'Las contraseñas no coinciden'
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const response = await fetch('http://localhost:5000/api/usuarios/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: usuario.value.nombre,
        email: usuario.value.email,
        password: usuario.value.password || undefined
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Error al actualizar el perfil')
    }

    const data = await response.json()

    // Actualizar el usuario en localStorage
    const usuarioActualizado = { ...data }
    delete usuarioActualizado.password
    delete usuarioActualizado.confirmPassword
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))

    mensaje.value = 'Perfil actualizado correctamente'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message || 'Error al actualizar el perfil'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <Header />
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-3xl font-extrabold text-violet-700 text-center mb-8">Editar Perfil</h2>
      
      <form @submit.prevent="guardarCambios" class="space-y-6">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input 
            id="nombre"
            v-model="usuario.nombre"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
            required
          >
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            id="email"
            v-model="usuario.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
            required
          >
        </div>

        <div class="border-t border-gray-200 pt-6 mt-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-5">Cambiar Contraseña</h3>
          <div class="space-y-6">
            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
              <input 
                id="new-password"
                v-model="usuario.password"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
                minlength="6"
                autocomplete="new-password"
              >
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
              <input 
                id="confirm-password"
                v-model="usuario.confirmPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
                minlength="6"
                autocomplete="new-password"
              >
            </div>
          </div>
        </div>

        <div v-if="mensaje" class="text-green-700 bg-green-100 p-3 rounded-lg font-medium border border-green-200">
          {{ mensaje }}
        </div>
        <div v-if="error" class="text-red-700 bg-red-100 p-3 rounded-lg font-medium border border-red-200">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          :disabled="cargando"
        >
          {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </form>
    </div>
  </div>
  <Footer />
</template> 