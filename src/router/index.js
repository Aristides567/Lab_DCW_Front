import { createRouter, createWebHistory } from 'vue-router'

// Páginas públicas
import Home from '@/pages/Home.vue'
import Servicios from '@/pages/Servicios.vue'
import SobreNosotros from '@/pages/SobreNosotros.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import VerifyResetCode from '@/pages/VerifyResetCode.vue'
import Cart from '@/pages/cart/Cart.vue'
import EditarPerfil from '@/pages/EditarPerfil.vue'
import Orders from '@/pages/Orders.vue'
import Checkout from '@/pages/checkout/Checkout.vue'
import Confirmacion from '@/pages/checkout/Confirmacion.vue'

// Páginas protegidas
import AdminDashboard from '@/pages/AdminDashboard.vue'

// Función para obtener el token y el usuario desde localStorage
import { obtenerToken, obtenerUsuario } from '@/utils/auth'

const routes = [
  { path: '/', name: 'Inicio', component: Home },
  { path: '/servicios', name: 'Servicios', component: Servicios },
  { path: '/sobre-nosotros', name: 'SobreNosotros', component: SobreNosotros },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgotpassword', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/verify-code', name: 'VerifyResetCode', component: VerifyResetCode },
  { path: '/cart', name: 'Cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/mis-compras', name: 'Orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/admin_dashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/editar-perfil', name: 'EditarPerfil', component: EditarPerfil, meta: { requiresAuth: true } },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/confirmacion',
    name: 'confirmacion',
    component: Confirmacion,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const token = obtenerToken()
  const user = obtenerUsuario()
  const rutaAdmin = to.path.startsWith('/admin')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    return next('/login')
  }

  if (rutaAdmin && !token) {
    return next('/login')
  }

  if (rutaAdmin && user?.rol !== 'admin') {
    return next('/') // cliente no puede entrar al panel admin
  }

  next()
})

export default router
