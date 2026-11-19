# QLSuaChua API

REST API (Express + MySQL2) cho database `qlsuachua`.

## Cấu trúc project

```
quyet/
├── db.sql                 # Script SQL tạo database qlsuachua và dữ liệu mẫu
├── package.json           # Khai báo dependency và scripts (npm start)
├── package-lock.json      # Khóa phiên bản dependency
├── .env.example           # Mẫu biến môi trường (copy thành .env)
├── .env                   # Biến môi trường thực tế (không commit)
├── README.md              # Tài liệu hướng dẫn
├── src/                   # Mã nguồn backend (Node.js/Express)
│   ├── server.js          # Entry point: khởi tạo Express, middleware, route, static UI
│   ├── db.js              # Pool kết nối MySQL (mysql2)
│   └── routes/            # Route REST API cho từng bảng
│       ├── nguoidung.js
│       ├── danhmucthietbi.js
│       ├── phieusuachua.js
│       ├── hoadon.js
│       └── thanhviennhom.js
└── public/                # Giao diện web (frontend tĩnh)
    ├── index.html         # Khung giao diện, sidebar, modal
    ├── style.css          # CSS giao diện
    └── app.js             # Logic gọi API, render bảng, CRUD
```

### Nhiệm vụ từng phần

- **db.sql**: Định nghĩa schema (bảng, khóa ngoại) và dữ liệu mẫu cho MySQL.
- **src/db.js**: Tạo connection pool dùng chung cho toàn bộ API.
- **src/routes/*.js**: Xử lý CRUD cho từng thực thể, trả JSON cho frontend.
- **src/server.js**: Ghép middleware (CORS, JSON, static), đăng ký route, lắng nghe port.
- **public/**: Giao diện người dùng, gọi API qua fetch và hiển thị dữ liệu.
- **.env / .env.example**: Cấu hình kết nối DB và port server.

## Yêu cầu

- Node.js (khuyến nghị LTS) đã cài đặt và thêm vào PATH.
Cài node js 
- MySQL đang chạy (XAMPP/WAMP/MySQL Installer). Trên Windows, cổng mặc định thường là `3306`.

## Cài đặt & chạy trên Windows

Mở **Command Prompt** hoặc **PowerShell**, sau đó:

```bat
cd C:\duong\dan\den\thu\muc\quyet
npm install
copy .env.example .env
npm start
```

Hoặc chạy bằng PowerShell:

```powershell
cd C:\duong\dan\den\thu\muc\quyet
npm install
Copy-Item .env.example .env
npm start
```

Mặc định server chạy tại http://localhost:3001 (đổi bằng biến môi trường `PORT`).

## Giao diện web (UI)

Sau khi chạy server, mở trình duyệt tại:

```
http://localhost:3001
```

Giao diện cho phép xem, thêm, sửa, xóa dữ liệu các bảng: Người dùng, Danh mục thiết bị, Phiếu sửa chữa, Hóa đơn, Thành viên nhóm.

> Nếu cổng 3000/3001 đang bị chiếm, đặt `PORT` khác trong file `.env`, ví dụ `PORT=5000`.

## Biến môi trường (.env)

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qlsc thietbi
```

- Trên **Windows với XAMPP**, cổng MySQL thường là `3306`. Nếu bạn dùng cổng khác (ví dụ XAMPP cấu hình `3307`), hãy sửa `DB_PORT` tương ứng.
- Nếu MySQL yêu cầu mật khẩu cho user `root`, điền vào `DB_PASSWORD`.

## Import database vào MySQL (Windows)

1. Mở **phpMyAdmin** (http://localhost/phpmyadmin) hoặc MySQL Workbench.
2. Chọn **Import** → chọn file `db.sql` → **Go**.
   - Hoặc dùng Command Prompt:
     ```bat
     mysql -u root -p < db.sql
     ```
3. Database `qlsc thietbi` sẽ được tạo kèm dữ liệu mẫu.

## Endpoint

| Method | URL  | Mô tả |
|---|---|---|
| GET | /health | Kiểm tra kết nối DB |
| GET | /api/nguoidung | Danh sách người dùng |
| GET | /api/nguoidung/:id | Chi tiết người dùng |
| POST | /api/nguoidung | Tạo người dùng |
| PUT | /api/nguoidung/:id | Cập nhật người dùng |
| DELETE | /api/nguoidung/:id | Xóa người dùng |
| GET | /api/danhmucthietbi | Danh sách danh mục |
| POST/PUT/DELETE | /api/danhmucthietbi/:id | CRUD danh mục |
| GET | /api/phieusuachua | Danh sách phiếu (kèm tên KH, thợ, danh mục) |
| POST/PUT/DELETE | /api/phieusuachua/:id | CRUD phiếu |
| GET | /api/hoadon | Danh sách hóa đơn |
| POST/PUT/DELETE | /api/hoadon/:id | CRUD hóa đơn |
| GET | /api/thanhviennhom | Danh sách thành viên nhóm |
| POST/PUT/DELETE | /api/thanhviennhom/:id | CRUD thành viên |

## Ví dụ gọi API (frontend)

```js
const res = await fetch('http://localhost:3001/api/nguoidung');
const users = await res.json();
```

## Dừng server

Nhấn `Ctrl + C` trong cửa sổ Command Prompt/PowerShell đang chạy server.
