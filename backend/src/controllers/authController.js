const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');
require('dotenv').config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', username)
      .query('SELECT Id, Username, PasswordHash FROM AdminUsers WHERE Username = @Username');

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.Id, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, username: user.Username });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const hash = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    await pool.request()
      .input('Username', username)
      .input('PasswordHash', hash)
      .query(`
        INSERT INTO AdminUsers (Username, PasswordHash)
        VALUES (@Username, @PasswordHash)
      `);

    res.status(201).json({ message: 'Administrador creado' });
  } catch (err) {
    if (err.number === 2627) {
      return res.status(409).json({ message: 'Ese usuario ya existe' });
    }

    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};