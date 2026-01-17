<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">🏠 Trang chủ</router-link>
        <span>/</span>
        <router-link to="/products">Sản phẩm</router-link>
        <span>/</span>
        <span class="current">{{ product.name }}</span>
      </nav>

      <div class="product-layout">
        <!-- Product Images -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="selectedImage || product.images[0]" :alt="product.name" />
            <span class="sale-badge" v-if="product.salePrice">-{{ discountPercent }}%</span>
            <button class="wishlist-btn" @click="toggleWishlist" :class="{ active: isWishlisted }">
              <i :class="isWishlisted ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>
          <div class="thumbnail-list">
            <div 
              class="thumbnail" 
              v-for="(img, index) in product.images" 
              :key="index"
              :class="{ active: selectedImage === img }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`${product.name} ${index + 1}`" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <div class="product-category">
            <span class="category-tag">{{ product.category }}</span>
            <span class="stock-status" :class="product.stock > 0 ? 'in-stock' : 'out-stock'">
              {{ product.stock > 0 ? '✓ Còn hàng' : '✗ Hết hàng' }}
            </span>
          </div>

          <h1 class="product-name">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="product-rating">
            <div class="stars">
              <i v-for="n in 5" :key="n" :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
            </div>
            <span class="rating-count">({{ product.reviewCount }} đánh giá)</span>
            <span class="sold-count">| Đã bán {{ product.soldCount }}</span>
          </div>

          <!-- Price -->
          <div class="product-price">
            <span class="current-price">{{ formatPrice(product.salePrice || product.price) }}</span>
            <span class="old-price" v-if="product.salePrice">{{ formatPrice(product.price) }}</span>
            <span class="discount-tag" v-if="product.salePrice">Tiết kiệm {{ formatPrice(product.price - product.salePrice) }}</span>
          </div>

          <!-- Variants -->
          <div class="product-variants" v-if="product.variants && product.variants.length > 0">
            <h4>Loại sản phẩm:</h4>
            <div class="variant-options">
              <button 
                v-for="variant in product.variants" 
                :key="variant.id"
                :class="['variant-btn', { active: selectedVariant === variant.id }]"
                @click="selectedVariant = variant.id"
              >
                {{ variant.name }}
              </button>
            </div>
          </div>

          <!-- Size -->
          <div class="product-size" v-if="product.sizes && product.sizes.length > 0">
            <h4>Kích thước:</h4>
            <div class="size-options">
              <button 
                v-for="size in product.sizes" 
                :key="size"
                :class="['size-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="quantity-section">
            <h4>Số lượng:</h4>
            <div class="quantity-control">
              <button @click="quantity > 1 && quantity--" :disabled="quantity <= 1">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" v-model.number="quantity" min="1" :max="product.stock" />
              <button @click="quantity < product.stock && quantity++" :disabled="quantity >= product.stock">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <span class="stock-info">{{ product.stock }} sản phẩm có sẵn</span>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-primary btn-lg" @click="addToCart" :disabled="product.stock === 0">
              <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
            <button class="btn btn-secondary btn-lg" @click="buyNow" :disabled="product.stock === 0">
              <i class="fas fa-bolt"></i> Mua ngay
            </button>
          </div>

          <!-- Promotion -->
          <div class="promotion-box">
            <h4>🎃 Ưu đãi Halloween:</h4>
            <ul>
              <li><i class="fas fa-gift"></i> Giảm 10% cho đơn hàng từ 500K</li>
              <li><i class="fas fa-truck"></i> Miễn phí vận chuyển từ 300K</li>
              <li><i class="fas fa-undo"></i> Đổi trả trong 7 ngày</li>
              <li><i class="fas fa-shield-alt"></i> Bảo hành 30 ngày</li>
            </ul>
          </div>

          <!-- Share -->
          <div class="share-section">
            <span>Chia sẻ:</span>
            <div class="share-buttons">
              <button class="share-btn facebook"><i class="fab fa-facebook-f"></i></button>
              <button class="share-btn twitter"><i class="fab fa-twitter"></i></button>
              <button class="share-btn pinterest"><i class="fab fa-pinterest-p"></i></button>
              <button class="share-btn copy" @click="copyLink"><i class="fas fa-link"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="product-tabs">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="tab-pane">
            <h3>Mô tả sản phẩm</h3>
            <div class="description-content" v-html="product.description"></div>
            
            <div class="features-grid">
              <div class="feature-item" v-for="feature in product.features" :key="feature.label">
                <span class="feature-icon">{{ feature.icon }}</span>
                <div class="feature-info">
                  <strong>{{ feature.label }}</strong>
                  <span>{{ feature.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specs'" class="tab-pane">
            <h3>Thông số kỹ thuật</h3>
            <table class="specs-table">
              <tr v-for="spec in product.specifications" :key="spec.label">
                <td class="spec-label">{{ spec.label }}</td>
                <td class="spec-value">{{ spec.value }}</td>
              </tr>
            </table>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-pane">
            <div class="reviews-summary">
              <div class="rating-overview">
                <div class="big-rating">
                  <span class="rating-number">{{ product.rating }}</span>
                  <span class="rating-total">/5</span>
                </div>
                <div class="stars">
                  <i v-for="n in 5" :key="n" :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
                </div>
                <span class="total-reviews">{{ product.reviewCount }} đánh giá</span>
              </div>
              
              <div class="rating-bars">
                <div class="rating-bar" v-for="n in 5" :key="n">
                  <span>{{ 6 - n }} <i class="fas fa-star"></i></span>
                  <div class="bar">
                    <div class="fill" :style="{ width: getRatingPercent(6 - n) + '%' }"></div>
                  </div>
                  <span class="percent">{{ getRatingPercent(6 - n) }}%</span>
                </div>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div class="review-item" v-for="review in reviews" :key="review.id">
                <div class="review-header">
                  <img :src="review.avatar" :alt="review.name" class="reviewer-avatar" />
                  <div class="reviewer-info">
                    <strong>{{ review.name }}</strong>
                    <div class="review-stars">
                      <i v-for="n in 5" :key="n" :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                    </div>
                  </div>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <div class="review-images" v-if="review.images && review.images.length > 0">
                  <img v-for="(img, idx) in review.images" :key="idx" :src="img" alt="Review image" />
                </div>
                <div class="review-actions">
                  <button><i class="far fa-thumbs-up"></i> Hữu ích ({{ review.helpful }})</button>
                  <button><i class="far fa-comment"></i> Trả lời</button>
                </div>
              </div>
            </div>

            <!-- Write Review -->
            <div class="write-review">
              <h4>Viết đánh giá của bạn</h4>
              <div class="review-form">
                <div class="rating-select">
                  <span>Đánh giá:</span>
                  <div class="star-select">
                    <i 
                      v-for="n in 5" 
                      :key="n" 
                      :class="n <= newReview.rating ? 'fas fa-star' : 'far fa-star'"
                      @click="newReview.rating = n"
                    ></i>
                  </div>
                </div>
                <textarea v-model="newReview.content" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."></textarea>
                <button class="btn btn-primary" @click="submitReview">
                  <i class="fas fa-paper-plane"></i> Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-products">
        <h2 class="section-title spooky-title">🎃 Sản Phẩm Liên Quan</h2>
        <div class="products-grid">
          <div class="product-card" v-for="item in relatedProducts" :key="item.id">
            <router-link :to="`/products/${item.id}`">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" />
                <span class="sale-badge" v-if="item.salePrice">-{{ Math.round((1 - item.salePrice / item.price) * 100) }}%</span>
              </div>
              <div class="card-content">
                <h4>{{ item.name }}</h4>
                <div class="card-price">
                  <span class="current">{{ formatPrice(item.salePrice || item.price) }}</span>
                  <span class="old" v-if="item.salePrice">{{ formatPrice(item.price) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const selectedImage = ref(null)
const selectedVariant = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)
const activeTab = ref('description')
const isWishlisted = ref(false)

const tabs = [
  { id: 'description', label: 'Mô tả', icon: '📝' },
  { id: 'specs', label: 'Thông số', icon: '📋' },
  { id: 'reviews', label: 'Đánh giá', icon: '⭐' }
]

const newReview = ref({
  rating: 5,
  content: ''
})

// Demo product data
const product = ref({
  id: 1,
  name: 'Áo Choàng Dracula Cho Chó - Halloween Edition',
  category: 'Phụ kiện thú cưng',
  price: 350000,
  salePrice: 280000,
  stock: 50,
  rating: 4.5,
  reviewCount: 128,
  soldCount: 256,
  images: [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
    'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600'
  ],
  variants: [
    { id: 1, name: 'Đỏ đen' },
    { id: 2, name: 'Tím đen' },
    { id: 3, name: 'Cam đen' }
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  description: `
    <p>Áo choàng Dracula thiết kế độc đáo cho thú cưng của bạn trong mùa Halloween! 🎃🦇</p>
    <p>Sản phẩm được làm từ chất liệu vải cao cấp, an toàn cho da thú cưng, thoáng mát và dễ dàng vệ sinh.</p>
    <ul>
      <li>Chất liệu: Polyester cao cấp</li>
      <li>Thiết kế: Áo choàng Dracula với cổ đứng</li>
      <li>Màu sắc: Đỏ đen, Tím đen, Cam đen</li>
      <li>Phù hợp: Chó mọi giống loại</li>
    </ul>
  `,
  features: [
    { icon: '🧵', label: 'Chất liệu', value: 'Polyester cao cấp' },
    { icon: '🐕', label: 'Phù hợp', value: 'Chó 3-30kg' },
    { icon: '🧼', label: 'Vệ sinh', value: 'Giặt máy được' },
    { icon: '🎨', label: 'Màu sắc', value: '3 màu Halloween' }
  ],
  specifications: [
    { label: 'Thương hiệu', value: 'Halloween Pet Store' },
    { label: 'Xuất xứ', value: 'Việt Nam' },
    { label: 'Chất liệu', value: '100% Polyester' },
    { label: 'Trọng lượng', value: '150g' },
    { label: 'Kích thước S', value: 'Dài 25cm, Cổ 20cm' },
    { label: 'Kích thước M', value: 'Dài 30cm, Cổ 25cm' },
    { label: 'Kích thước L', value: 'Dài 35cm, Cổ 30cm' },
    { label: 'Kích thước XL', value: 'Dài 40cm, Cổ 35cm' }
  ]
})

const reviews = ref([
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    date: '28/10/2024',
    content: 'Sản phẩm rất đẹp, chất liệu tốt. Bé nhà mình mặc vừa vặn và trông rất đáng yêu! Sẽ ủng hộ shop tiếp.',
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200'],
    helpful: 24
  },
  {
    id: 2,
    name: 'Trần Văn Hùng',
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 4,
    date: '25/10/2024',
    content: 'Áo đẹp, giao hàng nhanh. Chỉ tiếc là màu hơi khác so với hình một chút nhưng vẫn ổn.',
    images: [],
    helpful: 12
  },
  {
    id: 3,
    name: 'Lê Thị Hương',
    avatar: 'https://i.pravatar.cc/100?img=3',
    rating: 5,
    date: '20/10/2024',
    content: 'Đóng gói cẩn thận, sản phẩm đúng mô tả. Bé Corgi nhà mình mặc size M vừa đẹp luôn! 🎃',
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200'],
    helpful: 18
  }
])

const relatedProducts = ref([
  { id: 2, name: 'Mũ Phù Thủy Cho Mèo', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300', price: 150000, salePrice: 120000 },
  { id: 3, name: 'Vòng Cổ Bí Ngô', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300', price: 80000, salePrice: null },
  { id: 4, name: 'Đồ Chơi Dơi Ma', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300', price: 65000, salePrice: 50000 },
  { id: 5, name: 'Giường Quan Tài', image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=300', price: 550000, salePrice: 450000 }
])

const discountPercent = computed(() => {
  if (!product.value.salePrice) return 0
  return Math.round((1 - product.value.salePrice / product.value.price) * 100)
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function getRatingPercent(star) {
  const percents = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 }
  return percents[star] || 0
}

function toggleWishlist() {
  isWishlisted.value = !isWishlisted.value
  if (isWishlisted.value) {
    alert('❤️ Đã thêm vào danh sách yêu thích!')
  } else {
    alert('Đã xóa khỏi danh sách yêu thích!')
  }
}

function addToCart() {
  cartStore.addItem({
    ...product.value,
    image: product.value.images[0],
    variant: selectedVariant.value,
    size: selectedSize.value
  }, quantity.value)
  alert('🛒 Đã thêm vào giỏ hàng!')
}

function buyNow() {
  addToCart()
  router.push('/checkout')
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('📋 Đã sao chép link sản phẩm!')
}

function submitReview() {
  if (!newReview.value.content) {
    alert('Vui lòng nhập nội dung đánh giá!')
    return
  }
  alert('✅ Cảm ơn bạn đã đánh giá sản phẩm!')
  newReview.value = { rating: 5, content: '' }
}

onMounted(() => {
  // Fetch product detail from API
  // const productId = route.params.id
  // productsAPI.getById(productId).then(res => product.value = res.data)
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 30px 0 80px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.breadcrumb a {
  color: #888;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: #a855f7;
}

.breadcrumb .current {
  color: #a855f7;
  font-weight: 500;
}

/* Product Layout */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
}

/* Product Gallery */
.product-gallery {
  position: sticky;
  top: 100px;
}

.main-image {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 15px;
  background: #1a1a1a;
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.sale-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 700;
}

.wishlist-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background: #dc2626;
  color: white;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #6b21a8;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  padding: 20px 0;
}

.product-category {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.category-tag {
  background: rgba(107, 33, 168, 0.2);
  color: #a855f7;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.stock-status {
  font-size: 0.9rem;
  font-weight: 500;
}

.stock-status.in-stock {
  color: #22c55e;
}

.stock-status.out-stock {
  color: #ef4444;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #f8f8f8;
  margin-bottom: 15px;
  line-height: 1.3;
}

/* Rating */
.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.stars {
  color: #fbbf24;
}

.rating-count,
.sold-count {
  color: #888;
  font-size: 0.9rem;
}

/* Price */
.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(107, 33, 168, 0.1);
  border-radius: 15px;
  margin-bottom: 25px;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #f97316;
}

.old-price {
  font-size: 1.2rem;
  color: #888;
  text-decoration: line-through;
}

.discount-tag {
  background: #dc2626;
  color: white;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 0.85rem;
}

/* Variants & Sizes */
.product-variants,
.product-size {
  margin-bottom: 25px;
}

.product-variants h4,
.product-size h4,
.quantity-section h4 {
  color: #a855f7;
  margin-bottom: 12px;
  font-size: 1rem;
}

.variant-options,
.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.variant-btn,
.size-btn {
  padding: 10px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.variant-btn:hover,
.variant-btn.active,
.size-btn:hover,
.size-btn.active {
  border-color: #6b21a8;
  background: rgba(107, 33, 168, 0.2);
  color: #a855f7;
}

/* Quantity */
.quantity-section {
  margin-bottom: 30px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.quantity-control button {
  width: 40px;
  height: 40px;
  border: 1px solid #2d2d2d;
  background: #1a1a1a;
  color: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-control button:hover:not(:disabled) {
  border-color: #6b21a8;
  color: #a855f7;
}

.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control input {
  width: 80px;
  height: 40px;
  text-align: center;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: #f8f8f8;
  font-size: 1rem;
}

.stock-info {
  color: #888;
  font-size: 0.9rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1;
}

.btn-lg {
  padding: 18px 35px;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Promotion Box */
.promotion-box {
  padding: 20px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px dashed #f97316;
  border-radius: 15px;
  margin-bottom: 25px;
}

.promotion-box h4 {
  color: #f97316;
  margin-bottom: 15px;
}

.promotion-box ul {
  list-style: none;
}

.promotion-box li {
  padding: 8px 0;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 10px;
}

.promotion-box li i {
  color: #f97316;
}

/* Share */
.share-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.share-section span {
  color: #888;
}

.share-buttons {
  display: flex;
  gap: 10px;
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.share-btn.facebook { background: #1877f2; }
.share-btn.twitter { background: #1da1f2; }
.share-btn.pinterest { background: #e60023; }
.share-btn.copy { background: #6b21a8; }

.share-btn:hover {
  transform: scale(1.1);
}

/* Product Tabs */
.product-tabs {
  background: #1a1a1a;
  border-radius: 20px;
  margin-bottom: 60px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #2d2d2d;
}

.tab-btn {
  flex: 1;
  padding: 20px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #a855f7;
}

.tab-btn.active {
  color: #f97316;
  background: rgba(249, 115, 22, 0.1);
  border-bottom: 3px solid #f97316;
}

.tab-content {
  padding: 30px;
}

.tab-pane h3 {
  color: #a855f7;
  margin-bottom: 20px;
}

.description-content {
  color: #ccc;
  line-height: 1.8;
  margin-bottom: 30px;
}

.description-content ul {
  margin-left: 20px;
  margin-top: 15px;
}

.description-content li {
  margin: 8px 0;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #0a0a0a;
  border-radius: 15px;
}

.feature-icon {
  font-size: 2rem;
}

.feature-info strong {
  display: block;
  color: #a855f7;
  margin-bottom: 5px;
}

.feature-info span {
  color: #888;
  font-size: 0.9rem;
}

/* Specs Table */
.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #2d2d2d;
}

.specs-table td {
  padding: 15px;
}

.spec-label {
  color: #888;
  width: 200px;
}

.spec-value {
  color: #f8f8f8;
}

/* Reviews */
.reviews-summary {
  display: flex;
  gap: 50px;
  padding: 30px;
  background: #0a0a0a;
  border-radius: 15px;
  margin-bottom: 30px;
}

.rating-overview {
  text-align: center;
}

.big-rating {
  margin-bottom: 10px;
}

.rating-number {
  font-size: 3rem;
  font-weight: 700;
  color: #f97316;
}

.rating-total {
  font-size: 1.5rem;
  color: #888;
}

.rating-overview .stars {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.total-reviews {
  color: #888;
}

.rating-bars {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.rating-bar span:first-child {
  width: 50px;
  color: #888;
}

.bar {
  flex: 1;
  height: 8px;
  background: #2d2d2d;
  border-radius: 4px;
  overflow: hidden;
}

.bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  border-radius: 4px;
}

.percent {
  width: 50px;
  text-align: right;
  color: #888;
}

/* Reviews List */
.reviews-list {
  margin-bottom: 30px;
}

.review-item {
  padding: 25px;
  border-bottom: 1px solid #2d2d2d;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-info {
  flex: 1;
}

.reviewer-info strong {
  display: block;
  color: #f8f8f8;
  margin-bottom: 5px;
}

.review-stars {
  color: #fbbf24;
  font-size: 0.9rem;
}

.review-date {
  color: #888;
  font-size: 0.9rem;
}

.review-content {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 15px;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.review-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}

.review-actions {
  display: flex;
  gap: 20px;
}

.review-actions button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;
}

.review-actions button:hover {
  color: #a855f7;
}

/* Write Review */
.write-review {
  padding: 25px;
  background: #0a0a0a;
  border-radius: 15px;
}

.write-review h4 {
  color: #a855f7;
  margin-bottom: 20px;
}

.rating-select {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.rating-select span {
  color: #888;
}

.star-select {
  color: #fbbf24;
  font-size: 1.5rem;
}

.star-select i {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star-select i:hover {
  transform: scale(1.2);
}

.review-form textarea {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #f8f8f8;
  resize: vertical;
  margin-bottom: 15px;
}

.review-form textarea:focus {
  outline: none;
  border-color: #6b21a8;
}

/* Related Products */
.related-products {
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

.product-card a {
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

.product-card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  padding: 20px;
}

.card-content h4 {
  color: #f8f8f8;
  margin-bottom: 10px;
  font-size: 1rem;
}

.card-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-price .current {
  color: #f97316;
  font-weight: 700;
}

.card-price .old {
  color: #888;
  text-decoration: line-through;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    position: static;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .reviews-summary {
    flex-direction: column;
    gap: 30px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
