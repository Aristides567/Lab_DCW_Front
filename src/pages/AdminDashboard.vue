<script setup>
import { ref, computed, onMounted } from 'vue'
import CrudUsuarios from '@/components/admin/CrudUsuarios.vue'
import CrudServicios from '@/components/admin/CrudServicios.vue'
import CrudTecnologias from '@/components/admin/CrudTecnologias.vue'
import { obtenerToken, cerrarSesion } from '@/utils/auth'
import { register } from '@/utils/api'         

/* --------- estado --------- */
const seccion = ref('usuarios')
const refetchUsuarios = ref(0)
const refetchServicios = ref(0)
const refetchTecnologias = ref(0)
const mostrarCrear = ref(false)

const usuarioActual = ref({ nombre: '' })
const nuevoUsuario = ref({ nombre: '', email: '', password: '', rol: 'cliente' })

/* --------- saludo --------- */
const displayName = computed(() =>
  usuarioActual.value?.nombre ??
  usuarioActual.value?.nombreUsuario ??
  usuarioActual.value?.username ?? 'Usuario'
)

/* --------- carga del admin --------- */
onMounted(async () => {
  try {
    const token = obtenerToken()
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario')
    }

    const data = await response.json()
    usuarioActual.value = data.user
  } catch { usuarioActual.value.nombre = 'Usuario' }
})

function logout() {
  cerrarSesion()
  window.location.href = '/'
}

function switchTab(tab) { 
  seccion.value = tab
  mostrarCrear.value = false 
}
function resetForm() { nuevoUsuario.value = { nombre: '', email: '', password: '', rol: 'cliente' } }

/* --------- registrar usuario (sin token) --------- */
async function crearUsuarioEnBackend() {
  const { nombre, email, password, rol } = nuevoUsuario.value
  if (!nombre || !email || !password) { alert('Completa todos los campos'); return }

  try {
    const token = obtenerToken()
    /* 1. REGISTRO BÁSICO */
    const res = await register(nombre.trim(), email.trim(), password, rol, token)  // Enviamos el rol y token
    if (res.error || res.message) throw new Error(res.message || 'Error')

    /* 2. REFRESH */
    refetchUsuarios.value++
    mostrarCrear.value = false
    resetForm()
  } catch (err) {
    console.error('Registrar usuario →', err)
    alert(err.message || 'Error al registrar usuario')
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-violet-900 via-gray-900 to-violet-950">
    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-gray-900/95 shadow-md py-2 px-4 flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <span class="text-xl font-bold text-violet-200">Panel de Administración</span>
        <span class="hidden md:inline text-gray-300">| Bienvenido, {{ displayName }}</span>
      </div>
      <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow">
        Cerrar sesión
      </button>
    </header>

    <!-- CONTENIDO -->
    <section class="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div class="rounded-2xl shadow-xl bg-gray-900/90 ring-1 ring-violet-800 backdrop-blur-sm px-8 py-10">
        <!-- Tabs -->
        <nav class="flex flex-wrap justify-center gap-4 mb-10">
          <button @click="switchTab('usuarios')"
            :class="['px-6 py-2 rounded-xl font-semibold transition-all shadow-sm',
              seccion === 'usuarios'
                ? 'bg-violet-600 text-white shadow-violet-200 scale-105'
                : 'bg-violet-200 text-violet-900 hover:bg-violet-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-violet-800']">
            Usuarios
          </button>
          <button @click="switchTab('servicios')"
            :class="['px-6 py-2 rounded-xl font-semibold transition-all shadow-sm',
              seccion === 'servicios'
                ? 'bg-violet-600 text-white shadow-violet-200 scale-105'
                : 'bg-violet-200 text-violet-900 hover:bg-violet-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-violet-800']">
            Servicios
          </button>
          <button @click="switchTab('tecnologias')"
            :class="['px-6 py-2 rounded-xl font-semibold transition-all shadow-sm',
              seccion === 'tecnologias'
                ? 'bg-violet-600 text-white shadow-violet-200 scale-105'
                : 'bg-violet-200 text-violet-900 hover:bg-violet-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-violet-800']">
            Tecnologías
          </button>
        </nav>

        <!-- Vista dinámica -->
        <div v-if="seccion === 'usuarios'" class="min-h-[420px] animate-fade-in">
          <CrudUsuarios :refetch="refetchUsuarios" />

          <!-- Botón -->
          <div v-if="!mostrarCrear" class="flex justify-center mt-10">
            <button @click="mostrarCrear = true"
              class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow">
              Crear Usuario
            </button>
          </div>

          <!-- Formulario -->
          <div v-else
            class="mt-10 mb-6 bg-white/90 dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-2xl mx-auto animate-fade-in">
            <h3 class="text-2xl font-semibold text-violet-700 dark:text-violet-300 mb-4">
              Crear nuevo usuario
            </h3>

            <div class="flex flex-col gap-4">
              <input v-model="nuevoUsuario.nombre" placeholder="Nombre"
                class="p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white" />
              <input v-model="nuevoUsuario.email" placeholder="Correo" type="email"
                class="p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white" />
              <input v-model="nuevoUsuario.password" placeholder="Contraseña" type="password"
                class="p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white" />
              <select v-model="nuevoUsuario.rol" class="p-2 border rounded dark:bg-gray-800 dark:text-white">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="mt-6 flex flex-col md:flex-row gap-4 justify-between">
              <button @click="crearUsuarioEnBackend"
                class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded w-full md:w-auto">
                Crear Usuario
              </button>
              <button @click="mostrarCrear = false"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded w-full md:w-auto dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div v-if="seccion === 'servicios'" class="min-h-[420px] animate-fade-in">
          <CrudServicios :refetch="refetchServicios" />
        </div>

        <div v-if="seccion === 'tecnologias'" class="min-h-[420px] animate-fade-in">
          <CrudTecnologias :refetch="refetchTecnologias" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in .5s cubic-bezier(.44, .09, .52, 1.02);
}
</style>
