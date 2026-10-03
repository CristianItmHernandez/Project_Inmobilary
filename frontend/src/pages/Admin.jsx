import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminProperties,
  createProperty,
  updateProperty,
  toggleProperty,
  deletePropertyLogical
} from '../services/api';

const emptyProperty = {
  Title: '',
  Description: '',
  Price: '',
  City: '',
  Address: '',
  Rooms: '',
  Bathrooms: '',
  AreaM2: '',
  ImageUrl: '',
  WhatsappNumber: '',
  IsActive: true
};

export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyProperty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function loadProperties() {
    try {
      const data = await getAdminProperties();
      setProperties(data);
    } catch (err) {
      if (err.message === 'Sesión expirada') {
        navigate('/admin');
      } else {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function resetForm() {
    setForm(emptyProperty);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const property = {
        ...form,
        Price: Number(form.Price),
        Rooms: form.Rooms ? Number(form.Rooms) : null,
        Bathrooms: form.Bathrooms ? Number(form.Bathrooms) : null,
        AreaM2: form.AreaM2 ? Number(form.AreaM2) : null
      };

      if (editingId) {
        await updateProperty(editingId, property);
      } else {
        await createProperty(property);
      }

      resetForm();
      await loadProperties();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      await toggleProperty(id);
      await loadProperties();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePropertyLogical(id);
      await loadProperties();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(property) {
    setEditingId(property.Id);
    setForm({
      Title: property.Title,
      Description: property.Description || '',
      Price: property.Price,
      City: property.City || '',
      Address: property.Address || '',
      Rooms: property.Rooms || '',
      Bathrooms: property.Bathrooms || '',
      AreaM2: property.AreaM2 || '',
      ImageUrl: property.ImageUrl || '',
      WhatsappNumber: property.WhatsappNumber,
      IsActive: property.IsActive
    });
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel del administrador</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <section className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? 'Editar propiedad' : 'Agregar propiedad'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="Title"
            placeholder="Título"
            value={form.Title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="Price"
            type="number"
            placeholder="Precio"
            value={form.Price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="City"
            placeholder="Ciudad"
            value={form.City}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="Address"
            placeholder="Dirección"
            value={form.Address}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="Rooms"
            type="number"
            placeholder="Habitaciones"
            value={form.Rooms}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="Bathrooms"
            type="number"
            placeholder="Baños"
            value={form.Bathrooms}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="AreaM2"
            type="number"
            placeholder="Área m2"
            value={form.AreaM2}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="ImageUrl"
            placeholder="URL de imagen"
            value={form.ImageUrl}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="WhatsappNumber"
            placeholder="WhatsApp, ej: 573001234567"
            value={form.WhatsappNumber}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              name="IsActive"
              type="checkbox"
              checked={form.IsActive}
              onChange={handleChange}
            />
            Mostrar en la página
          </label>

          <textarea
            name="Description"
            placeholder="Descripción"
            value={form.Description}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
            rows={3}
          />

          <div className="md:col-span-2 flex gap-3">
            <button className="bg-blue-700 text-white px-4 py-2 rounded">
              {editingId ? 'Guardar cambios' : 'Crear propiedad'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Propiedades</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Título</th>
                <th className="p-2 border">Precio</th>
                <th className="p-2 border">Visible</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {properties.map(property => (
                <tr key={property.Id}>
                  <td className="p-2 border">{property.Title}</td>
                  <td className="p-2 border">
                    ${Number(property.Price).toLocaleString('es-CO')}
                  </td>
                  <td className="p-2 border">
                    {property.IsActive ? 'Sí' : 'No'}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleToggle(property.Id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      {property.IsActive ? 'Ocultar' : 'Mostrar'}
                    </button>

                    <button
                      onClick={() => handleDelete(property.Id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}