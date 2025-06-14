<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ServicesSection from '@/components/servicios/ServicesSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CallToAction from '@/components/sobreNosotros/CallToAction.vue'
</script>


<template>
  <Header />
  <main class="mt-10">
    <!-- Hero -->
    <HeroSection />

    <!-- Servicios -->
    <ServicesSection />

    <!-- Call to Action -->
    <CallToAction />
  </main>
  <Footer />
</template>
