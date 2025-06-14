<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import PortfolioSection from '@/components/home/PortfolioSection.vue'
import ConsultationForm from '@/components/home/ConsultationForm.vue'
import EventsSection from '@/components/home/EventsSection.vue'
import { ref, computed } from 'vue'
import { obtenerUsuario } from '@/utils/auth'

const usuario = computed(() => obtenerUsuario())
</script>


<template>
  <Header />
  <main class="mt-10">
    <HeroSection />
    <PortfolioSection />
    <ConsultationForm />
    <EventsSection />
  </main>
  <Footer />
</template>
