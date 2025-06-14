<script setup>
import { ref } from 'vue'
import facebookIcon from '@/assets/icon/facebook.png'
import twitterIcon from '@/assets/icon/twitter.png'
import instagramIcon from '@/assets/icon/instagram.png'
import linkedinIcon from '@/assets/icon/linkeding.png' // Asegúrate que el archivo exista

// Redes sociales
const redesSociales = [
  { nombre: 'Facebook', icono: facebookIcon, url: 'https://facebook.com' },
  { nombre: 'Twitter', icono: twitterIcon, url: 'https://twitter.com' },
  { nombre: 'Instagram', icono: instagramIcon, url: 'https://instagram.com' },
  { nombre: 'LinkedIn', icono: linkedinIcon, url: 'https://linkedin.com' }
]

// Newsletter
const emailNewsletter = ref('')
const estaSuscrito = ref(false)
const textoBoton = ref('Suscribete')
const errorEmail = ref('')

// Validación de email con regex
const esEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const manejarSuscripcion = () => {
  errorEmail.value = ''

  if (!emailNewsletter.value.trim()) {
    errorEmail.value = 'El correo es obligatorio.'
    return
  }

  if (!esEmailValido(emailNewsletter.value)) {
    errorEmail.value = 'El formato del correo no es válido.'
    return
  }

  estaSuscrito.value = true
  textoBoton.value = '¡Gracias por suscribirte!'
  alert(`¡Gracias por suscribirte, ${emailNewsletter.value}}!`)
  emailNewsletter.value = ''

  setTimeout(() => {
    estaSuscrito.value = false
    textoBoton.value = 'Suscribete'
  }, 5000)
}
</script>

<template>
  <footer class="bg-gradient-to-r from-zinc-800 to-zinc-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Información de contacto -->
        <div>
          <h3 class="text-xl mb-4">Contacto</h3>
          <p class="mb-2">Calle Principal, San Miguel</p>
          <p class="mb-2">+503 1234-5678</p>
          <p class="mb-2">contacto@novawebdesigners.com</p>
        </div>

        <!-- Redes sociales dinámicas -->
        <div>
          <h3 class="text-xl mb-4">Síguenos</h3>
          <ul class="flex space-x-4">
            <li v-for="(red, i) in redesSociales" v-bind:key="i">
              <a v-bind:href="red.url" target="_blank">
                <img v-bind:src="red.icono" v-bind:alt="red.nombre" v-bind:class="'w-6 h-6'" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-xl mb-4">Newsletter</h3>
          <form v-on:submit.prevent="manejarSuscripcion" class="flex flex-col w-full">
            <div class="flex w-full">
              <input
                v-model="emailNewsletter"
                type="email"
                placeholder="Tu email"
                required
                class="flex-grow p-2 rounded-l-lg focus:outline-none bg-white text-gray-700"
              />
              <button
                v-on:click="manejarSuscripcion"
                v-bind:disabled="estaSuscrito"
                type="submit"
                v-bind:class="estaSuscrito ? 'bg-green-500 hover:bg-green-400 px-4 rounded-r-lg transition-colors duration-300 flex-shrink-0' : 'bg-violet-600 hover:bg-red-400 px-4 rounded-r-lg transition-colors duration-300 flex-shrink-0'"
              >
                {{ textoBoton }}
              </button>
            </div>
            <p v-if="errorEmail" class="text-red-400 text-sm mt-2">{{ errorEmail }}</p>
          </form>
        </div>
      </div>

      <div class="text-center mt-8 pt-8 border-t border-white/10">
        <p>&copy; 2025 Novaweb Designers. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>
