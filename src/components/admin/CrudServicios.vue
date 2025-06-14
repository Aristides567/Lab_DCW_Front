<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { obtenerToken } from '@/utils/auth'

const props = defineProps({
  refetch: { type: Number, default: 0 }
})

const servicios = ref([])
const cargando = ref(true)
const error = ref('')
const modoEdicion = ref(null)
const imagenPreview = ref(null)
const mostrarFormulario = ref(false)

const nuevoServicio = ref({
  nombre: '',
  descripcion: '',
  costo: '',
  categoria: 'pagina_web',
  imagen: null
})

const categorias = [
  { value: 'pagina_web', label: 'Página Web' },
  { value: 'aplicacion', label: 'Aplicación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otros', label: 'Otros' }
]

// Paginación
const paginaActual = ref(1)
const porPagina = 5

const serviciosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return servicios.value.slice(inicio, inicio + porPagina)
})
const totalPaginas = computed(() => Math.ceil(servicios.value.length / porPagina))

const fetchServices = async () => {
  try {
    const token = obtenerToken()
    const response = await fetch('http://localhost:5000/api/servicios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Error al obtener servicios')
    const data = await response.json()
    servicios.value = data
    if (paginaActual.value > totalPaginas.value) {
      paginaActual.value = totalPaginas.value || 1
    }
    error.value = ''
  } catch (error) {
    console.error('Error:', error)
    error.value = 'Error al cargar servicios'
  } finally {
    cargando.value = false
  }
}

watch(() => props.refetch, fetchServices)

