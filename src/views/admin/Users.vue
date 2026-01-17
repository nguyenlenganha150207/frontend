<template>
  <div class="admin-users">
    <!-- Header -->
    <div class="page-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm người dùng..." />
        </div>
        <select v-model="filterRole" class="filter-select">
          <option value="">Tất cả vai trò</option>
          <option value="USER">Khách hàng</option>
          <option value="ADMIN">Quản trị viên</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Đã khóa</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm người dùng
      </button>
    </div>

    <!-- Users Table -->
    <div class="table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" /></th>
            <th>Người dùng</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Đơn hàng</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
            <td>
              <div class="user-cell">
                <img :src="user.avatar" :alt="user.name" />
                <div>
                  <h4>{{ user.name }}</h4>
                  <p v-if="user.googleId">
                    <i class="fab fa-google" style="color: #ea4335;"></i> Google
                  </p>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || '-' }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng' }}
              </span>
            </td>
            <td>{{ user.totalOrders }}</td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status === 'active' ? 'Hoạt động' : 'Đã khóa' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit" @click="editUser(user)" title="Sửa">
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="action-btn" 
                  :class="user.status === 'active' ? 'ban' : 'unban'"
                  @click="toggleUserStatus(user)" 
                  :title="user.status === 'active' ? 'Khóa' : 'Mở khóa'"
                >
                  <i :class="user.status === 'active' ? 'fas fa-ban' : 'fas fa-check'"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <span class="page-info">Hiển thị 1-10 của {{ users.length }} người dùng</span>
        <div class="page-btns">
          <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới' }}</h3>
          <button class="close-btn" @click="showAddModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Họ tên *</label>
            <input type="text" v-model="form.name" placeholder="Nhập họ tên" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" v-model="form.email" placeholder="email@example.com" />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="tel" v-model="form.phone" placeholder="0901234567" />
            </div>
          </div>
          <div class="form-row" v-if="!editingUser">
            <div class="form-group">
              <label>Mật khẩu *</label>
              <input type="password" v-model="form.password" placeholder="Nhập mật khẩu" />
            </div>
            <div class="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input type="password" v-model="form.confirmPassword" placeholder="Nhập lại mật khẩu" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Vai trò</label>
              <select v-model="form.role">
                <option value="USER">Khách hàng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="form.status">
                <option value="active">Hoạt động</option>
                <option value="banned">Đã khóa</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal = false">Hủy</button>
          <button class="btn btn-primary" @click="saveUser">
            <i class="fas fa-save"></i> {{ editingUser ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const selectAll = ref(false)
const selectedUsers = ref([])
const showAddModal = ref(false)
const editingUser = ref(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
  status: 'active'
})

const users = ref([
  { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', phone: '0901234567', role: 'USER', status: 'active', totalOrders: 12, avatar: 'https://i.pravatar.cc/40?img=1', createdAt: '2025-10-15', googleId: null },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', role: 'USER', status: 'active', totalOrders: 8, avatar: 'https://i.pravatar.cc/40?img=2', createdAt: '2025-11-20', googleId: 'google123' },
  { id: 3, name: 'Admin User', email: 'admin@petstore.com', phone: '0923456789', role: 'ADMIN', status: 'active', totalOrders: 0, avatar: 'https://i.pravatar.cc/40?img=3', createdAt: '2025-01-01', googleId: null },
  { id: 4, name: 'Lê Văn C', email: 'c@email.com', phone: '0934567890', role: 'USER', status: 'banned', totalOrders: 3, avatar: 'https://i.pravatar.cc/40?img=4', createdAt: '2025-12-05', googleId: null },
  { id: 5, name: 'Phạm Thị D', email: 'd@gmail.com', phone: null, role: 'USER', status: 'active', totalOrders: 25, avatar: 'https://i.pravatar.cc/40?img=5', createdAt: '2025-09-18', googleId: 'google456' }
])

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRole = !filterRole.value || u.role === filterRole.value
    const matchStatus = !filterStatus.value || u.status === filterStatus.value
    return matchSearch && matchRole && matchStatus
  })
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function editUser(user) {
  editingUser.value = user
  form.value = { ...user, password: '', confirmPassword: '' }
  showAddModal.value = true
}

function toggleUserStatus(user) {
  user.status = user.status === 'active' ? 'banned' : 'active'
}

function saveUser() {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    users.value[index] = { ...users.value[index], ...form.value }
  } else {
    users.value.push({
      ...form.value,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/40?img=${users.value.length + 1}`,
      totalOrders: 0,
      createdAt: new Date().toISOString().split('T')[0]
    })
  }
  showAddModal.value = false
  resetForm()
}

function resetForm() {
  form.value = { name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'USER', status: 'active' }
  editingUser.value = null
}
</script>

<style scoped>
.admin-users {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-filter {
  display: flex;
  gap: 15px;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 350px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  padding: 12px 15px 12px 45px;
  color: white;
}

.filter-select {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
}

.table-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 15px 20px;
  text-align: left;
}

.admin-table th {
  background: #0f0f12;
  color: #888;
  font-weight: 500;
  border-bottom: 1px solid #2d2d2d;
}

.admin-table td {
  color: white;
  border-bottom: 1px solid #1d1d1d;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-cell img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.user-cell h4 {
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.user-cell p {
  color: #888;
  font-size: 0.8rem;
}

.role-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

.role-badge.user {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-badge.banned {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-btns {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.action-btn.edit { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.action-btn.ban { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.action-btn.unban { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.action-btn:hover { transform: scale(1.1); }

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #2d2d2d;
}

.page-info { color: #888; font-size: 0.9rem; }
.page-btns { display: flex; gap: 8px; }

.page-btn {
  min-width: 38px;
  height: 38px;
  background: #2d2d2d;
  border: none;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
}

.page-btn.active {
  background: linear-gradient(135deg, #6b21a8, #a855f7);
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #2d2d2d;
}

.modal-header h3 { color: white; }

.close-btn {
  background: #2d2d2d;
  border: none;
  color: #888;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
}

.modal-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  color: #888;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 25px;
  border-top: 1px solid #2d2d2d;
}
</style>
