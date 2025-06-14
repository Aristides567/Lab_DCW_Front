<script setup>
//array de eventos
const eventos = [
  {
    fecha: "15",
    mes: "MAR",
    titulo: "Taller de Diseño UX/UI",
    descripcion: "Aprende los fundamentos del diseño de experiencia de usuario e interfaz.",
  },
  {
    fecha: "30",
    mes: "MAR",
    titulo: "Webinar sobre Tendencias Web",
    descripcion: "Descubre las últimas tendencias en diseño y desarrollo web para 2025.",
  },
  {
    fecha: "10",
    mes: "ABR",
    titulo: "Meetup de Innovación Digital",
    descripcion: "Conecta con otros profesionales y explora las últimas innovaciones en tecnología web.",
  },
];
</script>

<template>
  <section id="eventos" class="py-24 bg-gray-100 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h2 class="text-4xl text-violet-600 font-bold mb-12">Próximos Eventos</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(evento, index) in eventos" :key="index"
          class="bg-white rounded-lg shadow-md hover:shadow-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <div class="bg-violet-600 text-white text-center p-4 rounded-t-lg group-hover:bg-red-400 transition-colors">
            <div class="text-2xl font-bold">{{ evento.fecha }}</div>
            <div class="text-sm">{{ evento.mes }}</div>
          </div>
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 group-hover:text-violet-600">{{ evento.titulo }}</h3>
            <p class="text-gray-700">{{ evento.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
