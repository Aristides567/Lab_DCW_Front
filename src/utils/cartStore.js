import { reactive } from 'vue'
import { obtenerToken } from './auth'

const cartState = reactive({
  items: [],
  count: 0,
  total: 0,
  loading: false,
  error: null
})

const calculateTotals = () => {
  try {
    cartState.count = cartState.items.reduce((acc, item) => acc + (item?.cantidad || 0), 0)
    cartState.total = cartState.items.reduce((acc, item) => {
      const precioTotal = item?.precioTotal || 0
      const cantidad = item?.cantidad || 0
      return acc + (precioTotal * cantidad)
    }, 0)
  } catch (error) {
    console.error('Error al calcular totales:', error)
    cartState.count = 0
    cartState.total = 0
  }
}

const fetchCartData = async () => {
  cartState.loading = true
  cartState.error = null
  try {
    const token = obtenerToken()
    if (!token) {
      cartState.items = []
      calculateTotals()
      return
    }

    const response = await fetch('https://lab-dcw-back.onrender.com/api/carrito', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener el carrito')
    }

    const data = await response.json()
    cartState.items = data.items || []
    calculateTotals()
  } catch (error) {
    console.error('Error al cargar el carrito:', error)
    cartState.error = 'Error al cargar el carrito'
    cartState.items = []
    calculateTotals()
  } finally {
    cartState.loading = false
  }
}

const updateCartItem = async (servicioId, cantidad) => {
  if (!servicioId) return
  
  try {
    const token = obtenerToken()
    if (!token) return

    const response = await fetch('https://lab-dcw-back.onrender.com/api/carrito/actualizar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ servicioId, cantidad })
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el carrito')
    }

    await fetchCartData()
  } catch (error) {
    console.error('Error al actualizar el carrito:', error)
    cartState.error = 'Error al actualizar el carrito'
  }
}

const removeCartItem = async (servicioId) => {
  if (!servicioId) return
  
  try {
    const token = obtenerToken()
    if (!token) return

    const response = await fetch('https://lab-dcw-back.onrender.com/api/carrito/eliminar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ servicioId })
    })

    if (!response.ok) {
      throw new Error('Error al eliminar del carrito')
    }

    await fetchCartData()
  } catch (error) {
    console.error('Error al eliminar del carrito:', error)
    cartState.error = 'Error al eliminar del carrito'
  }
}

export { cartState, fetchCartData, updateCartItem, removeCartItem } 