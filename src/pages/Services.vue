<template>
  <div class="services-page">
    <ServicesList />
  </div>
</template>

<script>
import ServicesList from '../components/ServicesList.vue'

export default {
  name: 'ServicesPage',
  components: {
    ServicesList
  }
}
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style> 