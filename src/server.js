// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API qlsuachua đang chạy', endpoints: ['/api/nguoidung', '/api/danhmucthietbi', '/api/phieusuachua', '/api/hoadon', '/api/thanhviennhom'] });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.use('/api/nguoidung', require('./routes/nguoidung'));
app.use('/api/danhmucthietbi', require('./routes/danhmucthietbi'));
app.use('/api/phieusuachua', require('./routes/phieusuachua'));
app.use('/api/hoadon', require('./routes/hoadon'));
app.use('/api/thanhviennhom', require('./routes/thanhviennhom'));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
