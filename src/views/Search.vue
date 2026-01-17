<template>
  <div class="search-page">
    <div class="container">
      <!-- Search Header -->
      <div class="search-header">
        <h1 class="page-title spooky-title">🔍 Tìm Kiếm Ma Quái</h1>
        
        <!-- Search Bar -->
        <div class="search-box">
          <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              @keyup.enter="performSearch"
              placeholder="Tìm kiếm sản phẩm, thú cưng..."
              class="search-input"
            />
            <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button class="btn btn-primary" @click="performSearch">
            <i class="fas fa-search"></i> Tìm kiếm
          </button>
        </div>

        <!-- Quick Filters -->
        <div class="quick-filters">
          <button 
            v-for="filter in quickFilters" 
            :key="filter.value"
            :class="['filter-chip', { active: selectedType === filter.value }]"
            @click="selectedType = filter.value; performSearch()"
          >
            {{ filter.icon }} {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Search Results Info -->
      <div class="search-info" v-if="hasSearched">
        <div class="result-count">
          <span v-if="totalResults > 0">
            Tìm thấy <strong>{{ totalResults }}</strong> kết quả cho 
            <span class="search-term">"{{ lastSearchQuery }}"</span>
          </span>
          <span v-else>
            Không tìm thấy kết quả cho <span class="search-term">"{{ lastSearchQuery }}"</span>
          </span>
        </div>
        <div class="sort-options">
          <select v-model="sortBy" @change="sortResults">
            <option value="relevant">Phù hợp nhất</option>
            <option value="price-asc">Giá thấp - cao</option>
            <option value="price-desc">Giá cao - thấp</option>
            <option value="newest">Mới nhất</option>
            <option value="popular">Phổ biến</option>
          </select>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="advanced-filters" v-if="hasSearched && totalResults > 0">
        <button class="filter-toggle" @click="showFilters = !showFilters">
          <i class="fas fa-sliders-h"></i> Bộ lọc
          <i :class="showFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>

        <transition name="slide">
          <div class="filters-panel" v-if="showFilters">
            <!-- Price Range -->
            <div class="filter-group">
              <h4>💰 Khoảng giá</h4>
              <div class="price-range">
                <input type="number" v-model.number="priceRange.min" placeholder="Từ" />
                <span>-</span>
                <input type="number" v-model.number="priceRange.max" placeholder="Đến" />
              </div>
            </div>

            <!-- Categories -->
            <div class="filter-group">
              <h4>📂 Danh mục</h4>
              <div class="checkbox-list">
                <label v-for="cat in categories" :key="cat.value">
                  <input type="checkbox" :value="cat.value" v-model="selectedCategories" />
                  <span>{{ cat.label }}</span>
                </label>
              </div>
            </div>

            <!-- Ratings -->
            <div class="filter-group">
              <h4>⭐ Đánh giá</h4>
              <div class="rating-filter">
                <label v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
                  <input type="radio" :value="rating" v-model="minRating" />
                  <div class="stars">
                    <i v-for="n in rating" :key="n" class="fas fa-star"></i>
                    <i v-for="n in (5 - rating)" :key="'e'+n" class="far fa-star"></i>
                  </div>
                  <span>trở lên</span>
                </label>
              </div>
            </div>

            <button class="btn btn-primary btn-full" @click="applyFilters">
              <i class="fas fa-check"></i> Áp dụng
            </button>
            <button class="btn btn-ghost btn-full" @click="resetFilters">
              <i class="fas fa-redo"></i> Đặt lại
            </button>
          </div>
        </transition>
      </div>

      <!-- Search Results -->
      <div class="search-results" v-if="hasSearched && totalResults > 0">
        <div class="results-grid">
          <div class="result-card" v-for="item in searchResults" :key="`${item.type}-${item.id}`">
            <router-link :to="getItemLink(item)" class="card-link">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" />
                <span class="type-badge" :class="item.type">
                  {{ item.type === 'pet' ? '🐾 Thú cưng' : '📦 Sản phẩm' }}
                </span>
                <span class="sale-badge" v-if="item.salePrice">
                  -{{ Math.round((1 - item.salePrice / item.price) * 100) }}%
                </span>
              </div>
              <div class="card-content">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-category">{{ item.category }}</p>
                
                <div class="item-rating" v-if="item.rating">
                  <div class="stars">
                    <i v-for="n in 5" :key="n" :class="n <= item.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </div>
                  <span class="rating-count">({{ item.reviews }})</span>
                </div>

                <div class="item-price">
                  <span class="current-price">{{ formatPrice(item.salePrice || item.price) }}</span>
                  <span class="old-price" v-if="item.salePrice">{{ formatPrice(item.price) }}</span>
                </div>

                <div class="item-badges">
                  <span class="badge" v-if="item.inStock">✓ Còn hàng</span>
                  <span class="badge sold" v-if="item.soldCount">🔥 Đã bán {{ item.soldCount }}</span>
                </div>
              </div>
            </router-link>
            <div class="card-actions">
              <button class="btn-icon" @click.prevent="toggleWishlist(item)">
                <i :class="isInWishlist(item) ? 'fas fa-heart' : 'far fa-heart'"></i>
              </button>
              <button class="btn-icon" @click.prevent="addToCart(item)" v-if="item.type === 'product'">
                <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            @click="currentPage--" 
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            v-for="page in displayPages" 
            :key="page"
            :class="['page-btn', { active: page === currentPage }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div class="no-results" v-if="hasSearched && totalResults === 0">
        <div class="no-results-icon">👻</div>
        <h2>Không tìm thấy kết quả</h2>
        <p>Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
        <div class="suggestions">
          <h3>Gợi ý cho bạn:</h3>
          <ul>
            <li>Kiểm tra lỗi chính tả</li>
            <li>Sử dụng từ khóa ngắn gọn hơn</li>
            <li>Thử các từ đồng nghĩa</li>
            <li>Xóa bớt bộ lọc</li>
          </ul>
        </div>
      </div>

      <!-- Popular Searches -->
      <div class="popular-searches" v-if="!hasSearched">
        <h2 class="section-title">🔥 Tìm Kiếm Phổ Biến</h2>
        <div class="popular-tags">
          <button 
            v-for="tag in popularSearches" 
            :key="tag"
            class="tag-btn"
            @click="searchQuery = tag; performSearch()"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Trending Products -->
      <div class="trending-section" v-if="!hasSearched || totalResults === 0">
        <h2 class="section-title spooky-title">🎃 Sản Phẩm Nổi Bật</h2>
        <div class="products-grid">
          <div class="product-card" v-for="item in trendingProducts" :key="item.id">
            <router-link :to="`/products/${item.id}`">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="card-content">
                <h4>{{ item.name }}</h4>
                <span class="card-price">{{ formatPrice(item.price) }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const searchQuery = ref(route.query.q || '')
const lastSearchQuery = ref('')
const hasSearched = ref(false)
const selectedType = ref('all')
const sortBy = ref('relevant')
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

// Filters
const priceRange = ref({ min: null, max: null })
const selectedCategories = ref([])
const minRating = ref(null)

const quickFilters = [
  { label: 'Tất cả', value: 'all', icon: '📋' },
  { label: 'Sản phẩm', value: 'product', icon: '📦' },
  { label: 'Thú cưng', value: 'pet', icon: '🐾' },
  { label: 'Khuyến mãi', value: 'sale', icon: '🔥' }
]

const categories = [
  { label: 'Thức ăn', value: 'food' },
  { label: 'Phụ kiện', value: 'accessories' },
  { label: 'Đồ chơi', value: 'toys' },
  { label: 'Quần áo', value: 'clothing' },
  { label: 'Chăm sóc', value: 'care' }
]

const popularSearches = [
  'Áo choàng Halloween',
  'Thức ăn cho mèo',
  'Đồ chơi bí ngô',
  'Husky',
  'Corgi',
  'Vòng cổ phát sáng',
  'Giường thú cưng',
  'Mũ phù thủy'
]

// Demo search results
const allResults = ref([
  {
    id: 1,
    type: 'product',
    name: 'Áo Choàng Dracula Cho Chó',
    category: 'Quần áo',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    price: 350000,
    salePrice: 280000,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    soldCount: 256
  },
  {
    id: 2,
    type: 'product',
    name: 'Mũ Phù Thủy Cho Mèo',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    price: 150000,
    salePrice: null,
    rating: 4.8,
    reviews: 89,
    inStock: true,
    soldCount: 180
  },
  {
    id: 1,
    type: 'pet',
    name: 'Shadow - Husky Siberian',
    category: 'Chó',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400',
    price: 8500000,
    salePrice: null,
    rating: 5.0,
    reviews: 45,
    inStock: true,
    soldCount: null
  },
  {
    id: 3,
    type: 'product',
    name: 'Vòng Cổ Bí Ngô Phát Sáng',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    price: 120000,
    salePrice: 89000,
    rating: 4.3,
    reviews: 156,
    inStock: true,
    soldCount: 320
  },
  {
    id: 4,
    type: 'product',
    name: 'Đồ Chơi Dơi Ma Halloween',
    category: 'Đồ chơi',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    price: 65000,
    salePrice: 50000,
    rating: 4.6,
    reviews: 203,
    inStock: true,
    soldCount: 450
  },
  {
    id: 2,
    type: 'pet',
    name: 'Luna - Corgi',
    category: 'Chó',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    price: 12000000,
    salePrice: null,
    rating: 4.9,
    reviews: 32,
    inStock: true,
    soldCount: null
  }
])

const trendingProducts = ref([
  { id: 10, name: 'Giường Quan Tài', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300', price: 450000 },
  { id: 11, name: 'Bát Ăn Đầu Lâu', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300', price: 180000 },
  { id: 12, name: 'Áo Ma Cà Rồng', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300', price: 320000 },
  { id: 13, name: 'Dây Dắt Halloween', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300', price: 150000 }
])

const searchResults = computed(() => {
  let results = [...allResults.value]

  // Filter by type
  if (selectedType.value !== 'all') {
    if (selectedType.value === 'sale') {
      results = results.filter(item => item.salePrice)
    } else {
      results = results.filter(item => item.type === selectedType.value)
    }
  }

  // Apply filters
  if (priceRange.value.min) {
    results = results.filter(item => (item.salePrice || item.price) >= priceRange.value.min)
  }
  if (priceRange.value.max) {
    results = results.filter(item => (item.salePrice || item.price) <= priceRange.value.max)
  }
  if (minRating.value) {
    results = results.filter(item => item.rating >= minRating.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'price-asc':
      results.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
      break
    case 'price-desc':
      results.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
      break
    case 'popular':
      results.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      break
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  return results.slice(start, start + itemsPerPage)
})

const totalResults = computed(() => allResults.value.length)
const totalPages = computed(() => Math.ceil(totalResults.value / itemsPerPage))

const displayPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function performSearch() {
  if (!searchQuery.value.trim()) return
  
  hasSearched.value = true
  lastSearchQuery.value = searchQuery.value
  currentPage.value = 1
  
  // Update URL
  router.push({ query: { q: searchQuery.value } })
}

function clearSearch() {
  searchQuery.value = ''
  hasSearched.value = false
  router.push({ query: {} })
}

function getItemLink(item) {
  return item.type === 'pet' ? `/pets/${item.id}` : `/products/${item.id}`
}

function sortResults() {
  // Results will be automatically sorted by computed property
}

function applyFilters() {
  showFilters.value = false
  currentPage.value = 1
}

function resetFilters() {
  priceRange.value = { min: null, max: null }
  selectedCategories.value = []
  minRating.value = null
}

function isInWishlist(item) {
  // Check if item is in wishlist
  return false
}

function toggleWishlist(item) {
  alert('❤️ Đã thêm/xóa khỏi danh sách yêu thích!')
}

function addToCart(item) {
  cartStore.addItem(item)
  alert('🛒 Đã thêm vào giỏ hàng!')
}

// Check if there's a search query in URL on mount
if (route.query.q) {
  performSearch()
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 40px 0 80px;
}

.search-header {
  margin-bottom: 40px;
}

.page-title {
  font-family: 'Creepster', cursive;
  font-size: 2.5rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 30px;
}

/* Search Box */
.search-box {
  display: flex;
  gap: 15px;
  max-width: 800px;
  margin: 0 auto 25px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper i.fa-search {
  position: absolute;
  left: 20px;
  color: #888;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 18px 50px 18px 55px;
  background: #1a1a1a;
  border: 2px solid #2d2d2d;
  border-radius: 15px;
  color: #f8f8f8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6b21a8;
  box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.2);
}

.clear-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #f8f8f8;
}

.btn {
  padding: 18px 35px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.4);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

/* Quick Filters */
.quick-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 10px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 25px;
  color: #888;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  border-color: #6b21a8;
  color: #a855f7;
}

.filter-chip.active {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  border-color: transparent;
  color: white;
}

/* Search Info */
.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 15px;
}

.result-count {
  color: #ccc;
}

.result-count strong {
  color: #a855f7;
  font-size: 1.2rem;
}

.search-term {
  color: #f97316;
  font-weight: 600;
}

.sort-options select {
  padding: 10px 20px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
  cursor: pointer;
}

.sort-options select:focus {
  outline: none;
  border-color: #6b21a8;
}

/* Advanced Filters */
.advanced-filters {
  margin-bottom: 30px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #a855f7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-toggle:hover {
  border-color: #6b21a8;
}

.filters-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto auto;
  gap: 20px;
  margin-top: 20px;
  padding: 25px;
  background: #1a1a1a;
  border-radius: 15px;
}

.filter-group h4 {
  color: #a855f7;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-range input {
  flex: 1;
  padding: 10px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: #f8f8f8;
}

.checkbox-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #ccc;
  cursor: pointer;
}

.checkbox-list input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.rating-filter label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #ccc;
  cursor: pointer;
}

.rating-filter .stars {
  color: #fbbf24;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Search Results */
.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.result-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.result-card:hover {
  border-color: #6b21a8;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.2);
}

.card-link {
  text-decoration: none;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-card:hover .card-image img {
  transform: scale(1.05);
}

.type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-badge.product {
  background: rgba(107, 33, 168, 0.9);
  color: white;
}

.type-badge.pet {
  background: rgba(249, 115, 22, 0.9);
  color: white;
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc2626;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-content {
  padding: 15px;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #f8f8f8;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-category {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.item-rating .stars {
  color: #fbbf24;
  font-size: 0.8rem;
}

.rating-count {
  color: #888;
  font-size: 0.8rem;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f97316;
}

.old-price {
  color: #888;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.item-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.item-badges .badge {
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border-radius: 10px;
  font-size: 0.75rem;
}

.item-badges .badge.sold {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 0 15px 15px;
}

.btn-icon {
  flex: 1;
  padding: 10px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  border-color: #6b21a8;
  color: #a855f7;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #6b21a8;
  color: #a855f7;
}

.page-btn.active {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  border-color: transparent;
  color: white;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.no-results h2 {
  color: #a855f7;
  margin-bottom: 10px;
}

.no-results p {
  color: #888;
  margin-bottom: 30px;
}

.suggestions {
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
  padding: 25px;
  background: #1a1a1a;
  border-radius: 15px;
}

.suggestions h3 {
  color: #f97316;
  margin-bottom: 15px;
}

.suggestions ul {
  color: #ccc;
  line-height: 1.8;
}

/* Popular Searches */
.popular-searches {
  margin-bottom: 60px;
}

.section-title {
  font-family: 'Creepster', cursive;
  font-size: 2rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 30px;
}

.popular-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-btn {
  padding: 12px 24px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 25px;
  color: #a855f7;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  border-color: #6b21a8;
  background: rgba(107, 33, 168, 0.1);
}

/* Trending Products */
.trending-section {
  margin-top: 60px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #6b21a8;
  transform: translateY(-5px);
}

.product-card a {
  text-decoration: none;
}

.product-card .card-image {
  height: 180px;
}

.product-card .card-content {
  padding: 15px;
}

.product-card h4 {
  color: #f8f8f8;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.card-price {
  color: #f97316;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .filters-panel {
    grid-template-columns: 1fr 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }

  .search-info {
    flex-direction: column;
    gap: 15px;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
