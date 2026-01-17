<template>
  <div class="admin-orders">
    <!-- Header Actions -->
    <div class="page-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm theo mã đơn, tên khách hàng..." />
        </div>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <input type="date" v-model="filterDate" class="filter-select" />
      </div>
      <button class="btn btn-outline" @click="exportOrders">
        <i class="fas fa-download"></i> Xuất Excel
      </button>
    </div>

    <!-- Stats -->
    <div class="order-stats">
      <div class="stat-item pending">
        <span class="stat-value">{{ orderCounts.pending }}</span>
        <span class="stat-label">Chờ xử lý</span>
      </div>
      <div class="stat-item processing">
        <span class="stat-value">{{ orderCounts.processing }}</span>
        <span class="stat-label">Đang xử lý</span>
      </div>
      <div class="stat-item shipped">
        <span class="stat-value">{{ orderCounts.shipped }}</span>
        <span class="stat-label">Đang giao</span>
      </div>
      <div class="stat-item completed">
        <span class="stat-value">{{ orderCounts.completed }}</span>
        <span class="stat-label">Hoàn thành</span>
      </div>
      <div class="stat-item cancelled">
        <span class="stat-value">{{ orderCounts.cancelled }}</span>
        <span class="stat-label">Đã hủy</span>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="order-id">#{{ order.id }}</td>
            <td>
              <div class="customer-cell">
                <img :src="order.customer.avatar" :alt="order.customer.name" />
                <div>
                  <h4>{{ order.customer.name }}</h4>
                  <p>{{ order.customer.phone }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="products-preview">
                <span class="product-count">{{ order.items.length }} sản phẩm</span>
                <div class="product-images">
                  <img 
                    v-for="(item, index) in order.items.slice(0, 3)" 
                    :key="index" 
                    :src="item.image" 
                    :title="item.name"
                  />
                  <span v-if="order.items.length > 3" class="more">+{{ order.items.length - 3 }}</span>
                </div>
              </div>
            </td>
            <td class="total">{{ formatPrice(order.total) }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <select 
                v-model="order.status" 
                class="status-select"
                :class="order.status"
                @change="updateOrderStatus(order)"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn view" @click="viewOrder(order)" title="Xem chi tiết">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn print" @click="printOrder(order)" title="In hóa đơn">
                  <i class="fas fa-print"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <span class="page-info">Hiển thị 1-10 của {{ orders.length }} đơn hàng</span>
        <div class="page-btns">
          <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal-overlay" v-if="selectedOrder" @click.self="selectedOrder = null">
      <div class="modal order-modal">
        <div class="modal-header">
          <h3>Chi tiết đơn hàng #{{ selectedOrder.id }}</h3>
          <button class="close-btn" @click="selectedOrder = null">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="order-info-grid">
            <div class="info-section">
              <h4>👤 Thông tin khách hàng</h4>
              <p><strong>Họ tên:</strong> {{ selectedOrder.customer.name }}</p>
              <p><strong>SĐT:</strong> {{ selectedOrder.customer.phone }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
            </div>
            <div class="info-section">
              <h4>📍 Địa chỉ giao hàng</h4>
              <p>{{ selectedOrder.shippingAddress }}</p>
            </div>
          </div>

          <div class="order-items">
            <h4>📦 Sản phẩm</h4>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>
                    <div class="item-info">
                      <img :src="item.image" :alt="item.name" />
                      <span>{{ item.name }}</span>
                    </div>
                  </td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{{ formatPrice(selectedOrder.shippingFee) }}</span>
            </div>
            <div class="summary-row" v-if="selectedOrder.discount">
              <span>Giảm giá:</span>
              <span class="discount">-{{ formatPrice(selectedOrder.discount) }}</span>
            </div>
            <div class="summary-row total">
              <span>Tổng cộng:</span>
              <span>{{ formatPrice(selectedOrder.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')
const filterDate = ref('')
const selectedOrder = ref(null)

const orders = ref([
  {
    id: '1001',
    customer: { name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@email.com', avatar: 'https://i.pravatar.cc/40?img=1' },
    items: [
      { id: 1, name: 'Thức Ăn Cho Chó Premium', price: 350000, quantity: 2, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=50' },
      { id: 2, name: 'Vòng Cổ LED', price: 180000, quantity: 1, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=50' }
    ],
    subtotal: 880000,
    shippingFee: 30000,
    discount: 50000,
    total: 860000,
    shippingAddress: '123 Nguyễn Huệ, Q.1, TP.HCM',
    status: 'pending',
    createdAt: '2026-01-17T10:30:00'
  },
  {
    id: '1002',
    customer: { name: 'Trần Thị B', phone: '0912345678', email: 'b@email.com', avatar: 'https://i.pravatar.cc/40?img=2' },
    items: [
      { id: 3, name: 'Áo Halloween Cho Mèo', price: 180000, quantity: 3, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50' }
    ],
    subtotal: 540000,
    shippingFee: 30000,
    discount: 0,
    total: 570000,
    shippingAddress: '456 Lê Lợi, Q.3, TP.HCM',
    status: 'processing',
    createdAt: '2026-01-16T14:20:00'
  },
  {
    id: '1003',
    customer: { name: 'Lê Văn C', phone: '0923456789', email: 'c@email.com', avatar: 'https://i.pravatar.cc/40?img=3' },
    items: [
      { id: 4, name: 'Đồ Chơi Dơi Vampire', price: 89000, quantity: 5, image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=50' },
      { id: 5, name: 'Bát Ăn Bí Ngô', price: 150000, quantity: 2, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=50' }
    ],
    subtotal: 745000,
    shippingFee: 0,
    discount: 100000,
    total: 645000,
    shippingAddress: '789 Trần Hưng Đạo, Q.5, TP.HCM',
    status: 'shipped',
    createdAt: '2026-01-15T09:15:00'
  },
  {
    id: '1004',
    customer: { name: 'Phạm Thị D', phone: '0934567890', email: 'd@email.com', avatar: 'https://i.pravatar.cc/40?img=4' },
    items: [
      { id: 1, name: 'Thức Ăn Cho Chó Premium', price: 350000, quantity: 4, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=50' }
    ],
    subtotal: 1400000,
    shippingFee: 0,
    discount: 200000,
    total: 1200000,
    shippingAddress: '321 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
    status: 'completed',
    createdAt: '2026-01-14T16:45:00'
  },
  {
    id: '1005',
    customer: { name: 'Hoàng Văn E', phone: '0945678901', email: 'e@email.com', avatar: 'https://i.pravatar.cc/40?img=5' },
    items: [
      { id: 2, name: 'Vòng Cổ LED', price: 180000, quantity: 1, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=50' }
    ],
    subtotal: 180000,
    shippingFee: 30000,
    discount: 0,
    total: 210000,
    shippingAddress: '654 Võ Văn Tần, Q.3, TP.HCM',
    status: 'cancelled',
    createdAt: '2026-01-13T11:00:00'
  }
])

const orderCounts = computed(() => ({
  pending: orders.value.filter(o => o.status === 'pending').length,
  processing: orders.value.filter(o => o.status === 'processing').length,
  shipped: orders.value.filter(o => o.status === 'shipped').length,
  completed: orders.value.filter(o => o.status === 'completed').length,
  cancelled: orders.value.filter(o => o.status === 'cancelled').length
}))

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchSearch = o.id.includes(searchQuery.value) || o.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !filterStatus.value || o.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function updateOrderStatus(order) {
  console.log('Cập nhật trạng thái đơn', order.id, 'thành', order.status)
}

function viewOrder(order) {
  selectedOrder.value = order
}

function printOrder(order) {
  window.print()
}

function exportOrders() {
  alert('Xuất file Excel...')
}
</script>

<style scoped>
.admin-orders {
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
  max-width: 400px;
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

/* Order Stats */
.order-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-item.pending { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); }
.stat-item.processing { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); }
.stat-item.shipped { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); }
.stat-item.completed { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); }
.stat-item.cancelled { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); }

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
}

.stat-item.pending .stat-value { color: #f59e0b; }
.stat-item.processing .stat-value { color: #3b82f6; }
.stat-item.shipped .stat-value { color: #8b5cf6; }
.stat-item.completed .stat-value { color: #22c55e; }
.stat-item.cancelled .stat-value { color: #ef4444; }

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

/* Table */
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

.order-id {
  color: #a855f7 !important;
  font-weight: 600;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-cell img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.customer-cell h4 {
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.customer-cell p {
  color: #666;
  font-size: 0.8rem;
}

.products-preview {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-count {
  color: #888;
  font-size: 0.85rem;
}

.product-images {
  display: flex;
  align-items: center;
}

.product-images img {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  margin-right: -8px;
  border: 2px solid #1a1a1a;
}

.product-images .more {
  background: #2d2d2d;
  color: #888;
  font-size: 0.75rem;
  padding: 5px 8px;
  border-radius: 6px;
  margin-left: 8px;
}

.total {
  color: #22c55e !important;
  font-weight: 600;
}

.status-select {
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.status-select.pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.status-select.processing { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.status-select.shipped { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
.status-select.completed { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.status-select.cancelled { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

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

.action-btn.view { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.action-btn.print { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.action-btn:hover { transform: scale(1.1); }

/* Pagination */
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
  padding: 20px;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #2d2d2d;
}

.modal-header h3 { color: white; font-size: 1.3rem; }

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
}

.order-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.info-section {
  background: #0f0f12;
  padding: 20px;
  border-radius: 12px;
}

.info-section h4 {
  color: white;
  margin-bottom: 15px;
}

.info-section p {
  color: #888;
  margin-bottom: 8px;
}

.info-section strong {
  color: white;
}

.order-items h4 {
  color: white;
  margin-bottom: 15px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table th,
.items-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #2d2d2d;
}

.items-table th { color: #888; }
.items-table td { color: white; }

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-info img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.order-summary {
  background: #0f0f12;
  padding: 20px;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #888;
}

.summary-row.total {
  border-top: 1px solid #2d2d2d;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.summary-row.total span:last-child {
  color: #22c55e;
}

.discount {
  color: #dc2626;
}
</style>