const createService = async () => {
  try {
    if (!nuevoServicio.value.nombre || !nuevoServicio.value.descripcion || !nuevoServicio.value.costo) {
      error.value = 'Por favor completa todos los campos requeridos'
      return
    }
    if (!nuevoServicio.value.imagen) {
      error.value = 'Por favor selecciona una imagen'
      return
    }

    const formData = new FormData()
    formData.append('nombre', nuevoServicio.value.nombre)
    formData.append('descripcion', nuevoServicio.value.descripcion)
    formData.append('costo', nuevoServicio.value.costo)
    formData.append('categoria', nuevoServicio.value.categoria)
    formData.append('imagen', nuevoServicio.value.imagen)

    const token = obtenerToken()
    const response = await fetch('http://localhost:5000/api/servicios', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    if (!response.ok) throw new Error('Error al crear servicio')

    await fetchServices()
    resetForm()
    mostrarFormulario.value = false
  } catch (error) {
    console.error('Error al crear servicio:', error)
    error.value = error.message || 'Error al crear servicio'
  }
}

const updateService = async (servicio) => {
  try {
    if (!servicio.nombre || !servicio.descripcion || !servicio.costo) {
      error.value = 'Completa todos los campos para actualizar.'
      return
    }

    const formData = new FormData()
    formData.append('nombre', servicio.nombre)
    formData.append('descripcion', servicio.descripcion)
    formData.append('costo', servicio.costo)
    formData.append('categoria', servicio.categoria)
    if (servicio.imagen instanceof File) {
      formData.append('imagen', servicio.imagen)
    }

    const token = obtenerToken()
    const response = await fetch(`http://localhost:5000/api/servicios/${servicio._id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    if (!response.ok) throw new Error('Error al actualizar servicio')

    await fetchServices()
    modoEdicion.value = null
    error.value = ''
  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    error.value = error.message || 'Error al actualizar servicio'
  }
}

const deleteService = async (id) => {
  if (!confirm('¿Eliminar este servicio?')) return

  try {
    const token = obtenerToken()
    const response = await fetch(`http://localhost:5000/api/servicios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Error al eliminar servicio')

    await fetchServices()
  } catch (error) {
    console.error('Error:', error)
    error.value = 'Error al eliminar servicio'
  }
}

const handleImagen = (event) => {
  const file = event.target.files[0]
  if (file) {
    nuevoServicio.value.imagen = file
    imagenPreview.value = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  nuevoServicio.value = {
    nombre: '',
    descripcion: '',
    costo: '',
    categoria: 'pagina_web',
    imagen: null
  }
  imagenPreview.value = null
}

onMounted(fetchServices)
</script>

<template>
  <div class="space-y-6">
    <!-- Errores -->
    <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

    <!-- Tabla de servicios -->
    <div class="overflow-x-auto shadow-md rounded-lg">
      <table v-if="!cargando && servicios.length"
             class="w-full table-auto text-sm text-gray-800 dark:text-gray-100">
        <thead class="bg-violet-200 dark:bg-violet-700 text-violet-800 dark:text-white uppercase text-xs">
          <tr>
            <th class="p-3 text-left">Imagen</th>
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-left">Descripción</th>
            <th class="p-3 text-left">Costo</th>
            <th class="p-3 text-left">Categoría</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in serviciosPaginados" :key="servicio._id"
              class="border-b dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900 transition">
            <!-- Modo edición -->
            <template v-if="modoEdicion === servicio._id">
              <td class="p-2"><input type="file" @change="handleImagen" class="w-full px-2 py-1 border rounded" /></td>
              <td class="p-2"><input v-model="servicio.nombre" class="w-full px-2 py-1 border rounded" /></td>
              <td class="p-2"><textarea v-model="servicio.descripcion" class="w-full px-2 py-1 border rounded" /></td>
              <td class="p-2"><input v-model="servicio.costo" type="number" class="w-full px-2 py-1 border rounded" /></td>
              <td class="p-2">
                <select v-model="servicio.categoria" class="w-full px-2 py-1 border rounded">
                  <option v-for="cat in categorias" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                </select>
              </td>
              <td class="p-2 text-center">
                <button @click="updateService(servicio)" class="text-green-600 font-semibold mr-2">Guardar</button>
                <button @click="modoEdicion = null" class="text-gray-600 font-semibold">Cancelar</button>
              </td>
            </template>

            <!-- Modo normal -->
            <template v-else>
              <td class="p-2"><img :src="'http://localhost:5000' + servicio.imagen" class="w-16 h-16 object-cover rounded" /></td>
              <td class="p-2">{{ servicio.nombre }}</td>
              <td class="p-2">{{ servicio.descripcion }}</td>
              <td class="p-2">${{ servicio.costo }}</td>
              <td class="p-2 capitalize">{{ categorias.find(c => c.value === servicio.categoria)?.label }}</td>
              <td class="p-2 text-center">
                <button @click="modoEdicion = servicio._id" class="text-blue-600 font-semibold mr-2">Editar</button>
                <button @click="deleteService(servicio._id)" class="text-red-600 font-semibold">Eliminar</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <div v-else-if="!cargando && !servicios.length"
           class="text-center text-gray-500 dark:text-gray-400 py-12">
        No hay servicios registrados.
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="mt-4 flex justify-center gap-2">
      <button @click="paginaActual--" :disabled="paginaActual === 1"
        class="px-3 py-1 rounded bg-violet-600 text-white disabled:opacity-40">Anterior</button>
      <span class="text-white">{{ paginaActual }} / {{ totalPaginas }}</span>
      <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
        class="px-3 py-1 rounded bg-violet-600 text-white disabled:opacity-40">Siguiente</button>
    </div>

    <!-- Botón "Crear Servicio" -->
    <div v-if="!mostrarFormulario" class="flex justify-center mt-6">
      <button @click="mostrarFormulario = true"
              class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow">
        Crear Servicio
      </button>
    </div>

    <!-- Formulario -->
    <div v-else class="bg-white/90 dark:bg-gray-900 p-6 rounded-lg shadow-xl">
      <h3 class="text-2xl font-semibold text-violet-700 dark:text-violet-300 mb-4">
        Crear nuevo servicio
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-4">
          <input v-model="nuevoServicio.nombre" placeholder="Nombre"
                 class="w-full p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white" />
          <textarea v-model="nuevoServicio.descripcion" placeholder="Descripción"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white"></textarea>
          <input v-model="nuevoServicio.costo" type="number" placeholder="Costo"
                 class="w-full p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white" />
          <select v-model="nuevoServicio.categoria"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white">
            <option v-for="cat in categorias" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
          </select>
        </div>
        <div class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input type="file" @change="handleImagen" accept="image/*" class="hidden" id="imagen-input" />
            <label for="imagen-input" class="cursor-pointer text-violet-600 hover:text-violet-800">
              {{ imagenPreview ? 'Cambiar imagen' : 'Seleccionar imagen' }}
            </label>
            <img v-if="imagenPreview" :src="imagenPreview" class="mt-2 mx-auto max-h-48 rounded" />
          </div>
          <button @click="createService"
                  class="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded">
            Crear Servicio
          </button>
          <button @click="mostrarFormulario = false"
                  class="w-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
