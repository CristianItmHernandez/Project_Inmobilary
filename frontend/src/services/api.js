const API_URL = 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function getPublicProperties() {
  const res = await fetch(`${API_URL}/properties/public`);

  if (!res.ok) throw new Error('No se pudieron cargar las propiedades');

  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');

  localStorage.setItem('token', data.token);
  return data;
}

export async function getAdminProperties() {
  const res = await fetch(`${API_URL}/properties`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Sesión expirada');
  }

  if (!res.ok) throw new Error('No se pudieron cargar las propiedades');

  return res.json();
}

export async function createProperty(property) {
  const res = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(property)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Error al crear la propiedad');

  return data;
}

export async function updateProperty(id, property) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(property)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Error al actualizar la propiedad');

  return data;
}

export async function toggleProperty(id) {
  const res = await fetch(`${API_URL}/properties/${id}/toggle`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!res.ok) throw new Error('Error al cambiar la visibilidad');

  return res.json();
}

export async function deletePropertyLogical(id) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!res.ok) throw new Error('Error al ocultar la propiedad');

  return res.json();
}