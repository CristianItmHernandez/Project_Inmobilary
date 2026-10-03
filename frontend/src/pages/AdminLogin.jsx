import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/admin/panel');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Acceso administrador</h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button className="w-full bg-blue-700 text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}