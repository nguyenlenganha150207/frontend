<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title spooky-title">📜 Lịch Sử Đơn Hàng</h1>

      <!-- Order Stats -->
      <div class="order-stats">
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <div class="stat-info">
            <span class="stat-number">{{ orderStats.total }}</span>
            <span class="stat-label">Tổng đơn hàng</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏳</span>
          <div class="stat-info">
            <span class="stat-number">{{ orderStats.pending }}</span>
            <span class="stat-label">Chờ xử lý</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🚚</span>
          <div class="stat-info">
            <span class="stat-number">{{ orderStats.shipping }}</span>
            <span class="stat-label">Đang giao</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <div class="stat-info">
            <span class="stat-number">{{ orderStats.completed }}</span>
            <span class="stat-label">Hoàn thành</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-btn', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Orders List -->
      <div class="orders-list" v-if="filteredOrders.length > 0">
        <div class="order-card" v-for="order in filteredOrders" :key="order.id">
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div :class="['order-status', order.status]">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div class="order-item" v-for="item in order.items" :key="item.id">
              <img :src="item.image || '/placeholder.jpg'" :alt="item.name" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <span class="item-qty">Số lượng: {{ item.quantity }}</span>
              </div>
              <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <span>Tổng tiền:</span>
              <span class="total-price">{{ formatPrice(order.total) }}</span>
            </div>
            <div class="order-actions">
              <button class="btn btn-outline btn-sm" @click="viewOrderDetail(order.id)">
                <i class="fas fa-eye"></i> Chi tiết
              </button>
              <button 
                v-if="order.status === 'pending'" 
                class="btn btn-danger btn-sm"
                @click="cancelOrder(order.id)"
              >
                <i class="fas fa-times"></i> Hủy đơn
              </button>
              <button 
                v-if="order.status === 'delivered'" 
                class="btn btn-primary btn-sm"
                @click="reorder(order)"
              >
                <i class="fas fa-redo"></i> Mua lại
              </button>
              <button 
                v-if="order.status === 'delivered' && !order.reviewed" 
                class="btn btn-secondary btn-sm"
                @click="reviewOrder(order.id)"
              >
                <i class="fas fa-star"></i> Đánh giá
              </button>
            </div>
          </div>

          <!-- Order Timeline (for shipping orders) -->
          <div class="order-timeline" v-if="order.status === 'shipping' || order.status === 'processing'">
            <div class="timeline-item completed">
              <span class="timeline-icon">✓</span>
              <div class="timeline-content">
                <strong>Đơn hàng đã đặt</strong>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
            </div>
            <div class="timeline-item" :class="{ completed: order.status !== 'pending' }">
              <span class="timeline-icon">{{ order.status !== 'pending' ? '✓' : '○' }}</span>
              <div class="timeline-content">
                <strong>Đang xử lý</strong>
                <span>{{ order.processingAt ? formatDate(order.processingAt) : 'Đang chờ' }}</span>
              </div>
            </div>
            <div class="timeline-item" :class="{ completed: order.status === 'shipping' || order.status === 'delivered' }">
              <span class="timeline-icon">{{ order.status === 'shipping' || order.status === 'delivered' ? '✓' : '○' }}</span>
              <div class="timeline-content">
                <strong>Đang giao hàng</strong>
                <span>{{ order.shippingAt ? formatDate(order.shippingAt) : 'Đang chờ' }}</span>
              </div>
            </div>
            <div class="timeline-item" :class="{ completed: order.status === 'delivered' }">
              <span class="timeline-icon">{{ order.status === 'delivered' ? '✓' : '○' }}</span>
              <div class="timeline-content">
                <strong>Đã giao hàng</strong>
                <span>{{ order.deliveredAt ? formatDate(order.deliveredAt) : 'Đang chờ' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-icon">👻</div>
        <h2>Chưa có đơn hàng nào</h2>
        <p>Hãy mua sắm để có đơn hàng đầu tiên!</p>
        <router-link to="/products" class="btn btn-primary">
          <i class="fas fa-shopping-bag"></i> Mua Sắm Ngay
        </router-link>
      </div>

      <!-- Order Detail Modal -->
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-content">
          <button class="modal-close" @click="showModal = false">
            <i class="fas fa-times"></i>
          </button>
          <h2>📋 Chi Tiết Đơn Hàng</h2>
          <div class="modal-body" v-if="selectedOrder">
            <div class="detail-section">
              <h4>Thông tin đơn hàng</h4>
              <p><strong>Mã đơn:</strong> {{ selectedOrder.id }}</p>
              <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
              <p><strong>Trạng thái:</strong> {{ getStatusText(selectedOrder.status) }}</p>
              <p><strong>Phương thức TT:</strong> {{ selectedOrder.paymentMethod }}</p>
            </div>
            <div class="detail-section">
              <h4>Thông tin giao hàng</h4>
              <p><strong>Người nhận:</strong> {{ selectedOrder.shippingInfo?.fullName }}</p>
              <p><strong>SĐT:</strong> {{ selectedOrder.shippingInfo?.phone }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedOrder.shippingInfo?.address }}</p>
            </div>
            <div class="detail-section">
              <h4>Sản phẩm</h4>
              <div class="modal-items">
                <div class="modal-item" v-for="item in selectedOrder.items" :key="item.id">
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span>{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
              <div class="modal-total">
                <span>Tổng cộng:</span>
                <span>{{ formatPrice(selectedOrder.total) }}</span>
              </div>
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

const router = useRouter()
const cartStore = useCartStore()

const activeTab = ref('all')
const showModal = ref(false)
const selectedOrder = ref(null)

const tabs = [
  { label: 'Tất cả', value: 'all', icon: '📋' },
  { label: 'Chờ xử lý', value: 'pending', icon: '⏳' },
  { label: 'Đang xử lý', value: 'processing', icon: '🔧' },
  { label: 'Đang giao', value: 'shipping', icon: '🚚' },
  { label: 'Đã giao', value: 'delivered', icon: '✅' },
  { label: 'Đã hủy', value: 'cancelled', icon: '❌' }
]

// Demo orders data
const orders = ref([
  {
    id: 'HD20241031001',
    status: 'delivered',
    createdAt: '2024-10-31T10:30:00',
    deliveredAt: '2024-11-02T14:00:00',
    paymentMethod: 'COD',
    total: 680000,
    reviewed: false,
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      { id: 1, name: 'Áo choàng Dracula cho chó', image: '/dog-costume.jpg', price: 180000, quantity: 2 },
      { id: 2, name: 'Thức ăn Halloween cho mèo', image: '/cat-food.jpg', price: 250000, quantity: 1 }
    ]
  },
  {
    id: 'HD20241030002',
    status: 'shipping',
    createdAt: '2024-10-30T15:45:00',
    processingAt: '2024-10-30T18:00:00',
    shippingAt: '2024-10-31T09:00:00',
    paymentMethod: 'Banking',
    total: 450000,
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      { id: 3, name: 'Vòng cổ phát sáng', image: '/collar.jpg', price: 150000, quantity: 3 }
    ]
  },
  {
    id: 'HD20241029003',
    status: 'processing',
    createdAt: '2024-10-29T08:20:00',
    processingAt: '2024-10-29T10:00:00',
    paymentMethod: 'MoMo',
    total: 320000,
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      { id: 4, name: 'Đồ chơi bí ngô', image: '/pumpkin-toy.jpg', price: 80000, quantity: 4 }
    ]
  },
  {
    id: 'HD20241028004',
    status: 'pending',
    createdAt: '2024-10-28T20:15:00',
    paymentMethod: 'COD',
    total: 550000,
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      { id: 5, name: 'Giường ngủ hình quan tài', image: '/coffin-bed.jpg', price: 550000, quantity: 1 }
    ]
  },
  {
    id: 'HD20241025005',
    status: 'cancelled',
    createdAt: '2024-10-25T11:00:00',
    paymentMethod: 'VNPay',
    total: 200000,
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      { id: 6, name: 'Bát ăn hình đầu lâu', image: '/skull-bowl.jpg', price: 100000, quantity: 2 }
    ]
  }
])

