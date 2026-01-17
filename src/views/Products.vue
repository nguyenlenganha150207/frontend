<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="spooky-title">🎃 Sản Phẩm</h1>
        <p>Khám phá bộ sưu tập sản phẩm Halloween cho thú cưng</p>
      </div>
    </div>

    <div class="container">
      <div class="products-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3><i class="fas fa-filter"></i> Bộ Lọc</h3>
          </div>

          <!-- Categories -->
          <div class="filter-section">
            <h4>Danh Mục</h4>
            <div class="filter-options">
              <label class="filter-option" v-for="cat in categories" :key="cat.id">
                <input type="checkbox" v-model="selectedCategories" :value="cat.id" />
                <span class="checkmark"></span>
                {{ cat.name }}
              </label>
            </div>
          </div>

          <!-- Price Range -->
          <div class="filter-section">
            <h4>Khoảng Giá</h4>
            <div class="price-inputs">
              <input 
                type="number" 
                v-model.number="priceMin" 
                placeholder="Từ" 
                min="0"
                step="10000"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model.number="priceMax" 
                placeholder="Đến" 
                min="0"
                step="10000"
              />
            </div>
          </div>

          <!-- Rating -->
          <div class="filter-section">
            <h4>Đánh Giá</h4>
            <div class="filter-options">
              <label class="filter-option" v-for="n in 5" :key="n">
                <input type="radio" v-model="selectedRating" :value="6 - n" name="rating" />
                <span class="checkmark radio"></span>
                <span class="stars">
                  <i v-for="s in (6 - n)" :key="s" class="fas fa-star"></i>
                </span>
                trở lên
              </label>
            </div>
          </div>

          <!-- Sale Filter -->
          <div class="filter-section">
            <label class="filter-option sale-filter">
              <input type="checkbox" v-model="onSaleOnly" />
              <span class="checkmark"></span>
              🔥 Chỉ sản phẩm giảm giá
            </label>
          </div>

          <button class="btn btn-primary btn-full" @click="applyFilters">
            Áp Dụng Bộ Lọc
          </button>
          <button class="btn btn-ghost btn-full mt-1" @click="resetFilters">
            Xóa Bộ Lọc
          </button>
        </aside>

        <!-- Products Grid -->
        <div class="products-main">
          <!-- Toolbar -->
          <div class="products-toolbar">
            <div class="results-count">
              Hiển thị <strong>{{ filteredProducts.length }}</strong> sản phẩm
            </div>
            <div class="toolbar-right">
              <div class="sort-select">
                <select v-model="sortBy">
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
              <div class="view-toggle">
                <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                  <i class="fas fa-th"></i>
                </button>
                <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                  <i class="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="loading-state" v-if="loading">
            <div class="skeleton-grid">
              <div class="skeleton-card" v-for="n in 8" :key="n">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
              </div>
            </div>
          </div>

          <!-- Products -->
          <div :class="['products-grid', viewMode]" v-else>
            <ProductCard 
              v-for="product in paginatedProducts" 
              :key="product.id" 
              :product="product"
              @quick-view="openQuickView"
            />
          </div>

          <!-- Empty State -->
          <div class="empty-state" v-if="!loading && filteredProducts.length === 0">
            <div class="empty-icon">👻</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { productsAPI } from '../api'

const route = useRoute()

const loading = ref(false)
const products = ref([])
const categories = ref([
  { id: 1, name: 'Thức Ăn' },
  { id: 2, name: 'Đồ Chơi' },
  { id: 3, name: 'Phụ Kiện' },
  { id: 4, name: 'Quần Áo' },
  { id: 5, name: 'Sức Khỏe' },
  { id: 6, name: 'Vệ Sinh' }
])

