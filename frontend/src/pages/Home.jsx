import { useEffect, useState } from 'react';
import { getPublicProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProperties()
      .then(setProperties)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Propiedades disponibles</h1>

      {loading && <p>Cargando propiedades...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>No hay propiedades disponibles por ahora.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.Id} property={property} />
        ))}
      </div>
    </main>
  );
}