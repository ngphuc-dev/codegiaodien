const API = ''; // same origin
const views = {
  nguoidung: {
    title: 'Người dùng',
    endpoint: '/api/nguoidung',
    id: 'ma_nguoidung',
    columns: [
      { key: 'ma_nguoidung', label: 'Mã' },
      { key: 'ten_dangnhap', label: 'Tên đăng nhập' },
      { key: 'ho_ten', label: 'Họ tên' },
      { key: 'so_dien_thoai', label: 'SĐT' },
      { key: 'vai_tro', label: 'Vai trò' },
    ],
    fields: [
      { name: 'ten_dangnhap', label: 'Tên đăng nhập', type: 'text', required: true },
      { name: 'mat_khau', label: 'Mật khẩu', type: 'text', required: true },
      { name: 'ho_ten', label: 'Họ tên', type: 'text', required: true },
      { name: 'so_dien_thoai', label: 'Số điện thoại', type: 'text' },
      { name: 'vai_tro', label: 'Vai trò', type: 'select', options: ['quan_tri','tho_sua','khach_hang'], required: true },
    ]
  },
  danhmucthietbi: {
    title: 'Danh mục thiết bị',
    endpoint: '/api/danhmucthietbi',
    id: 'ma_danhmuc',
    columns: [
      { key: 'ma_danhmuc', label: 'Mã' },
      { key: 'ten_danhmuc', label: 'Tên danh mục' },
      { key: 'mo_ta', label: 'Mô tả' },
    ],
    fields: [
      { name: 'ten_danhmuc', label: 'Tên danh mục', type: 'text', required: true },
      { name: 'mo_ta', label: 'Mô tả', type: 'textarea' },
    ]
  },
  phieusuachua: {
    title: 'Phiếu sửa chữa',
    endpoint: '/api/phieusuachua',
    id: 'ma_phieu',
    columns: [
      { key: 'ma_phieu', label: 'Mã phiếu' },
      { key: 'ten_khachhang', label: 'Khách hàng' },
      { key: 'ten_thietbi', label: 'Thiết bị' },
      { key: 'ten_danhmuc', label: 'Danh mục' },
      { key: 'trang_thai', label: 'Trạng thái' },
      { key: 'dia_chi_sua', label: 'Địa chỉ' },
    ],
    fields: [
      { name: 'ma_khachhang', label: 'Mã khách hàng', type: 'number', required: true },
      { name: 'ma_thosua', label: 'Mã thợ sửa (để trống nếu chưa gán)', type: 'number' },
      { name: 'ma_danhmuc', label: 'Mã danh mục', type: 'number', required: true },
      { name: 'ten_thietbi', label: 'Tên thiết bị', type: 'text', required: true },
      { name: 'mo_ta_loi', label: 'Mô tả lỗi', type: 'textarea' },
      { name: 'dia_chi_sua', label: 'Địa chỉ sửa', type: 'text' },
      { name: 'trang_thai', label: 'Trạng thái', type: 'select', options: ['cho_xu_ly','dang_xu_ly','hoan_thanh'], required: true },
    ]
  },
  hoadon: {
    title: 'Hóa đơn',
    endpoint: '/api/hoadon',
    id: 'ma_hoadon',
    columns: [
      { key: 'ma_hoadon', label: 'Mã HĐ' },
      { key: 'ma_phieu', label: 'Mã phiếu' },
      { key: 'ten_thietbi', label: 'Thiết bị' },
      { key: 'tong_tien', label: 'Tổng tiền' },
      { key: 'phuong_thuc_tt', label: 'PT thanh toán' },
      { key: 'trang_thai_tt', label: 'Trạng thái TT' },
    ],
    fields: [
      { name: 'ma_phieu', label: 'Mã phiếu', type: 'number', required: true },
      { name: 'tong_tien', label: 'Tổng tiền', type: 'number', required: true },
      { name: 'phuong_thuc_tt', label: 'Phương thức TT', type: 'text' },
      { name: 'trang_thai_tt', label: 'Trạng thái TT', type: 'select', options: ['chua_tra','da_tra'], required: true },
    ]
  },
  thanhviennhom: {
    title: 'Thành viên nhóm',
    endpoint: '/api/thanhviennhom',
    id: 'id',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'ma_sinh_vien', label: 'Mã SV' },
      { key: 'ho_ten', label: 'Họ tên' },
      { key: 'vai_tro_trong_nhom', label: 'Vai trò' },
      { key: 'ten_de_tai', label: 'Đề tài' },
    ],
    fields: [
      { name: 'ma_sinh_vien', label: 'Mã sinh viên', type: 'text', required: true },
      { name: 'ho_ten', label: 'Họ tên', type: 'text', required: true },
      { name: 'vai_tro_trong_nhom', label: 'Vai trò trong nhóm', type: 'text' },
      { name: 'ten_de_tai', label: 'Tên đề tài', type: 'text' },
    ]
  }
};

