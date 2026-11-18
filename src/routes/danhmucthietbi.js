// src/routes/danhmucthietbi.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM danhmucthietbi ORDER BY ma_danhmuc');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM danhmucthietbi WHERE ma_danhmuc = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { ten_danhmuc, mo_ta } = req.body;
    const [result] = await pool.query('INSERT INTO danhmucthietbi (ten_danhmuc, mo_ta) VALUES (?,?)', [ten_danhmuc, mo_ta]);
    res.status(201).json({ ma_danhmuc: result.insertId, message: 'Tạo danh mục thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { ten_danhmuc, mo_ta } = req.body;
    const [result] = await pool.query('UPDATE danhmucthietbi SET ten_danhmuc=?, mo_ta=? WHERE ma_danhmuc=?', [ten_danhmuc, mo_ta, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM danhmucthietbi WHERE ma_danhmuc = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
