// src/routes/phieusuachua.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, k.ho_ten AS ten_khachhang, t.ho_ten AS ten_thosua, d.ten_danhmuc
      FROM phieusuachua p
      LEFT JOIN nguoidung k ON p.ma_khachhang = k.ma_nguoidung
      LEFT JOIN nguoidung t ON p.ma_thosua = t.ma_nguoidung
      LEFT JOIN danhmucthietbi d ON p.ma_danhmuc = d.ma_danhmuc
      ORDER BY p.ma_phieu
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM phieusuachua WHERE ma_phieu = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { ma_khachhang, ma_thosua, ma_danhmuc, ten_thietbi, mo_ta_loi, dia_chi_sua, trang_thai } = req.body;
    const [result] = await pool.query(
      'INSERT INTO phieusuachua (ma_khachhang, ma_thosua, ma_danhmuc, ten_thietbi, mo_ta_loi, dia_chi_sua, trang_thai) VALUES (?,?,?,?,?,?,?)',
      [ma_khachhang, ma_thosua || null, ma_danhmuc, ten_thietbi, mo_ta_loi, dia_chi_sua, trang_thai || 'cho_xu_ly']
    );
    res.status(201).json({ ma_phieu: result.insertId, message: 'Tạo phiếu thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { ma_khachhang, ma_thosua, ma_danhmuc, ten_thietbi, mo_ta_loi, dia_chi_sua, trang_thai } = req.body;
    const [result] = await pool.query(
      'UPDATE phieusuachua SET ma_khachhang=?, ma_thosua=?, ma_danhmuc=?, ten_thietbi=?, mo_ta_loi=?, dia_chi_sua=?, trang_thai=? WHERE ma_phieu=?',
      [ma_khachhang, ma_thosua || null, ma_danhmuc, ten_thietbi, mo_ta_loi, dia_chi_sua, trang_thai, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM phieusuachua WHERE ma_phieu = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
