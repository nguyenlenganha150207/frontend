<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title spooky-title">🛒 Giỏ Hàng Ma Quái</h1>

      <div class="cart-layout" v-if="cartStore.items.length > 0">
        <!-- Cart Items -->
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartStore.items" :key="`${item.id}-${item.type}`">
            <div class="item-image">
              <img :src="item.image || '/placeholder.jpg'" :alt="item.name" />
            </div>
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-type">{{ item.type === 'pet' ? '🐾 Thú Cưng' : '📦 Sản Phẩm' }}</p>
              <div class="item-price">
                <span class="current-price">{{ formatPrice(item.salePrice || item.price) }}</span>
                <span class="old-price" v-if="item.salePrice">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
            <div class="item-quantity">
              <button @click="decreaseQty(item)" :disabled="item.quantity <= 1">
                <i class="fas fa-minus"></i>
              </button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="item-total">
              {{ formatPrice((item.salePrice || item.price) * item.quantity) }}
            </div>
            <button class="remove-btn" @click="removeItem(item)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3>📋 Tổng Đơn Hàng</h3>
            
            <div class="summary-row">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(cartStore.totalPrice + cartStore.totalDiscount) }}</span>
            </div>
            
            <div class="summary-row discount" v-if="cartStore.totalDiscount > 0">
              <span>Giảm giá:</span>
              <span>-{{ formatPrice(cartStore.totalDiscount) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{{ shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí' }}</span>
            </div>

            <!-- Coupon -->
            <div class="coupon-section">
              <input 
                type="text" 
                v-model="couponCode" 
                placeholder="Nhập mã giảm giá..."
                class="coupon-input"
              />
              <button class="btn btn-outline" @click="applyCoupon">
                Áp dụng
              </button>
            </div>

            <div class="summary-total">
              <span>Tổng cộng:</span>
              <span class="total-price">{{ formatPrice(finalTotal) }}</span>
            </div>

            <router-link to="/checkout" class="btn btn-primary btn-full">
              <i class="fas fa-ghost"></i> Tiến Hành Thanh Toán
            </router-link>

            <router-link to="/products" class="btn btn-ghost btn-full mt-1">
              <i class="fas fa-arrow-left"></i> Tiếp Tục Mua Sắm
            </router-link>
          </div>

          <!-- Promotion Banner -->
          <div class="promo-banner">
            <span class="promo-icon">🎃</span>
            <div class="promo-text">
              <strong>Halloween Sale!</strong>
              <p>Giảm thêm 10% cho đơn từ 1 triệu</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div class="empty-cart" v-else>
        <div class="empty-icon">👻</div>
        <h2>Giỏ hàng trống!</h2>
        <p>Hãy thêm một vài sản phẩm ma quái vào giỏ hàng của bạn</p>
        <router-link to="/products" class="btn btn-primary">
          <i class="fas fa-shopping-bag"></i> Mua Sắm Ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const couponCode = ref('')
const couponDiscount = ref(0)

const shippingFee = computed(() => {
  return cartStore.totalPrice >= 500000 ? 0 : 30000
})

const finalTotal = computed(() => {
  return cartStore.totalPrice + shippingFee.value - couponDiscount.value
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function increaseQty(item) {
  cartStore.updateQuantity(item.id, item.quantity + 1, item.type)
}

function decreaseQty(item) {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1, item.type)
  }
}

function removeItem(item) {
  cartStore.removeItem(item.id, item.type)
}

function applyCoupon() {
  if (couponCode.value.toLowerCase() === 'halloween') {
    couponDiscount.value = cartStore.totalPrice * 0.1
    alert('Áp dụng mã giảm giá thành công!')
  } else {
    alert('Mã giảm giá không hợp lệ!')
  }
}
</script>

<style scoped>
.cart-page {
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

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  border-color: #6b21a8;
  box-shadow: 0 5px 20px rgba(107, 33, 168, 0.2);
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 5px;
}

.item-type {
  font-size: 0.85rem;
  color: #a855f7;
  margin-bottom: 10px;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f97316;
}

.old-price {
  font-size: 0.9rem;
  color: #666;
  text-decoration: line-through;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2d2d2d;
  border-radius: 10px;
  padding: 5px;
}

.item-quantity button {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #404040;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item-quantity button:hover:not(:disabled) {
  background: #6b21a8;
}

.item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.item-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  min-width: 150px;
  text-align: right;
}

.remove-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid #dc2626;
  border-radius: 10px;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

/* Cart Summary */
.cart-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 20px;
}

.summary-card h3 {
  font-size: 1.3rem;
  margin-bottom: 25px;
  color: white;
  padding-bottom: 15px;
  border-bottom: 1px solid #2d2d2d;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #b0b0b0;
}

.summary-row.discount span:last-child {
  color: #22c55e;
}

.coupon-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px dashed #2d2d2d;
  border-bottom: 1px dashed #2d2d2d;
}

.coupon-input {
  flex: 1;
  padding: 12px 15px;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0;
  padding-top: 20px;
  border-top: 2px solid #6b21a8;
}

.summary-total span:first-child {
  font-size: 1.1rem;
  color: white;
}

.total-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f97316;
  font-family: 'Creepster', cursive;
}

.btn-full {
  width: 100%;
}

.promo-banner {
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
  border: 1px solid #6b21a8;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.promo-icon {
  font-size: 2.5rem;
}

.promo-text strong {
  color: #f97316;
  display: block;
  margin-bottom: 5px;
}

.promo-text p {
  color: #b0b0b0;
  font-size: 0.9rem;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 8rem;
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.empty-cart h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #888;
  margin-bottom: 30px;
}

@media (max-width: 1200px) {
  .cart-layout {
    grid-template-columns: 1fr 320px;
  }
}

@media (max-width: 992px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 15px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-quantity,
  .item-total,
  .remove-btn {
    grid-column: 2;
  }
}
</style>
