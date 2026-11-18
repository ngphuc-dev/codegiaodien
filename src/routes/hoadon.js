// src/routes/hoadon.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT h.*, p.ten_thietbi FROM hoadon h
      LEFT JOIN phieusuachua p ON h.ma_phieu = p.ma_phieu
      ORDER BY h.ma_hoadon
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hoadon WHERE ma_hoadon = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { ma_phieu, tong_tien, phuong_thuc_tt, trang_thai_tt } = req.body;
    const [result] = await pool.query(
      'INSERT INTO hoadon (ma_phieu, tong_tien, phuong_thuc_tt, trang_thai_tt) VALUES (?,?,?,?)',
      [ma_phieu, tong_tien, phuong_thuc_tt, trang_thai_tt || 'chua_tra']
    );
    res.status(201).json({ ma_hoadon: result.insertId, message: 'Tạo hóa đơn thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { ma_phieu, tong_tien, phuong_thuc_tt, trang_thai_tt } = req.body;
    const [result] = await pool.query(
      'UPDATE hoadon SET ma_phieu=?, tong_tien=?, phuong_thuc_tt=?, trang_thai_tt=? WHERE ma_hoadon=?',
      [ma_phieu, tong_tien, phuong_thuc_tt, trang_thai_tt, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM hoadon WHERE ma_hoadon = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
