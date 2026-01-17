<template>
  <div class="admin-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon revenue">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="stat-info">
          <h3>{{ formatPrice(stats.totalRevenue) }}</h3>
          <p>Tổng doanh thu</p>
        </div>
        <div class="stat-trend up">
          <i class="fas fa-arrow-up"></i> 12.5%
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalOrders }}</h3>
          <p>Đơn hàng</p>
        </div>
        <div class="stat-trend up">
          <i class="fas fa-arrow-up"></i> 8.2%
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon products">
          <i class="fas fa-box"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalProducts }}</h3>
          <p>Sản phẩm</p>
        </div>
        <div class="stat-trend down">
          <i class="fas fa-arrow-down"></i> 2.1%
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon users">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalUsers }}</h3>
          <p>Người dùng</p>
        </div>
        <div class="stat-trend up">
          <i class="fas fa-arrow-up"></i> 15.3%
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="card-header">
          <h3>📈 Doanh thu theo tháng</h3>
          <select v-model="selectedYear" class="year-select">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <div class="bar-chart">
            <div 
              v-for="(value, index) in revenueData" 
              :key="index" 
              class="bar"
              :style="{ height: (value / maxRevenue * 100) + '%' }"
            >
              <span class="bar-value">{{ formatShortPrice(value) }}</span>
            </div>
          </div>
          <div class="chart-labels">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
        </div>
      </div>

      <div class="chart-card small">
        <div class="card-header">
          <h3>🥧 Phân loại đơn hàng</h3>
        </div>
        <div class="pie-stats">
          <div class="pie-item">
            <div class="pie-color pending"></div>
            <span class="pie-label">Chờ xử lý</span>
            <span class="pie-value">{{ orderStats.pending }}</span>
          </div>
          <div class="pie-item">
            <div class="pie-color processing"></div>
            <span class="pie-label">Đang xử lý</span>
            <span class="pie-value">{{ orderStats.processing }}</span>
          </div>
          <div class="pie-item">
            <div class="pie-color shipped"></div>
            <span class="pie-label">Đang giao</span>
            <span class="pie-value">{{ orderStats.shipped }}</span>
          </div>
          <div class="pie-item">
            <div class="pie-color completed"></div>
            <span class="pie-label">Hoàn thành</span>
            <span class="pie-value">{{ orderStats.completed }}</span>
          </div>
          <div class="pie-item">
            <div class="pie-color cancelled"></div>
            <span class="pie-label">Đã hủy</span>
            <span class="pie-value">{{ orderStats.cancelled }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders & Top Products -->
    <div class="data-row">
      <!-- Recent Orders -->
      <div class="data-card">
        <div class="card-header">
          <h3>🛒 Đơn hàng gần đây</h3>
          <router-link to="/admin/orders" class="view-all">Xem tất cả</router-link>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="order-id">#{{ order.id }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ formatPrice(order.total) }}</td>
                <td>
                  <span class="status-badge" :class="order.status">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Products -->
      <div class="data-card">
        <div class="card-header">
          <h3>🔥 Sản phẩm bán chạy</h3>
          <router-link to="/admin/products" class="view-all">Xem tất cả</router-link>
        </div>
        <div class="top-products">
          <div class="product-item" v-for="(product, index) in topProducts" :key="product.id">
            <span class="rank">{{ index + 1 }}</span>
            <img :src="product.image" :alt="product.name" />
            <div class="product-info">
              <h4>{{ product.name }}</h4>
              <p>{{ product.sold }} đã bán</p>
            </div>
            <span class="product-revenue">{{ formatPrice(product.revenue) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedYear = ref('2026')

const stats = ref({
  totalRevenue: 125000000,
  totalOrders: 1234,
  totalProducts: 567,
  totalUsers: 890
})

const orderStats = ref({
  pending: 23,
  processing: 45,
  shipped: 67,
  completed: 1089,
  cancelled: 10
})

const revenueData = ref([45, 52, 38, 65, 48, 55, 70, 62, 58, 75, 80, 85])
const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

const maxRevenue = computed(() => Math.max(...revenueData.value))

const recentOrders = ref([
  { id: '1001', customerName: 'Nguyễn Văn A', total: 1500000, status: 'pending' },
  { id: '1002', customerName: 'Trần Thị B', total: 2300000, status: 'processing' },
  { id: '1003', customerName: 'Lê Văn C', total: 850000, status: 'shipped' },
  { id: '1004', customerName: 'Phạm Thị D', total: 3200000, status: 'completed' },
  { id: '1005', customerName: 'Hoàng Văn E', total: 1200000, status: 'cancelled' }
])

const topProducts = ref([
  { id: 1, name: 'Thức ăn cho chó Premium', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=100', sold: 234, revenue: 105300000 },
  { id: 2, name: 'Vòng cổ LED Halloween', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100', sold: 189, revenue: 34020000 },
  { id: 3, name: 'Đồ chơi bí ngô', image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=100', sold: 156, revenue: 18720000 },
  { id: 4, name: 'Áo Halloween cho mèo', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100', sold: 134, revenue: 24120000 }
])

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function formatShortPrice(value) {
  return value + 'M'
}

function getStatusText(status) {
  const texts = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return texts[status] || status
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.revenue { background: linear-gradient(135deg, #22c55e, #16a34a); }
.stat-icon.orders { background: linear-gradient(135deg, #6b21a8, #a855f7); }
.stat-icon.products { background: linear-gradient(135deg, #f97316, #ea580c); }
.stat-icon.users { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.stat-info h3 {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 5px;
}

.stat-info p {
  color: #888;
  font-size: 0.9rem;
}

.stat-trend {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-trend.up {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.stat-trend.down {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.card-header h3 {
  color: white;
  font-size: 1.1rem;
}

.year-select {
  background: #2d2d2d;
  border: 1px solid #3d3d3d;
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  flex-direction: column;
}

.bar-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #6b21a8, #a855f7);
  border-radius: 6px 6px 0 0;
  min-height: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.bar:hover {
  background: linear-gradient(180deg, #a855f7, #6b21a8);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #888;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #2d2d2d;
}

.chart-labels span {
  color: #666;
  font-size: 0.8rem;
}

/* Pie Stats */
.pie-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pie-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pie-color {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.pie-color.pending { background: #f59e0b; }
.pie-color.processing { background: #3b82f6; }
.pie-color.shipped { background: #8b5cf6; }
.pie-color.completed { background: #22c55e; }
.pie-color.cancelled { background: #ef4444; }

.pie-label {
  flex: 1;
  color: #888;
}

.pie-value {
  color: white;
  font-weight: 600;
}

/* Data Row */
.data-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

.data-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
}

.view-all {
  color: #a855f7;
  text-decoration: none;
  font-size: 0.9rem;
}

.view-all:hover {
  text-decoration: underline;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
}

.data-table th {
  color: #888;
  font-weight: 500;
  border-bottom: 1px solid #2d2d2d;
}

.data-table td {
  color: white;
  border-bottom: 1px solid #1d1d1d;
}

.order-id {
  color: #a855f7 !important;
  font-weight: 600;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.status-badge.processing {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status-badge.shipped {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Top Products */
.top-products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.product-item:hover {
  background: rgba(107, 33, 168, 0.1);
}

.rank {
  width: 28px;
  height: 28px;
  background: #2d2d2d;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  font-weight: 700;
}

.product-item img {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  color: white;
  font-size: 0.95rem;
  margin-bottom: 3px;
}

.product-info p {
  color: #666;
  font-size: 0.8rem;
}

.product-revenue {
  color: #22c55e;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-row,
  .data-row {
    grid-template-columns: 1fr;
  }
}
</style>
