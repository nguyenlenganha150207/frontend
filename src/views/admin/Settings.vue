<template>
  <div class="admin-settings">
    <div class="settings-grid">
      <!-- General Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-store"></i> Thông tin cửa hàng</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Tên cửa hàng</label>
            <input type="text" v-model="settings.storeName" />
          </div>
          <div class="form-group">
            <label>Email liên hệ</label>
            <input type="email" v-model="settings.email" />
          </div>
          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="tel" v-model="settings.phone" />
          </div>
          <div class="form-group">
            <label>Địa chỉ</label>
            <textarea v-model="settings.address" rows="2"></textarea>
          </div>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Shipping Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-truck"></i> Cài đặt vận chuyển</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>Phí vận chuyển mặc định (VNĐ)</label>
            <input type="number" v-model="settings.shippingFee" />
          </div>
          <div class="form-group">
            <label>Miễn phí vận chuyển cho đơn từ (VNĐ)</label>
            <input type="number" v-model="settings.freeShippingThreshold" />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.enableCOD" />
              <span>Cho phép thanh toán khi nhận hàng (COD)</span>
            </label>
          </div>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-credit-card"></i> Cài đặt thanh toán</h3>
        </div>
        <div class="card-body">
          <div class="payment-methods">
            <div class="payment-method">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.payments.cod" />
                <span>💵 Thanh toán khi nhận hàng</span>
              </label>
            </div>
            <div class="payment-method">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.payments.banking" />
                <span>🏦 Chuyển khoản ngân hàng</span>
              </label>
            </div>
            <div class="payment-method">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.payments.momo" />
                <span>📱 Ví MoMo</span>
              </label>
            </div>
            <div class="payment-method">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.payments.vnpay" />
                <span>💳 VNPay</span>
              </label>
            </div>
          </div>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-bell"></i> Cài đặt thông báo</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.newOrder" />
              <span>Thông báo khi có đơn hàng mới</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.lowStock" />
              <span>Thông báo khi sản phẩm sắp hết hàng</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.newReview" />
              <span>Thông báo khi có đánh giá mới</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.newUser" />
              <span>Thông báo khi có người dùng mới</span>
            </label>
          </div>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Social Links -->
      <div class="settings-card">
        <div class="card-header">
          <h3><i class="fas fa-share-alt"></i> Mạng xã hội</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label><i class="fab fa-facebook" style="color: #1877f2;"></i> Facebook</label>
            <input type="url" v-model="settings.social.facebook" placeholder="https://facebook.com/..." />
          </div>
          <div class="form-group">
            <label><i class="fab fa-instagram" style="color: #e4405f;"></i> Instagram</label>
            <input type="url" v-model="settings.social.instagram" placeholder="https://instagram.com/..." />
          </div>
          <div class="form-group">
            <label><i class="fab fa-youtube" style="color: #ff0000;"></i> YouTube</label>
            <input type="url" v-model="settings.social.youtube" placeholder="https://youtube.com/..." />
          </div>
          <div class="form-group">
            <label><i class="fab fa-tiktok"></i> TikTok</label>
            <input type="url" v-model="settings.social.tiktok" placeholder="https://tiktok.com/..." />
          </div>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Maintenance Mode -->
      <div class="settings-card danger">
        <div class="card-header">
          <h3><i class="fas fa-tools"></i> Bảo trì hệ thống</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="checkbox-label warning">
              <input type="checkbox" v-model="settings.maintenanceMode" />
              <span>🚧 Bật chế độ bảo trì</span>
            </label>
            <p class="hint">Khi bật, khách hàng sẽ thấy trang thông báo bảo trì.</p>
          </div>
          <div class="form-group" v-if="settings.maintenanceMode">
            <label>Thông báo bảo trì</label>
            <textarea v-model="settings.maintenanceMessage" rows="3" placeholder="Hệ thống đang được bảo trì..."></textarea>
          </div>
          <button class="btn btn-danger" @click="saveSettings">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const settings = ref({
  storeName: 'Spooky Pet Store',
  email: 'contact@spookypetstore.com',
  phone: '0901234567',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  shippingFee: 30000,
  freeShippingThreshold: 500000,
  enableCOD: true,
  payments: {
    cod: true,
    banking: true,
    momo: true,
    vnpay: false
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    newReview: true,
    newUser: false
  },
  social: {
    facebook: 'https://facebook.com/spookypetstore',
    instagram: 'https://instagram.com/spookypetstore',
    youtube: '',
    tiktok: ''
  },
  maintenanceMode: false,
  maintenanceMessage: ''
})

function saveSettings() {
  // Save to API
  alert('Đã lưu cài đặt thành công!')
}
</script>

<style scoped>
.admin-settings {
  max-width: 1200px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.settings-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
}

.settings-card.danger {
  border-color: rgba(239, 68, 68, 0.3);
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid #2d2d2d;
}

.card-header h3 {
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header i {
  color: #a855f7;
}

.card-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  color: #888;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b21a8;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: white !important;
}

.checkbox-label input {
  width: 20px;
  height: 20px;
  accent-color: #6b21a8;
}

.checkbox-label.warning span {
  color: #f59e0b;
}

.hint {
  color: #666;
  font-size: 0.85rem;
  margin-top: 8px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-method {
  padding: 15px;
  background: #0f0f12;
  border-radius: 10px;
}

.btn-danger {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
