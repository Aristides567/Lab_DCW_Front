<script setup>
import equipoImg from '@/assets/img/kaxuUO1.png'
</script>

<template>
  <section id="nosotros" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl text-center text-violet-600 mb-12 font-bold">Nuestra Historia</h2>
      <p class="text-center text-gray-700 mb-12">
        Novaweb Designers nació con la misión de ayudar a empresas y emprendedores a destacar en el mundo digital.
        Con más de 10 años de experiencia en diseño y desarrollo web, hemos trabajado con clientes de todo el mundo para construir soluciones innovadoras.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img :src="equipoImg" alt="Nuestro Equipo" class="rounded-lg shadow-lg w-full" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-3xl font-bold text-violet-600 mb-4">Nuestra Visión</h3>
          <p class="text-gray-700">
            Nos esforzamos por ser un referente en la industria digital, brindando soluciones creativas e innovadoras que permitan a nuestros clientes sobresalir en un mercado competitivo.
          </p>
          <h3 class="text-3xl font-bold text-violet-600 mt-6 mb-4">Nuestros Valores</h3>
          <ul class="list-disc text-gray-700 pl-5">
            <li>Innovación y creatividad en cada proyecto.</li>
            <li>Compromiso con la calidad y la excelencia.</li>
            <li>Transparencia y comunicación efectiva con nuestros clientes.</li>
            <li>Trabajo en equipo y mejora continua.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>


