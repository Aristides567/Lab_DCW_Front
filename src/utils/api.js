const API_URL = 'http://localhost:5000/api' // LOCAL, asegurado

// 🟢 Login de usuario
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return await res.json()
}

// 🟣 Registro: permite enviar rol y token opcional para crear admin
export async function register(nombre, email, password, rol = 'cliente', token = null) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ nombre, email, password, rol })
  })

  return await res.json()
}

// 🔵 Obtener lista de servicios (sin autenticación)
export async function getServicios() {
  const res = await fetch(`${API_URL}/productos`)
  return await res.json()
}
