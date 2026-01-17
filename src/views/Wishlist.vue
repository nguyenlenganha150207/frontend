<template>
  <div class="wishlist-page">
    <div class="container">
      <h1 class="page-title spooky-title">❤️ Danh Sách Yêu Thích</h1>

      <!-- Wishlist Stats -->
      <div class="wishlist-stats" v-if="wishlistItems.length > 0">
        <div class="stat-item">
          <span class="stat-number">{{ wishlistItems.length }}</span>
          <span class="stat-label">Sản phẩm yêu thích</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ formatPrice(totalValue) }}</span>
          <span class="stat-label">Tổng giá trị</span>
        </div>
      </div>

      <!-- Filter & Sort -->
      <div class="filter-bar" v-if="wishlistItems.length > 0">
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
        <div class="sort-options">
          <select v-model="sortBy">
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp - cao</option>
            <option value="price-desc">Giá cao - thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      <!-- Wishlist Grid -->
      <div class="wishlist-grid" v-if="filteredItems.length > 0">
        <div class="wishlist-card" v-for="item in filteredItems" :key="`${item.type}-${item.id}`">
          <div class="card-image">
            <img :src="item.image" :alt="item.name" />
            <span class="item-type-badge" :class="item.type">
              {{ item.type === 'pet' ? '🐾' : '📦' }}
            </span>
            <span class="sale-badge" v-if="item.salePrice">
              -{{ Math.round((1 - item.salePrice / item.price) * 100) }}%
            </span>
            <button class="remove-btn" @click="removeFromWishlist(item)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="card-content">
            <router-link :to="getItemLink(item)" class="item-name">
              {{ item.name }}
            </router-link>
            <p class="item-category">{{ item.category }}</p>
            
            <div class="item-price">
              <span class="current-price">{{ formatPrice(item.salePrice || item.price) }}</span>
              <span class="old-price" v-if="item.salePrice">{{ formatPrice(item.price) }}</span>
            </div>

            <div class="item-stock" :class="item.inStock ? 'in-stock' : 'out-stock'">
              {{ item.inStock ? '✓ Còn hàng' : '✗ Hết hàng' }}
            </div>

            <div class="card-actions">
              <button 
                class="btn btn-primary" 
                @click="addToCart(item)"
                :disabled="!item.inStock"
              >
                <i class="fas fa-shopping-cart"></i> Thêm giỏ hàng
              </button>
              <button class="btn btn-outline" @click="viewItem(item)">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>

          <div class="card-footer">
            <span class="added-date">
              <i class="far fa-clock"></i> Đã thêm {{ item.addedAt }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-icon">💔</div>
        <h2>Danh sách yêu thích trống!</h2>
        <p>Hãy khám phá và thêm những sản phẩm bạn yêu thích</p>
        <div class="empty-actions">
          <router-link to="/products" class="btn btn-primary">
            <i class="fas fa-shopping-bag"></i> Xem Sản Phẩm
          </router-link>
          <router-link to="/pets" class="btn btn-secondary">
            <i class="fas fa-paw"></i> Xem Thú Cưng
          </router-link>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions" v-if="wishlistItems.length > 0">
        <button class="btn btn-outline" @click="addAllToCart">
          <i class="fas fa-cart-plus"></i> Thêm tất cả vào giỏ
        </button>
        <button class="btn btn-ghost" @click="clearWishlist">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
        <button class="btn btn-ghost" @click="shareWishlist">
          <i class="fas fa-share-alt"></i> Chia sẻ
        </button>
      </div>

      <!-- Recommended Products -->
      <div class="recommendations" v-if="wishlistItems.length > 0">
        <h2 class="section-title spooky-title">🎃 Có Thể Bạn Cũng Thích</h2>
        <div class="products-grid">
          <div class="product-card" v-for="item in recommendations" :key="item.id">
            <div class="card-image">
              <img :src="item.image" :alt="item.name" />
              <button class="add-wishlist-btn" @click="addToWishlist(item)">
                <i class="far fa-heart"></i>
              </button>
            </div>
            <div class="card-content">
              <h4>{{ item.name }}</h4>
              <span class="card-price">{{ formatPrice(item.price) }}</span>
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
const sortBy = ref('newest')

const tabs = [
  { label: 'Tất cả', value: 'all', icon: '📋' },
  { label: 'Sản phẩm', value: 'product', icon: '📦' },
  { label: 'Thú cưng', value: 'pet', icon: '🐾' }
]

// Demo wishlist items
const wishlistItems = ref([
  {
    id: 1,
    type: 'product',
    name: 'Áo Choàng Dracula Cho Chó',
    category: 'Phụ kiện thú cưng',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    price: 350000,
    salePrice: 280000,
    inStock: true,
    addedAt: '2 ngày trước'
  },
  {
    id: 2,
    type: 'product',
    name: 'Mũ Phù Thủy Cho Mèo',
    category: 'Phụ kiện thú cưng',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    price: 150000,
    salePrice: null,
    inStock: true,
    addedAt: '3 ngày trước'
  },
  {
    id: 1,
    type: 'pet',
    name: 'Shadow - Husky Siberian',
    category: 'Chó',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400',
    price: 8500000,
    salePrice: null,
    inStock: true,
    addedAt: '1 tuần trước'
  },
  {
    id: 3,
    type: 'product',
    name: 'Vòng Cổ Bí Ngô Phát Sáng',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    price: 120000,
    salePrice: 89000,
    inStock: false,
    addedAt: '5 ngày trước'
  },
  {
    id: 2,
    type: 'pet',
    name: 'Luna - Corgi',
    category: 'Chó',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    price: 12000000,
    salePrice: null,
    inStock: true,
    addedAt: '1 tuần trước'
  },
  {
    id: 4,
    type: 'product',
    name: 'Đồ Chơi Dơi Ma Halloween',
    category: 'Đồ chơi',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    price: 65000,
    salePrice: 50000,
    inStock: true,
    addedAt: '3 ngày trước'
  }
])

const recommendations = ref([
  { id: 10, name: 'Giường Quan Tài Cho Mèo', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300', price: 450000 },
  { id: 11, name: 'Bát Ăn Hình Đầu Lâu', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300', price: 180000 },
  { id: 12, name: 'Áo Khoác Ma Cà Rồng', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300', price: 320000 },
  { id: 13, name: 'Dây Dắt Halloween', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300', price: 150000 }
])

const filteredItems = computed(() => {
  let items = wishlistItems.value

  // Filter by type
  if (activeTab.value !== 'all') {
    items = items.filter(item => item.type === activeTab.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'price-asc':
      items = [...items].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
      break
    case 'price-desc':
      items = [...items].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
      break
    case 'name':
      items = [...items].sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return items
})

const totalValue = computed(() => {
  return wishlistItems.value.reduce((sum, item) => sum + (item.salePrice || item.price), 0)
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function getItemLink(item) {
  return item.type === 'pet' ? `/pets/${item.id}` : `/products/${item.id}`
}

function removeFromWishlist(item) {
  const index = wishlistItems.value.findIndex(
    i => i.id === item.id && i.type === item.type
  )
  if (index > -1) {
    wishlistItems.value.splice(index, 1)
  }
}

function addToCart(item) {
  if (!item.inStock) return
  cartStore.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    salePrice: item.salePrice,
    image: item.image,
    type: item.type
  })
  alert('🛒 Đã thêm vào giỏ hàng!')
}

function viewItem(item) {
  router.push(getItemLink(item))
}

function addAllToCart() {
  const inStockItems = wishlistItems.value.filter(item => item.inStock)
  inStockItems.forEach(item => {
    cartStore.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      type: item.type
    })
  })
  alert(`🛒 Đã thêm ${inStockItems.length} sản phẩm vào giỏ hàng!`)
}

function clearWishlist() {
  if (confirm('Bạn có chắc muốn xóa tất cả khỏi danh sách yêu thích?')) {
    wishlistItems.value = []
  }
}

function shareWishlist() {
  navigator.clipboard.writeText(window.location.href)
  alert('📋 Đã sao chép link danh sách yêu thích!')
}

function addToWishlist(item) {
  wishlistItems.value.push({
    ...item,
    type: 'product',
    inStock: true,
    addedAt: 'Vừa xong'
  })
  alert('❤️ Đã thêm vào danh sách yêu thích!')
}
</script>

<style scoped>
.wishlist-page {
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

/* Stats */
.wishlist-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #a855f7;
  margin-bottom: 5px;
}

.stat-label {
  color: #888;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
}

.tab-btn {
  padding: 10px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 25px;
  color: #888;
  font-weight: 500;
  cursor: pointer;
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

.sort-options select {
  padding: 10px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
  cursor: pointer;
}

.sort-options select:focus {
  outline: none;
  border-color: #6b21a8;
}

/* Wishlist Grid */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.wishlist-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.wishlist-card:hover {
  border-color: #6b21a8;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.2);
}

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wishlist-card:hover .card-image img {
  transform: scale(1.05);
}

.item-type-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.item-type-badge.product {
  background: rgba(107, 33, 168, 0.9);
}

.item-type-badge.pet {
  background: rgba(249, 115, 22, 0.9);
}

.sale-badge {
  position: absolute;
  top: 15px;
  right: 60px;
  background: #dc2626;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.remove-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.card-content {
  padding: 20px;
}

.item-name {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f8f8f8;
  text-decoration: none;
  margin-bottom: 5px;
  transition: color 0.3s ease;
}

.item-name:hover {
  color: #a855f7;
}

.item-category {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f97316;
}

.old-price {
  color: #888;
  text-decoration: line-through;
}

.item-stock {
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.item-stock.in-stock {
  color: #22c55e;
}

.item-stock.out-stock {
  color: #ef4444;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(107, 33, 168, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6b21a8;
  color: #a855f7;
  padding: 12px 15px;
}

.btn-outline:hover {
  background: rgba(107, 33, 168, 0.1);
}

.btn-secondary {
  background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
  color: white;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.btn-ghost:hover {
  color: #f8f8f8;
  background: rgba(255, 255, 255, 0.15);
}

.card-footer {
  padding: 15px 20px;
  background: #0a0a0a;
  border-top: 1px solid #2d2d2d;
}

.added-date {
  color: #666;
  font-size: 0.85rem;
}

.added-date i {
  margin-right: 5px;
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

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 60px;
  padding-top: 30px;
  border-top: 1px solid #2d2d2d;
}

/* Recommendations */
.recommendations {
  margin-top: 60px;
}

.section-title {
  font-family: 'Creepster', cursive;
  font-size: 2rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 40px;
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

.product-card .card-image {
  height: 180px;
}

.add-wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-wishlist-btn:hover {
  background: #dc2626;
  color: white;
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
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wishlist-stats {
    flex-direction: column;
    gap: 20px;
  }

  .filter-bar {
    flex-direction: column;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
  }

  .empty-actions {
    flex-direction: column;
  }
}
</style>
