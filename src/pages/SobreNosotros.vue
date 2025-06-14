<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import TeamSection from '@/components/sobreNosotros/TeamSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CallToAction from '@/components/sobreNosotros/CallToAction.vue'
import Historia from '@/components/sobreNosotros/historia.vue'
</script>


<template>
  <Header />
  <main class="mt-10">
    
    <HeroSection />

    <!-- Nuestra Historia -->
    <Historia />

    <!-- Equipo -->
    <TeamSection />

    <!-- CTA -->
    <CallToAction />
  </main>
  <Footer />
</template>
