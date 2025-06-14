// src/utils/auth.js

export function guardarSesion(token, usuario) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario)) // ← usamos "usuario" de forma consistente
}

export function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function obtenerToken() {
  return localStorage.getItem('token')
}

export function obtenerUsuario() {
  const raw = localStorage.getItem('usuario')
  return raw ? JSON.parse(raw) : null
}