const orderStats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 'pending').length,
  shipping: orders.value.filter(o => o.status === 'shipping').length,
  completed: orders.value.filter(o => o.status === 'delivered').length
}))

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeTab.value)
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

function viewOrderDetail(orderId) {
  selectedOrder.value = orders.value.find(o => o.id === orderId)
  showModal.value = true
}

function cancelOrder(orderId) {
  if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
      alert('Đã hủy đơn hàng thành công!')
    }
  }
}

function reorder(order) {
  order.items.forEach(item => {
    cartStore.addItem(item)
  })
  router.push('/cart')
}

function reviewOrder(orderId) {
  router.push({ name: 'Review', params: { orderId } })
}
</script>

<style scoped>
.orders-page {
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

/* Order Stats */
.order-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #6b21a8;
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #a855f7;
  display: block;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 12px 24px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 30px;
  color: #888;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  border-color: #6b21a8;
  color: #a855f7;
}

.tab-btn.active {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  border-color: transparent;
  color: white;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.order-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #6b21a8;
  box-shadow: 0 5px 30px rgba(107, 33, 168, 0.2);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: #0a0a0a;
  border-bottom: 1px solid #2d2d2d;
}

.order-id {
  font-weight: 600;
  color: #a855f7;
  font-size: 1.1rem;
}