let currentView = 'nguoidung';
let editingId = null;

const titleEl = document.getElementById('title');
const tableWrap = document.getElementById('tableWrap');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('form');
const statusEl = document.getElementById('status');

function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#9ca3af' : '#f87171';
}

async function checkHealth() {
  try {
    const r = await fetch('/health');
    const d = await r.json();
    setStatus(d.status === 'ok' ? 'DB: connected' : 'DB: error', d.status === 'ok');
  } catch {
    setStatus('Server không phản hồi', false);
  }
}

function renderTable(data) {
  const v = views[currentView];
  if (!data.length) {
    tableWrap.innerHTML = '<div class="empty">Chưa có dữ liệu</div>';
    return;
  }
  let html = '<table><thead><tr>';
  v.columns.forEach(c => html += `<th>${c.label}</th>`);
  html += '<th>Hành động</th></tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    v.columns.forEach(c => {
      let val = row[c.key];
      if (val === null || val === undefined) val = '';
      html += `<td>${escapeHtml(String(val))}</td>`;
    });
    html += `<td class="actions">
      <button class="btn" onclick="editItem(${JSON.stringify(row[v.id])})">Sửa</button>
      <button class="btn danger" onclick="deleteItem(${JSON.stringify(row[v.id])})">Xóa</button>
    </td></tr>`;
  });
  html += '</tbody></table>';
  tableWrap.innerHTML = html;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function load() {
  const v = views[currentView];
  titleEl.textContent = v.title;
  tableWrap.innerHTML = '<div class="empty">Đang tải...</div>';
  try {
    const r = await fetch(v.endpoint);
    const data = await r.json();
    renderTable(data);
  } catch (e) {
    tableWrap.innerHTML = '<div class="empty">Lỗi tải dữ liệu</div>';
  }
}

function buildForm(item = null) {
  const v = views[currentView];
  editingId = item ? item[v.id] : null;
  modalTitle.textContent = item ? 'Sửa' : 'Thêm mới';
  let html = '';
  v.fields.forEach(f => {
    const val = item ? (item[f.name] ?? '') : '';
    html += `<div class="form-group"><label>${f.label}</label>`;
    if (f.type === 'select') {
      html += `<select name="${f.name}" ${f.required?'required':''}>`;
      html += `<option value="">-- chọn --</option>`;
      f.options.forEach(o => {
        html += `<option value="${o}" ${val==o?'selected':''}>${o}</option>`;
      });
      html += `</select>`;
    } else if (f.type === 'textarea') {
      html += `<textarea name="${f.name}" ${f.required?'required':''}>${escapeHtml(String(val))}</textarea>`;
    } else {
      html += `<input type="${f.type}" name="${f.name}" value="${escapeHtml(String(val))}" ${f.required?'required':''} />`;
    }
    html += `</div>`;
  });
  form.innerHTML = html;
  modal.classList.remove('hidden');
}

function closeModal() { modal.classList.add('hidden'); editingId = null; }

function gatherForm() {
  const v = views[currentView];
  const data = {};
  v.fields.forEach(f => {
    const el = form.querySelector(`[name="${f.name}"]`);
    let val = el.value;
    if (f.type === 'number') {
      val = val === '' ? null : Number(val);
    }
    if (val === '') val = null;
    data[f.name] = val;
  });
  return data;
}

async function save() {
  const v = views[currentView];
  const data = gatherForm();
  // remove nulls? keep null for optional like ma_thosua
  try {
    let r;
    if (editingId !== null) {
      r = await fetch(`${v.endpoint}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      r = await fetch(v.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    if (!r.ok) {
      const e = await r.json().catch(()=>({error:'Lỗi'}));
      alert(e.error || 'Lỗi lưu dữ liệu');
      return;
    }
    closeModal();
    load();
  } catch (e) {
    alert('Lỗi kết nối');
  }
}

async function editItem(id) {
  const v = views[currentView];
  try {
    const r = await fetch(`${v.endpoint}/${id}`);
    const item = await r.json();
    buildForm(item);
  } catch {
    alert('Không tải được dữ liệu');
  }
}

async function deleteItem(id) {
  const v = views[currentView];
  if (!confirm('Xóa mục này?')) return;
  try {
    const r = await fetch(`${v.endpoint}/${id}`, { method: 'DELETE' });
    if (!r.ok) { alert('Xóa thất bại'); return; }
    load();
  } catch {
    alert('Lỗi kết nối');
  }
}

// event wiring
document.getElementById('addBtn').addEventListener('click', () => buildForm(null));
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('saveBtn').addEventListener('click', save);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    load();
  });
});

// expose for inline onclick
window.editItem = editItem;
window.deleteItem = deleteItem;

checkHealth();
load();
setInterval(checkHealth, 10000);
