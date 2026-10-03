export default function PropertyCard({ property }) {
  const {
    Title,
    Description,
    Price,
    City,
    ImageUrl,
    WhatsappNumber
  } = property;

  const message = encodeURIComponent(
    `Hola, vi la propiedad "${Title}" en la página web y quiero más información.`
  );

  const whatsappUrl = `https://wa.me/${WhatsappNumber}?text=${message}`;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {ImageUrl && (
        <img
          src={ImageUrl}
          alt={Title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      <h2 className="text-lg font-bold">{Title}</h2>
      <p className="text-gray-600 mb-1">{City}</p>
      <p className="text-blue-700 font-semibold mb-2">
        ${Number(Price).toLocaleString('es-CO')}
      </p>

      {Description && (
        <p className="text-sm text-gray-700 mb-3">{Description}</p>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-auto bg-green-600 text-white text-center px-4 py-2 rounded hover:bg-green-700"
      >
        Contactar por WhatsApp
      </a>
    </div>
  );
}