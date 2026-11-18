// src/routes/thanhviennhom.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM thanhviennhom ORDER BY id');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM thanhviennhom WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { ma_sinh_vien, ho_ten, vai_tro_trong_nhom, ten_de_tai } = req.body;
    const [result] = await pool.query(
      'INSERT INTO thanhviennhom (ma_sinh_vien, ho_ten, vai_tro_trong_nhom, ten_de_tai) VALUES (?,?,?,?)',
      [ma_sinh_vien, ho_ten, vai_tro_trong_nhom, ten_de_tai]
    );
    res.status(201).json({ id: result.insertId, message: 'Tạo thành viên thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { ma_sinh_vien, ho_ten, vai_tro_trong_nhom, ten_de_tai } = req.body;
    const [result] = await pool.query(
      'UPDATE thanhviennhom SET ma_sinh_vien=?, ho_ten=?, vai_tro_trong_nhom=?, ten_de_tai=? WHERE id=?',
      [ma_sinh_vien, ho_ten, vai_tro_trong_nhom, ten_de_tai, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM thanhviennhom WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
