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
  cartState.count = cartState.items.reduce((acc, item) => acc + item.cantidad, 0)
  cartState.total = cartState.items.reduce((acc, item) => acc + item.precioTotal * item.cantidad, 0)
}

const fetchCartData = async () => {
  cartState.loading = true
  cartState.error = null
  try {
    const token = obtenerToken()
    if (!token) {
      cartState.items = []
      calculateTotals()
      cartState.loading = false
      return
    }
    const response = await fetch('http://localhost:5000/api/carrito', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Error al obtener el carrito')
    const data = await response.json()
    cartState.items = data && data.items ? data.items : []
    calculateTotals()
  } catch (error) {
    console.error('Error:', error)
    cartState.error = 'Error al cargar el carrito.'
    cartState.items = []
    calculateTotals()
  } finally {
    cartState.loading = false
  }
}

const updateCartItem = async (servicioId, cantidad) => {
  try {
    const token = obtenerToken()
    if (!token) return
    
    const response = await fetch(
      `http://localhost:5000/api/carrito/${servicioId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad })
      }
    )
    if (!response.ok) throw new Error('Error al actualizar el carrito')
    await fetchCartData()
  } catch (error) {
    console.error('Error:', error)
  }
}

const removeCartItem = async (servicioId) => {
  try {
    const token = obtenerToken()
    if (!token) return
    
    const response = await fetch(`http://localhost:5000/api/carrito/${servicioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Error al eliminar del carrito')
    await fetchCartData()
  } catch (error) {
    console.error('Error:', error)
  }
}

export { cartState, fetchCartData, updateCartItem, removeCartItem } 