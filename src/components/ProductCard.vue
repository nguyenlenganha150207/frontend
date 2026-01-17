<template>
  <div class="product-card" @click="goToDetail">
    <!-- Badge -->
    <div class="card-badges">
      <span class="badge badge-sale" v-if="product.salePrice">-{{ discountPercent }}%</span>
      <span class="badge badge-new" v-if="product.isNew">Mới</span>
      <span class="badge badge-hot" v-if="product.isHot">Hot 🔥</span>
    </div>

    <!-- Image -->
    <div class="card-image-wrapper">
      <img :src="product.image || '/placeholder.jpg'" :alt="product.name" class="card-image" />
      <div class="card-overlay">
        <button class="overlay-btn" @click.stop="addToCart" title="Thêm vào giỏ">
          <i class="fas fa-cart-plus"></i>
        </button>
        <button class="overlay-btn" @click.stop="toggleWishlist" title="Yêu thích">
          <i :class="isWishlisted ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>
        <button class="overlay-btn" @click.stop="quickView" title="Xem nhanh">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="card-body">
      <span class="card-category">{{ product.category }}</span>
      <h3 class="card-title">{{ product.name }}</h3>
      
      <!-- Rating -->
      <div class="card-rating">
        <div class="stars">
          <i v-for="n in 5" :key="n" 
             :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'">
          </i>
        </div>
        <span class="rating-count">({{ product.reviewCount || 0 }})</span>
      </div>

      <!-- Price -->
      <div class="card-price-wrapper">
        <span class="card-price">{{ formatPrice(product.salePrice || product.price) }}</span>
        <span class="card-price-old" v-if="product.salePrice">{{ formatPrice(product.price) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['quick-view'])

const router = useRouter()
const cartStore = useCartStore()
const isWishlisted = ref(false)

const discountPercent = computed(() => {
  if (props.product.salePrice && props.product.price) {
    return Math.round((1 - props.product.salePrice / props.product.price) * 100)
  }
  return 0
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function goToDetail() {
  router.push(`/products/${props.product.id}`)
}

function addToCart() {
  cartStore.addItem(props.product)
}

function toggleWishlist() {
  isWishlisted.value = !isWishlisted.value
}

function quickView() {
  emit('quick-view', props.product)
}
</script>

<style scoped>
.product-card {
  background: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid #2d2d2d;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(107, 33, 168, 0.3);
  border-color: #6b21a8;
}

.card-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 250px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.product-card:hover .card-overlay {
  transform: translateY(0);
}

.overlay-btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(107, 33, 168, 0.8);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.overlay-btn .fa-heart {
  color: #dc2626;
}

.card-body {
  padding: 20px;
}

.card-category {
  font-size: 0.8rem;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-title {
  font-size: 1.1rem;
  margin: 10px 0;
  color: #f8f8f8;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.stars {
  display: flex;
  gap: 3px;
}

.stars i {
  color: #f97316;
  font-size: 0.85rem;
}

.rating-count {
  color: #666;
  font-size: 0.85rem;
}

.card-price-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f97316;
}

.card-price-old {
  font-size: 1rem;
  color: #666;
  text-decoration: line-through;
}
</style>
