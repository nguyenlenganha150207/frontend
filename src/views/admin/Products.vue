<template>
  <div class="admin-products">
    <!-- Header Actions -->
    <div class="page-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." />
        </div>
        <select v-model="filterCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="food">Thức ăn</option>
          <option value="toys">Đồ chơi</option>
          <option value="accessories">Phụ kiện</option>
          <option value="clothes">Quần áo</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
          <option value="out-of-stock">Hết hàng</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm sản phẩm
      </button>
    </div>

    <!-- Products Table -->
    <div class="table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" /></th>
            <th>Sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Kho</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td><input type="checkbox" v-model="selectedProducts" :value="product.id" /></td>
            <td>
              <div class="product-cell">
                <img :src="product.image" :alt="product.name" />
                <div>
                  <h4>{{ product.name }}</h4>
                  <p>SKU: {{ product.sku }}</p>
                </div>
              </div>
            </td>
            <td>{{ product.category }}</td>
            <td>
              <div class="price-cell">
                <span class="current-price">{{ formatPrice(product.salePrice || product.price) }}</span>
                <span class="old-price" v-if="product.salePrice">{{ formatPrice(product.price) }}</span>
              </div>
            </td>
            <td>
              <span class="stock" :class="{ low: product.stock < 10 }">
                {{ product.stock }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="product.status">
                {{ getStatusText(product.status) }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit" @click="editProduct(product)" title="Sửa">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn view" @click="viewProduct(product)" title="Xem">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn delete" @click="deleteProduct(product)" title="Xóa">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <span class="page-info">Hiển thị 1-10 của {{ products.length }} sản phẩm</span>
        <div class="page-btns">
          <button class="page-btn" :disabled="currentPage === 1">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page" 
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h3>
          <button class="close-btn" @click="showAddModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Tên sản phẩm *</label>
              <input type="text" v-model="form.name" placeholder="Nhập tên sản phẩm" />
            </div>
            <div class="form-group">
              <label>SKU *</label>
              <input type="text" v-model="form.sku" placeholder="VD: SP001" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Danh mục *</label>
              <select v-model="form.category">
                <option value="">Chọn danh mục</option>
                <option value="food">Thức ăn</option>
                <option value="toys">Đồ chơi</option>
                <option value="accessories">Phụ kiện</option>
                <option value="clothes">Quần áo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="form.status">
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Giá gốc (VNĐ) *</label>
              <input type="number" v-model="form.price" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Giá khuyến mãi (VNĐ)</label>
              <input type="number" v-model="form.salePrice" placeholder="Để trống nếu không KM" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Số lượng trong kho *</label>
              <input type="number" v-model="form.stock" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Hình ảnh URL</label>
              <input type="text" v-model="form.image" placeholder="https://..." />
            </div>
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="form.description" rows="4" placeholder="Mô tả sản phẩm..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal = false">Hủy</button>
          <button class="btn btn-primary" @click="saveProduct">
            <i class="fas fa-save"></i> {{ editingProduct ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const selectAll = ref(false)
const selectedProducts = ref([])
const currentPage = ref(1)
const showAddModal = ref(false)
const editingProduct = ref(null)

const form = ref({
  name: '',
  sku: '',
  category: '',
  status: 'active',
  price: '',
  salePrice: '',
  stock: '',
  image: '',
  description: ''
})

const products = ref([
  { id: 1, name: 'Thức Ăn Cho Chó Premium', sku: 'SP001', category: 'Thức ăn', price: 450000, salePrice: 350000, stock: 120, status: 'active', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=100' },
  { id: 2, name: 'Vòng Cổ LED Halloween', sku: 'SP002', category: 'Phụ kiện', price: 250000, salePrice: 180000, stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100' },
  { id: 3, name: 'Áo Halloween Cho Mèo', sku: 'SP003', category: 'Quần áo', price: 180000, salePrice: null, stock: 8, status: 'active', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' },
  { id: 4, name: 'Đồ Chơi Dơi Vampire', sku: 'SP004', category: 'Đồ chơi', price: 120000, salePrice: 89000, stock: 0, status: 'out-of-stock', image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=100' },
  { id: 5, name: 'Bát Ăn Hình Bí Ngô', sku: 'SP005', category: 'Phụ kiện', price: 150000, salePrice: null, stock: 67, status: 'inactive', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100' }
])

const totalPages = computed(() => Math.ceil(products.value.length / 10))

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = !filterCategory.value || p.category === filterCategory.value
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    return matchSearch && matchCategory && matchStatus
  })
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function getStatusText(status) {
  const texts = { active: 'Đang bán', inactive: 'Ngừng bán', 'out-of-stock': 'Hết hàng' }
  return texts[status]
}

function editProduct(product) {
  editingProduct.value = product
  form.value = { ...product }
  showAddModal.value = true
}

function viewProduct(product) {
  window.open(`/products/${product.id}`, '_blank')
}

function deleteProduct(product) {
  if (confirm(`Bạn có chắc muốn xóa "${product.name}"?`)) {
    products.value = products.value.filter(p => p.id !== product.id)
  }
}

function saveProduct() {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    products.value[index] = { ...form.value }
  } else {
    products.value.push({ ...form.value, id: Date.now() })
  }
  showAddModal.value = false
  resetForm()
}

function resetForm() {
  form.value = { name: '', sku: '', category: '', status: 'active', price: '', salePrice: '', stock: '', image: '', description: '' }
  editingProduct.value = null
}
</script>

<style scoped>
.admin-products {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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

.admin-table tr:hover {
  background: rgba(107, 33, 168, 0.05);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-cell img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
}

.product-cell h4 {
  font-size: 0.95rem;
  margin-bottom: 3px;
}

.product-cell p {
  color: #666;
  font-size: 0.8rem;
}

.price-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.current-price {
  color: #22c55e;
  font-weight: 600;
}

.old-price {
  color: #666;
  text-decoration: line-through;
  font-size: 0.85rem;
}

.stock {
  font-weight: 600;
}

.stock.low {
  color: #dc2626;
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

.status-badge.inactive {
  background: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
}

.status-badge.out-of-stock {
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.action-btn.view {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #2d2d2d;
}

.page-info {
  color: #888;
  font-size: 0.9rem;
}

.page-btns {
  display: flex;
  gap: 8px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  background: #2d2d2d;
  border: none;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #3d3d3d;
  color: white;
}

.page-btn.active {
  background: linear-gradient(135deg, #6b21a8, #a855f7);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  max-width: 700px;
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

.modal-header h3 {
  color: white;
  font-size: 1.3rem;
}

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
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 25px;
  border-top: 1px solid #2d2d2d;
}
</style>
