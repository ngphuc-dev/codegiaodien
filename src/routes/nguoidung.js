// src/routes/nguoidung.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nguoidung ORDER BY ma_nguoidung');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nguoidung WHERE ma_nguoidung = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ten_dangnhap, mat_khau, ho_ten, so_dien_thoai, vai_tro } = req.body;
    const [result] = await pool.query(
      'INSERT INTO nguoidung (ten_dangnhap, mat_khau, ho_ten, so_dien_thoai, vai_tro) VALUES (?,?,?,?,?)',
      [ten_dangnhap, mat_khau, ho_ten, so_dien_thoai, vai_tro]
    );
    res.status(201).json({ ma_nguoidung: result.insertId, message: 'Tạo người dùng thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { ten_dangnhap, mat_khau, ho_ten, so_dien_thoai, vai_tro } = req.body;
    const [result] = await pool.query(
      'UPDATE nguoidung SET ten_dangnhap=?, mat_khau=?, ho_ten=?, so_dien_thoai=?, vai_tro=? WHERE ma_nguoidung=?',
      [ten_dangnhap, mat_khau, ho_ten, so_dien_thoai, vai_tro, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM nguoidung WHERE ma_nguoidung = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
