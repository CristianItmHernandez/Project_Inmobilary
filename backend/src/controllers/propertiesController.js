const { poolPromise } = require('../config/db');

exports.getPublicProperties = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT Id, Title, Description, Price, City, Address,
             Rooms, Bathrooms, AreaM2, ImageUrl, WhatsappNumber
      FROM Properties
      WHERE IsActive = 1
      ORDER BY CreatedAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener propiedades', error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT *
      FROM Properties
      ORDER BY CreatedAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener propiedades', error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', req.params.id)
      .query('SELECT * FROM Properties WHERE Id = @Id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la propiedad', error: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const {
      title, description, price, city, address,
      rooms, bathrooms, areaM2, imageUrl, whatsappNumber, isActive
    } = req.body;

    if (!title || !price || !whatsappNumber) {
      return res.status(400).json({
        message: 'Título, precio y número de WhatsApp son obligatorios'
      });
    }

    const pool = await poolPromise;

    const result = await pool.request()
      .input('Title', title)
      .input('Description', description || null)
      .input('Price', price)
      .input('City', city || null)
      .input('Address', address || null)
      .input('Rooms', rooms || null)
      .input('Bathrooms', bathrooms || null)
      .input('AreaM2', areaM2 || null)
      .input('ImageUrl', imageUrl || null)
      .input('WhatsappNumber', whatsappNumber)
      .input('IsActive', isActive === false ? 0 : 1)
      .query(`
        INSERT INTO Properties
        (Title, Description, Price, City, Address, Rooms, Bathrooms, AreaM2, ImageUrl, WhatsappNumber, IsActive)
        OUTPUT INSERTED.Id
        VALUES
        (@Title, @Description, @Price, @City, @Address, @Rooms, @Bathrooms, @AreaM2, @ImageUrl, @WhatsappNumber, @IsActive)
      `);

    res.status(201).json({ id: result.recordset[0].Id });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la propiedad', error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const {
      title, description, price, city, address,
      rooms, bathrooms, areaM2, imageUrl, whatsappNumber, isActive
    } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', req.params.id)
      .input('Title', title)
      .input('Description', description || null)
      .input('Price', price)
      .input('City', city || null)
      .input('Address', address || null)
      .input('Rooms', rooms || null)
      .input('Bathrooms', bathrooms || null)
      .input('AreaM2', areaM2 || null)
      .input('ImageUrl', imageUrl || null)
      .input('WhatsappNumber', whatsappNumber)
      .input('IsActive', isActive === false ? 0 : 1)
      .query(`
        UPDATE Properties
        SET Title = @Title,
            Description = @Description,
            Price = @Price,
            City = @City,
            Address = @Address,
            Rooms = @Rooms,
            Bathrooms = @Bathrooms,
            AreaM2 = @AreaM2,
            ImageUrl = @ImageUrl,
            WhatsappNumber = @WhatsappNumber,
            IsActive = @IsActive,
            UpdatedAt = SYSDATETIME()
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json({ message: 'Propiedad actualizada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la propiedad', error: err.message });
  }
};

exports.toggleProperty = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', req.params.id)
      .query(`
        UPDATE Properties
        SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END,
            UpdatedAt = SYSDATETIME()
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json({ message: 'Visibilidad actualizada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar visibilidad', error: err.message });
  }
};

exports.deletePropertyLogical = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', req.params.id)
      .query(`
        UPDATE Properties
        SET IsActive = 0,
            UpdatedAt = SYSDATETIME()
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json({ message: 'Propiedad ocultada (borrado lógico)' });
  } catch (err) {
    res.status(500).json({ message: 'Error al ocultar la propiedad', error: err.message });
  }
};