// Filters
const selectedCategories = ref([])
const priceMin = ref(0)
const priceMax = ref(0)
const selectedRating = ref(0)
const onSaleOnly = ref(false)
const sortBy = ref('newest')
const viewMode = ref('grid')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Mock data
const mockProducts = [
  { id: 1, name: 'Thức Ăn Cho Chó Halloween Edition', category: 'Thức Ăn', categoryId: 1, price: 450000, salePrice: 350000, rating: 5, reviewCount: 128, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400', isHot: true },
  { id: 2, name: 'Vòng Cổ Bí Ngô LED', category: 'Phụ Kiện', categoryId: 3, price: 250000, salePrice: 180000, rating: 4, reviewCount: 89, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', isNew: true },
  { id: 3, name: 'Áo Halloween Cho Mèo', category: 'Quần Áo', categoryId: 4, price: 180000, rating: 4, reviewCount: 56, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
  { id: 4, name: 'Đồ Chơi Dơi Vampire', category: 'Đồ Chơi', categoryId: 2, price: 120000, salePrice: 89000, rating: 5, reviewCount: 234, image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400', isHot: true },
  { id: 5, name: 'Giường Ngủ Hình Bí Ngô', category: 'Phụ Kiện', categoryId: 3, price: 850000, salePrice: 650000, rating: 5, reviewCount: 67, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400' },
  { id: 6, name: 'Dầu Gội Halloween Hương Bí Đỏ', category: 'Vệ Sinh', categoryId: 6, price: 150000, rating: 4, reviewCount: 45, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
  { id: 7, name: 'Thức Ăn Cho Mèo Premium', category: 'Thức Ăn', categoryId: 1, price: 380000, rating: 5, reviewCount: 156, image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400' },
  { id: 8, name: 'Bóng Đồ Chơi Ma Quái', category: 'Đồ Chơi', categoryId: 2, price: 75000, salePrice: 55000, rating: 4, reviewCount: 89, image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400', isNew: true },
  { id: 9, name: 'Vitamin Bổ Sung Cho Thú Cưng', category: 'Sức Khỏe', categoryId: 5, price: 320000, rating: 5, reviewCount: 178, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400' },
  { id: 10, name: 'Dây Xích Phát Sáng', category: 'Phụ Kiện', categoryId: 3, price: 220000, salePrice: 170000, rating: 4, reviewCount: 92, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', isHot: true },
  { id: 11, name: 'Áo Khoác Dơi Cho Chó', category: 'Quần Áo', categoryId: 4, price: 280000, rating: 4, reviewCount: 34, image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400' },
  { id: 12, name: 'Bánh Thưởng Halloween', category: 'Thức Ăn', categoryId: 1, price: 95000, salePrice: 75000, rating: 5, reviewCount: 267, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400' }
]

const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Search filter
  if (searchQuery.value) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Category filter
  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.categoryId))
  }
  
  // Price filter
  if (priceMin.value && priceMin.value > 0) {
    result = result.filter(p => (p.salePrice || p.price) >= priceMin.value)
  }
  if (priceMax.value && priceMax.value > 0) {
    result = result.filter(p => (p.salePrice || p.price) <= priceMax.value)
  }
  
  // Rating filter
  if (selectedRating.value > 0) {
    result = result.filter(p => p.rating >= selectedRating.value)
  }
  
  // Sale filter
  if (onSaleOnly.value) {
    result = result.filter(p => p.salePrice)
  }
  
  // Sort
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
      break
    case 'price-high':
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
      break
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

function applyFilters() {
  currentPage.value = 1
}

function resetFilters() {
  selectedCategories.value = []
  priceMin.value = 0
  priceMax.value = 0
  selectedRating.value = 0
  onSaleOnly.value = false
  sortBy.value = 'newest'
  currentPage.value = 1
}

function openQuickView(product) {
  console.log('Quick view:', product)
}

// Watch route query
watch(() => route.query, (query) => {
  if (query.search) {
    searchQuery.value = query.search
  }
  if (query.sale) {
    onSaleOnly.value = true
  }
  if (query.category) {
    selectedCategories.value = [parseInt(query.category)]
  }
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  try {
    // const response = await productsAPI.getAll()
    // products.value = response.data
    products.value = mockProducts
  } catch (error) {
    products.value = mockProducts
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
  padding: 60px 0;
  text-align: center;
  border-bottom: 2px solid #6b21a8;
}

.page-header h1 {
  font-family: 'Creepster', cursive;
  font-size: 3rem;
  color: #f97316;
  margin-bottom: 10px;
}

.page-header p {
  color: #a855f7;
  font-size: 1.1rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  padding: 40px 0;
}

/* Sidebar */
.filters-sidebar {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 25px;
  height: fit-content;
  position: sticky;
  top: 100px;
  border: 1px solid #2d2d2d;
  overflow: hidden;
}

.filter-section {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #2d2d2d;
  max-width: 100%;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-section h3 {
  color: #f97316;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-section h4 {
  color: #a855f7;
  font-size: 1rem;
  margin-bottom: 15px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #b0b0b0;
  transition: color 0.3s ease;
}

.filter-option:hover {
  color: white;
}

.filter-option input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #6b21a8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkmark.radio {
  border-radius: 50%;
}

.filter-option input:checked + .checkmark {
  background: #6b21a8;
}

.filter-option input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 0.8rem;
}

.filter-option .stars {
  color: #f97316;
  font-size: 0.85rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.price-inputs input {
  flex: 1;
  min-width: 0;
  padding: 10px 8px;
  background: #0a0a0a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #f8f8f8;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.price-inputs input:focus {
  outline: none;
  border-color: #6b21a8;
  background: #1a1a1a;
}

.price-inputs input::placeholder {
  color: #666;
}

.price-inputs input::-webkit-outer-spin-button,
.price-inputs input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-inputs input[type=number] {
  -moz-appearance: textfield;
}

.price-inputs span {
  color: #666;
  font-weight: 500;
}

.sale-filter {
  color: #dc2626;
  font-weight: 500;
}

.btn-full {
  width: 100%;
}

/* Products Main */
.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #2d2d2d;
}

.results-count {
  color: #888;
}

.results-count strong {
  color: #a855f7;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sort-select select {
  padding: 10px 40px 10px 15px;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23a855f7' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-toggle button {
  width: 40px;
  height: 40px;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle button.active,
.view-toggle button:hover {
  background: #6b21a8;
  color: white;
  border-color: #6b21a8;
}

.products-grid {
  display: grid;
  gap: 25px;
}

.products-grid.grid {
  grid-template-columns: repeat(3, 1fr);
}

.products-grid.list {
  grid-template-columns: 1fr;
}

/* Loading State */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.skeleton-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  padding: 20px;
}

.skeleton-image {
  height: 200px;
  margin-bottom: 15px;
}

.skeleton-text {
  height: 20px;
  margin-bottom: 10px;
}

.skeleton-text.short {
  width: 60%;
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

.empty-state h3 {
  color: white;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.page-btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled),
.page-btn.active {
  background: #6b21a8;
  border-color: #6b21a8;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .products-grid.grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .products-layout {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 576px) {
  .products-grid.grid {
    grid-template-columns: 1fr;
  }
  
  .products-toolbar {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
