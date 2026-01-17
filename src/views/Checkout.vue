<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title spooky-title">🎃 Thanh Toán Ma Quái</h1>

      <div class="checkout-layout">
        <!-- Form Section -->
        <div class="checkout-form">
          <!-- Shipping Information -->
          <div class="form-section">
            <h2 class="section-title">
              <i class="fas fa-map-marker-alt"></i> Thông Tin Giao Hàng
            </h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Họ và tên *</label>
                <input type="text" v-model="shippingInfo.fullName" placeholder="Nhập họ và tên" />
              </div>
              <div class="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" v-model="shippingInfo.phone" placeholder="Nhập số điện thoại" />
              </div>
              <div class="form-group full-width">
                <label>Email *</label>
                <input type="email" v-model="shippingInfo.email" placeholder="Nhập email" />
              </div>
              <div class="form-group">
                <label>Tỉnh/Thành phố *</label>
                <select v-model="shippingInfo.city">
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                  <option value="haiphong">Hải Phòng</option>
                  <option value="cantho">Cần Thơ</option>
                </select>
              </div>
              <div class="form-group">
                <label>Quận/Huyện *</label>
                <select v-model="shippingInfo.district">
                  <option value="">Chọn quận/huyện</option>
                  <option value="quan1">Quận 1</option>
                  <option value="quan2">Quận 2</option>
                  <option value="quan3">Quận 3</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Địa chỉ chi tiết *</label>
                <input type="text" v-model="shippingInfo.address" placeholder="Số nhà, tên đường..." />
              </div>
              <div class="form-group full-width">
                <label>Ghi chú đơn hàng</label>
                <textarea v-model="shippingInfo.note" placeholder="Ghi chú thêm cho đơn hàng..."></textarea>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-section">
            <h2 class="section-title">
              <i class="fas fa-credit-card"></i> Phương Thức Thanh Toán
            </h2>
            <div class="payment-methods">
              <label class="payment-option" :class="{ active: paymentMethod === 'cod' }">
                <input type="radio" v-model="paymentMethod" value="cod" />
                <div class="payment-content">
                  <span class="payment-icon">💰</span>
                  <div class="payment-info">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Thanh toán bằng tiền mặt khi nhận hàng</span>
                  </div>
                </div>
              </label>
              
              <label class="payment-option" :class="{ active: paymentMethod === 'banking' }">
                <input type="radio" v-model="paymentMethod" value="banking" />
                <div class="payment-content">
                  <span class="payment-icon">🏦</span>
                  <div class="payment-info">
                    <strong>Chuyển khoản ngân hàng</strong>
                    <span>Chuyển khoản qua tài khoản ngân hàng</span>
                  </div>
                </div>
              </label>

              <label class="payment-option" :class="{ active: paymentMethod === 'momo' }">
                <input type="radio" v-model="paymentMethod" value="momo" />
                <div class="payment-content">
                  <span class="payment-icon">📱</span>
                  <div class="payment-info">
                    <strong>Ví MoMo</strong>
                    <span>Thanh toán qua ví điện tử MoMo</span>
                  </div>
                </div>
              </label>

              <label class="payment-option" :class="{ active: paymentMethod === 'vnpay' }">
                <input type="radio" v-model="paymentMethod" value="vnpay" />
                <div class="payment-content">
                  <span class="payment-icon">💳</span>
                  <div class="payment-info">
                    <strong>VNPay</strong>
                    <span>Thanh toán qua cổng VNPay</span>
                  </div>
                </div>
              </label>
            </div>

            <!-- Banking Info -->
            <div class="banking-info" v-if="paymentMethod === 'banking'">
              <h4>🏦 Thông tin chuyển khoản:</h4>
              <div class="bank-details">
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Số tài khoản:</strong> 1234567890</p>
                <p><strong>Chủ tài khoản:</strong> HALLOWEEN PET STORE</p>
                <p><strong>Nội dung CK:</strong> [Mã đơn hàng] - [SĐT]</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-card">
            <h2 class="section-title">🛒 Đơn Hàng Của Bạn</h2>
            
            <!-- Cart Items -->
            <div class="order-items">
              <div class="order-item" v-for="item in cartItems" :key="item.id">
                <img :src="item.image || '/placeholder.jpg'" :alt="item.name" />
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <span class="item-qty">x{{ item.quantity }}</span>
                </div>
                <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <!-- Voucher -->
            <div class="voucher-section">
              <h4>🎟️ Mã Giảm Giá</h4>
              <div class="voucher-input">
                <input 
                  type="text" 
                  v-model="voucherCode" 
                  placeholder="Nhập mã voucher..."
                  :disabled="voucherApplied"
                />
                <button 
                  class="btn btn-outline" 
                  @click="applyVoucher"
                  :disabled="voucherApplied || !voucherCode"
                >
                  {{ voucherApplied ? 'Đã áp dụng' : 'Áp dụng' }}
                </button>
              </div>
              <div class="voucher-applied" v-if="voucherApplied">
                <span class="voucher-tag">
                  <i class="fas fa-tag"></i> {{ voucherCode }}
                  <button @click="removeVoucher"><i class="fas fa-times"></i></button>
                </span>
                <span class="voucher-discount">-{{ formatPrice(voucherDiscount) }}</span>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="price-summary">
              <div class="price-row">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="price-row" v-if="voucherDiscount > 0">
                <span>Giảm giá:</span>
                <span class="discount">-{{ formatPrice(voucherDiscount) }}</span>
              </div>
              <div class="price-row">
                <span>Phí vận chuyển:</span>
                <span>{{ shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí' }}</span>
              </div>
              <div class="price-row total">
                <span>Tổng cộng:</span>
                <span class="total-price">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <!-- Place Order Button -->
            <button class="btn btn-primary btn-full" @click="placeOrder" :disabled="isProcessing">
              <span v-if="isProcessing">
                <i class="fas fa-spinner fa-spin"></i> Đang xử lý...
              </span>
              <span v-else>
                <i class="fas fa-ghost"></i> Đặt Hàng Ngay
              </span>
            </button>

            <!-- Security Badge -->
            <div class="security-badge">
              <i class="fas fa-shield-alt"></i>
              <span>Thanh toán an toàn & bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { voucherAPI, ordersAPI } from '../api'

const router = useRouter()
const cartStore = useCartStore()

const shippingInfo = ref({
  fullName: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  address: '',
  note: ''
})

const paymentMethod = ref('cod')
const voucherCode = ref('')
const voucherApplied = ref(false)
const voucherDiscount = ref(0)
const isProcessing = ref(false)

// Demo cart items
const cartItems = computed(() => cartStore.items.length > 0 ? cartStore.items : [
  { id: 1, name: 'Thức ăn cho mèo Halloween', image: '/cat-food.jpg', price: 250000, quantity: 2 },
  { id: 2, name: 'Áo choàng Dracula cho chó', image: '/dog-costume.jpg', price: 180000, quantity: 1 }
])

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const shippingFee = computed(() => {
  return subtotal.value >= 500000 ? 0 : 30000
})

const totalPrice = computed(() => {
  return subtotal.value - voucherDiscount.value + shippingFee.value
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

async function applyVoucher() {
  try {
    // Call API to validate voucher
    // const response = await voucherAPI.validate(voucherCode.value)
    // Demo: hardcode voucher
    if (voucherCode.value.toUpperCase() === 'HALLOWEEN2024') {
      voucherDiscount.value = subtotal.value * 0.1
      voucherApplied.value = true
      alert('🎃 Áp dụng mã giảm giá thành công!')
    } else if (voucherCode.value.toUpperCase() === 'SPOOKY50') {
      voucherDiscount.value = 50000
      voucherApplied.value = true
      alert('👻 Áp dụng mã giảm giá thành công!')
    } else {
      alert('Mã giảm giá không hợp lệ!')
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi áp dụng mã giảm giá!')
  }
}

function removeVoucher() {
  voucherCode.value = ''
  voucherDiscount.value = 0
  voucherApplied.value = false
}

async function placeOrder() {
  // Validate form
  if (!shippingInfo.value.fullName || !shippingInfo.value.phone || !shippingInfo.value.address) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng!')
    return
  }

  isProcessing.value = true

  try {
    // Call API to create order
    const orderData = {
      shippingInfo: shippingInfo.value,
      paymentMethod: paymentMethod.value,
      items: cartItems.value,
      voucherCode: voucherApplied.value ? voucherCode.value : null,
      subtotal: subtotal.value,
      discount: voucherDiscount.value,
      shippingFee: shippingFee.value,
      total: totalPrice.value
    }

    // const response = await ordersAPI.create(orderData)
    // Demo success
    setTimeout(() => {
      isProcessing.value = false
      cartStore.clearCart()
      router.push({ name: 'OrderSuccess', params: { orderId: 'HD' + Date.now() } })
    }, 2000)

  } catch (error) {
    isProcessing.value = false
    alert('Có lỗi xảy ra khi đặt hàng!')
  }
}
</script>

<style scoped>
.checkout-page {
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

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 40px;
}

/* Form Section */
.form-section {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  color: #a855f7;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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
  font-weight: 500;
  color: #c084fc;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 18px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #f8f8f8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b21a8;
  box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.2);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  display: block;
  cursor: pointer;
}

.payment-option input {
  display: none;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #0a0a0a;
  border: 2px solid #2d2d2d;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.payment-option.active .payment-content,
.payment-content:hover {
  border-color: #6b21a8;
  background: rgba(107, 33, 168, 0.1);
}

.payment-icon {
  font-size: 2rem;
}

.payment-info {
  display: flex;
  flex-direction: column;
}

.payment-info strong {
  color: #f8f8f8;
}

.payment-info span {
  font-size: 0.9rem;
  color: #888;
}

.banking-info {
  margin-top: 20px;
  padding: 20px;
  background: rgba(107, 33, 168, 0.1);
  border: 1px dashed #6b21a8;
  border-radius: 12px;
}

.banking-info h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.bank-details p {
  margin: 8px 0;
  color: #ccc;
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 25px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #2d2d2d;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 0.95rem;
  color: #f8f8f8;
  margin-bottom: 5px;
}

.item-qty {
  font-size: 0.85rem;
  color: #888;
}

.item-price {
  font-weight: 600;
  color: #a855f7;
}

/* Voucher Section */
.voucher-section {
  padding: 20px 0;
  border-bottom: 1px solid #2d2d2d;
}

.voucher-section h4 {
  color: #f97316;
  margin-bottom: 15px;
}

.voucher-input {
  display: flex;
  gap: 10px;
}

.voucher-input input {
  flex: 1;
  padding: 12px 15px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
}

.voucher-input input:focus {
  outline: none;
  border-color: #6b21a8;
}

.voucher-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 10px 15px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
}

.voucher-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #22c55e;
  font-weight: 500;
}

.voucher-tag button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.voucher-discount {
  color: #22c55e;
  font-weight: 600;
}

/* Price Summary */
.price-summary {
  padding: 20px 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #ccc;
}

.price-row.total {
  border-top: 2px solid #2d2d2d;
  margin-top: 10px;
  padding-top: 20px;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f97316;
}

.discount {
  color: #22c55e;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(107, 33, 168, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 2px solid #6b21a8;
  color: #a855f7;
}

.btn-outline:hover:not(:disabled) {
  background: #6b21a8;
  color: white;
}

.btn-full {
  width: 100%;
}

/* Security Badge */
.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  color: #22c55e;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>
