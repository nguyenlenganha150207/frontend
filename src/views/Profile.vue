<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="page-title spooky-title">👻 Trang Cá Nhân</h1>

      <div class="profile-layout">
        <!-- Sidebar -->
        <div class="profile-sidebar">
          <div class="user-card">
            <img :src="user.avatar" :alt="user.name" class="user-avatar" />
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
              <span class="member-since">Thành viên từ {{ user.joinDate }}</span>
            </div>
          </div>

          <nav class="profile-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="profile-content">
          <!-- Profile Info -->
          <div v-if="activeTab === 'profile'" class="tab-pane">
            <div class="content-header">
              <h2>Thông Tin Cá Nhân</h2>
              <button class="btn btn-outline" @click="editMode = !editMode">
                {{ editMode ? 'Hủy' : 'Chỉnh sửa' }}
              </button>
            </div>

            <form v-if="editMode" @submit.prevent="updateProfile" class="profile-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Họ và tên</label>
                  <input type="text" v-model="userForm.name" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="userForm.email" />
                </div>
                <div class="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" v-model="userForm.phone" />
                </div>
                <div class="form-group">
                  <label>Ngày sinh</label>
                  <input type="date" v-model="userForm.birthDate" />
                </div>
                <div class="form-group full-width">
                  <label>Địa chỉ</label>
                  <textarea v-model="userForm.address" rows="3"></textarea>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                <button type="button" class="btn btn-outline" @click="editMode = false">Hủy</button>
              </div>
            </form>

            <div v-else class="profile-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Họ và tên:</span>
                  <span class="info-value">{{ user.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ user.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Số điện thoại:</span>
                  <span class="info-value">{{ user.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Ngày sinh:</span>
                  <span class="info-value">{{ user.birthDate }}</span>
                </div>
                <div class="info-item full-width">
                  <span class="info-label">Địa chỉ:</span>
                  <span class="info-value">{{ user.address }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders -->
          <div v-if="activeTab === 'orders'" class="tab-pane">
            <div class="content-header">
              <h2>Lịch Sử Đơn Hàng</h2>
              <router-link to="/orders" class="btn btn-outline">Xem tất cả</router-link>
            </div>

            <div class="recent-orders">
              <div class="order-item" v-for="order in recentOrders" :key="order.id">
                <div class="order-header">
                  <span class="order-id">{{ order.id }}</span>
                  <span :class="['order-status', order.status]">{{ getStatusText(order.status) }}</span>
                </div>
                <div class="order-details">
                  <span>{{ order.date }}</span>
                  <span>{{ order.total }}</span>
                </div>
                <button class="btn btn-sm btn-outline" @click="viewOrder(order.id)">Xem chi tiết</button>
              </div>
            </div>
          </div>

          <!-- Wishlist -->
          <div v-if="activeTab === 'wishlist'" class="tab-pane">
            <div class="content-header">
              <h2>Danh Sách Yêu Thích</h2>
              <router-link to="/wishlist" class="btn btn-outline">Xem tất cả</router-link>
            </div>

            <div class="wishlist-grid">
              <div class="wishlist-item" v-for="item in wishlist" :key="item.id">
                <img :src="item.image" :alt="item.name" />
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <span class="item-price">{{ item.price }}</span>
                </div>
                <button class="remove-btn" @click="removeFromWishlist(item.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Pets Adopted -->
          <div v-if="activeTab === 'pets'" class="tab-pane">
            <div class="content-header">
              <h2>Thú Cưng Đã Nhận Nuôi</h2>
            </div>

            <div class="adopted-pets">
              <div class="pet-item" v-for="pet in adoptedPets" :key="pet.id">
                <img :src="pet.image" :alt="pet.name" />
                <div class="pet-info">
                  <h4>{{ pet.name }}</h4>
                  <span class="pet-breed">{{ pet.breed }}</span>
                  <span class="adopt-date">Nhận nuôi: {{ pet.adoptDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div v-if="activeTab === 'settings'" class="tab-pane">
            <div class="content-header">
              <h2>Cài Đặt Tài Khoản</h2>
            </div>

            <div class="settings-section">
              <h3>Đổi mật khẩu</h3>
              <form @submit.prevent="changePassword" class="password-form">
                <div class="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input type="password" v-model="passwordForm.current" required />
                </div>
                <div class="form-group">
                  <label>Mật khẩu mới</label>
                  <input type="password" v-model="passwordForm.new" required />
                </div>
                <div class="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input type="password" v-model="passwordForm.confirm" required />
                </div>
                <button type="submit" class="btn btn-primary">Đổi mật khẩu</button>
              </form>
            </div>

            <div class="settings-section">
              <h3>Thông báo</h3>
              <div class="notification-settings">
                <label class="setting-item">
                  <input type="checkbox" v-model="notifications.email" />
                  <span>Nhận email thông báo đơn hàng</span>
                </label>
                <label class="setting-item">
                  <input type="checkbox" v-model="notifications.sms" />
                  <span>Nhận SMS thông báo</span>
                </label>
                <label class="setting-item">
                  <input type="checkbox" v-model="notifications.promotion" />
                  <span>Nhận thông tin khuyến mãi</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('profile')
const editMode = ref(false)

const tabs = [
  { id: 'profile', label: 'Thông tin', icon: '👤' },
  { id: 'orders', label: 'Đơn hàng', icon: '📦' },
  { id: 'wishlist', label: 'Yêu thích', icon: '❤️' },
  { id: 'pets', label: 'Thú cưng', icon: '🐾' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
]

// Demo user data
const user = ref({
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901234567',
  birthDate: '1990-01-01',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: 'https://i.pravatar.cc/150?img=1',
  joinDate: 'Tháng 10, 2024'
})

const userForm = ref({
  name: user.value.name,
  email: user.value.email,
  phone: user.value.phone,
  birthDate: user.value.birthDate,
  address: user.value.address
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const notifications = ref({
  email: true,
  sms: false,
  promotion: true
})

const recentOrders = ref([
  { id: 'HD20241031001', status: 'delivered', date: '31/10/2024', total: '680.000đ' },
  { id: 'HD20241030002', status: 'shipping', date: '30/10/2024', total: '450.000đ' },
  { id: 'HD20241029003', status: 'processing', date: '29/10/2024', total: '320.000đ' }
])

const wishlist = ref([
  { id: 1, name: 'Áo choàng Dracula', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', price: '280.000đ' },
  { id: 2, name: 'Vòng cổ phát sáng', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200', price: '150.000đ' },
  { id: 3, name: 'Đồ chơi bí ngô', image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=200', price: '80.000đ' }
])

const adoptedPets = ref([
  { id: 1, name: 'Shadow', breed: 'Husky Siberian', image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200', adoptDate: '15/10/2024' },
  { id: 2, name: 'Luna', breed: 'Corgi', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', adoptDate: '01/09/2024' }
])

function getStatusText(status) {
  const statusMap = {
    pending: '⏳ Chờ xử lý',
    processing: '🔧 Đang xử lý',
    shipping: '🚚 Đang giao',
    delivered: '✅ Đã giao',
    cancelled: '❌ Đã hủy'
  }
  return statusMap[status] || status
}

function updateProfile() {
  // Update user data
  Object.assign(user.value, userForm.value)
  editMode.value = false
  alert('✅ Cập nhật thông tin thành công!')
}

function changePassword() {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }
  alert('✅ Đổi mật khẩu thành công!')
  passwordForm.value = { current: '', new: '', confirm: '' }
}

function viewOrder(orderId) {
  // Navigate to order detail
  console.log('View order:', orderId)
}

function removeFromWishlist(itemId) {
  const index = wishlist.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    wishlist.value.splice(index, 1)
    alert('Đã xóa khỏi danh sách yêu thích!')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 0 80px;
}

.page-title {
  font-family: 'Creepster', cursive;
  font-size: 2.5rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 40px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 25px;
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  border: 3px solid #6b21a8;
}

.user-info h3 {
  color: #f8f8f8;
  margin-bottom: 5px;
}

.user-info p {
  color: #888;
  margin-bottom: 10px;
}

.member-since {
  color: #a855f7;
  font-size: 0.9rem;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  padding: 15px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #888;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  border-color: #6b21a8;
  background: rgba(107, 33, 168, 0.1);
  color: #a855f7;
}

/* Main Content */
.profile-content {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.content-header h2 {
  color: #f97316;
  margin: 0;
}

/* Profile Form */
.profile-form .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  color: #a855f7;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 12px 15px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b21a8;
}

.form-actions {
  display: flex;
  gap: 15px;
}

/* Profile Info */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.info-item {
  padding: 20px;
  background: #0a0a0a;
  border-radius: 12px;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-label {
  color: #888;
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.info-value {
  color: #f8f8f8;
  font-weight: 500;
}

/* Orders */
.recent-orders {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #0a0a0a;
  border-radius: 12px;
}

.order-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-id {
  color: #a855f7;
  font-weight: 600;
}

.order-status {
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 10px;
  width: fit-content;
}

.order-status.pending { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.order-status.processing { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.order-status.shipping { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
.order-status.delivered { background: rgba(34, 197, 94, 0.2); color: #22c55e; }

.order-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #888;
  font-size: 0.9rem;
}

/* Wishlist */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.wishlist-item {
  position: relative;
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  padding: 15px;
}

.wishlist-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-info h4 {
  color: #f8f8f8;
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.item-price {
  color: #f97316;
  font-weight: 600;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Adopted Pets */
.adopted-pets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pet-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #0a0a0a;
  border-radius: 12px;
}

.pet-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.pet-info h4 {
  color: #f8f8f8;
  margin-bottom: 5px;
}

.pet-breed,
.adopt-date {
  display: block;
  color: #888;
  font-size: 0.85rem;
}

/* Settings */
.settings-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #2d2d2d;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  color: #a855f7;
  margin-bottom: 20px;
}

.password-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.setting-item input {
  width: 18px;
  height: 18px;
}

.setting-item span {
  color: #ccc;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-outline {
  background: transparent;
  border: 2px solid #6b21a8;
  color: #a855f7;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    order: 2;
  }

  .profile-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .form-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width,
  .info-item.full-width {
    grid-column: span 1;
  }

  .password-form {
    grid-template-columns: 1fr;
  }

  .order-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .wishlist-grid,
  .adopted-pets {
    grid-template-columns: 1fr;
  }
}
</style>
