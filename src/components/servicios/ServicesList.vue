<template>
  <div class="services-container">
    <h2>Nuestros Servicios</h2>
    <div v-if="loading" class="loading">
      Cargando servicios...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="services-grid">
      <div v-for="service in services" :key="service._id" class="service-card">
        <img :src="service.imagen" :alt="service.nombre" class="service-image">
        <div class="service-info">
          <h3>{{ service.nombre }}</h3>
          <p>{{ service.descripcion }}</p>
          <p class="service-price">${{ service.costo }}</p>
          <span class="service-category">{{ service.categoria }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ServicesList',
  setup() {
    const services = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/servicios')
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor')
        }
        const data = await response.json()
        services.value = data
        loading.value = false
      } catch (err) {
        error.value = 'Error al cargar los servicios. Por favor, intente nuevamente.'
        loading.value = false
        console.error('Error fetching services:', err)
      }
    }

    onMounted(() => {
      fetchServices()
    })

    return {
      services,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.services-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.service-info {
  padding: 1rem;
}

.service-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.service-info p {
  color: #666;
  margin: 0.5rem 0;
}

.service-price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.service-category {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #495057;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
}
</style> 