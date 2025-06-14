<script setup>
import { ref, onMounted, computed } from 'vue'
import { obtenerToken } from '@/utils/auth'

const tecnologias = ref([])
const mostrarFormulario = ref(false)
const tecnologiaEditando = ref(null)
const form = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'pagina_web',
  imagen: null
})

const categorias = [
  { value: 'pagina_web', label: 'Página Web' },
  { value: 'aplicacion', label: 'Aplicación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otros', label: 'Otros' }
]

const paginaActual = ref(1)
const porPagina = 5

const tecnologiasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return tecnologias.value.slice(inicio, inicio + porPagina)
})

const totalPaginas = computed(() => Math.ceil(tecnologias.value.length / porPagina))

const fetchTechnologies = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/tecnologias')
    if (!response.ok) throw new Error('Error al obtener tecnologías')
    const data = await response.json()
    tecnologias.value = data
    if (paginaActual.value > totalPaginas.value) {
      paginaActual.value = totalPaginas.value || 1
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const handleImageChange = (event) => {
  form.value.imagen = event.target.files[0]
}

const guardarTecnologia = async () => {
  try {
    if (!form.value.nombre || !form.value.descripcion || !form.value.precio || !form.value.categoria) return

    const formData = new FormData()
    formData.append('name', form.value.nombre)
    formData.append('description', form.value.descripcion)
    formData.append('price', form.value.precio)
    formData.append('categoria', form.value.categoria)
    if (form.value.imagen) {
      formData.append('image', form.value.imagen)
    }

    const token = obtenerToken()
    const url = tecnologiaEditando.value
      ? `http://localhost:5000/api/tecnologias/${tecnologiaEditando.value._id}`
      : 'http://localhost:5000/api/tecnologias'
    const method = tecnologiaEditando.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    if (!response.ok) throw new Error('Error al guardar tecnología')

    await fetchTechnologies()
    cerrarFormulario()
  } catch (error) {
    console.error('Error al guardar tecnología:', error)
  }
}

const editarTecnologia = (tech) => {
  tecnologiaEditando.value = tech
  form.value = {
    nombre: tech.name,
    descripcion: tech.description,
    precio: tech.price,
    categoria: tech.categoria || 'pagina_web',
    imagen: null
  }
  mostrarFormulario.value = true
}

const eliminarTecnologia = async (id) => {
  if (!confirm('¿Eliminar esta tecnología?')) return
  try {
    const token = obtenerToken()
    const response = await fetch(`http://localhost:5000/api/tecnologias/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Error al eliminar tecnología')
    await fetchTechnologies()
  } catch (error) {
    console.error('Error al eliminar tecnología:', error)
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  tecnologiaEditando.value = null
  form.value = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'pagina_web',
    imagen: null
  }
}

onMounted(fetchTechnologies)
</script>

<template>
  <div class="space-y-6">
    <!-- Lista -->
    <div class="bg-gray-900 rounded-lg shadow-lg p-6 text-white">
      <h3 class="text-2xl font-bold mb-4">Tecnologías Existentes</h3>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-violet-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Imagen</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="tech in tecnologiasPaginadas" :key="tech._id" class="hover:bg-violet-800 transition">
              <td class="px-6 py-4"><img :src="`http://localhost:5000${tech.image}`" class="h-12 w-12 object-cover rounded" /></td>
              <td class="px-6 py-4">{{ tech.name }}</td>
              <td class="px-6 py-4">{{ tech.description }}</td>
              <td class="px-6 py-4">${{ tech.price }}</td>
              <td class="px-6 py-4 capitalize">{{ categorias.find(c => c.value === tech.categoria)?.label || 'N/A' }}</td>
              <td class="px-6 py-4">
                <button @click="editarTecnologia(tech)" class="text-violet-300 hover:text-white mr-3">Editar</button>
                <button @click="eliminarTecnologia(tech._id)" class="text-red-400 hover:text-red-200">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Botón para agregar -->
    <div v-if="!mostrarFormulario" class="flex justify-center mt-10">
      <button @click="mostrarFormulario = true"
        class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow">
        Agregar Tecnología
      </button>
    </div>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto animate-fade-in">
      <h3 class="text-2xl font-semibold mb-4">
        {{ tecnologiaEditando ? 'Editar Tecnología' : 'Agregar Nueva Tecnología' }}
      </h3>

      <form @submit.prevent="guardarTecnologia" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Nombre</label>
          <input v-model="form.nombre" type="text" required
            class="mt-1 block w-full rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-violet-500 focus:border-violet-500">
        </div>

        <div>
          <label class="block text-sm font-medium">Descripción</label>
          <textarea v-model="form.descripcion" rows="3" required
            class="mt-1 block w-full rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-violet-500 focus:border-violet-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium">Precio</label>
          <input v-model="form.precio" type="number" required min="0" step="0.01"
            class="mt-1 block w-full rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-violet-500 focus:border-violet-500">
        </div>

        <div>
          <label class="block text-sm font-medium">Categoría</label>
          <select v-model="form.categoria" required
            class="mt-1 block w-full rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-violet-500 focus:border-violet-500">
            <option v-for="cat in categorias" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium">Imagen</label>
          <input type="file" @change="handleImageChange" accept="image/*"
            :required="!tecnologiaEditando"
            class="mt-1 block w-full text-white file:bg-violet-700 file:text-white file:rounded-md file:px-4 file:py-1" />
        </div>

        <div class="flex justify-end gap-4">
          <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded">
            {{ tecnologiaEditando ? 'Actualizar' : 'Agregar' }}
          </button>
          <button type="button" @click="cerrarFormulario"
            class="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
