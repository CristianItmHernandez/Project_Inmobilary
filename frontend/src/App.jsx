import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Inmobiliaria</Link>
        <Link to="/admin" className="bg-white text-blue-700 px-3 py-1 rounded">
          Administrador
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<Admin />} />
      </Routes>
    </div>
  );
}