.order-date {
  color: #888;
  font-size: 0.9rem;
  margin-left: 15px;
}

.order-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.order-status.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.order-status.processing {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.order-status.shipping {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.order-status.delivered {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.order-status.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Order Items */
.order-items {
  padding: 20px 25px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #2d2d2d;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  color: #f8f8f8;
  margin-bottom: 5px;
}

.item-qty {
  color: #888;
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: #a855f7;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: #0a0a0a;
  border-top: 1px solid #2d2d2d;
}

.order-total span:first-child {
  color: #888;
  margin-right: 10px;
}

.total-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f97316;
}

.order-actions {
  display: flex;
  gap: 10px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
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
  border: 1px solid #6b21a8;
  color: #a855f7;
}

.btn-secondary {
  background: #2d2d2d;
  color: #f8f8f8;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Order Timeline */
.order-timeline {
  display: flex;
  justify-content: space-between;
  padding: 25px;
  background: rgba(107, 33, 168, 0.05);
  border-top: 1px solid #2d2d2d;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 60%;
  width: 80%;
  height: 2px;
  background: #2d2d2d;
}

.timeline-item.completed:not(:last-child)::after {
  background: #6b21a8;
}

.timeline-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.timeline-item.completed .timeline-icon {
  background: #6b21a8;
  color: white;
}

.timeline-content strong {
  display: block;
  font-size: 0.85rem;
  color: #888;
}

.timeline-item.completed .timeline-content strong {
  color: #a855f7;
}

.timeline-content span {
  font-size: 0.75rem;
  color: #666;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: #a855f7;
  margin-bottom: 10px;
}

.empty-state p {
  color: #888;
  margin-bottom: 30px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content h2 {
  color: #f97316;
  margin-bottom: 25px;
}

.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #2d2d2d;
}

.detail-section h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.detail-section p {
  margin: 8px 0;
  color: #ccc;
}

.modal-items {
  margin-bottom: 15px;
}

.modal-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #2d2d2d;
}

.modal-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.2rem;
  color: #f97316;
  padding-top: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .order-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .order-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .order-footer {
    flex-direction: column;
    gap: 15px;
  }

  .order-timeline {
    flex-direction: column;
    gap: 20px;
  }

  .timeline-item:not(:last-child)::after {
    display: none;
  }
}
</style>
