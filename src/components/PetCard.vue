<template>
  <div class="pet-card" @click="goToDetail">
    <!-- Badge -->
    <div class="card-badges">
      <span class="badge badge-spooky" v-if="pet.isSpecial">🎃 Special</span>
      <span class="badge badge-new" v-if="pet.isNew">Mới</span>
    </div>

    <!-- Image -->
    <div class="card-image-wrapper">
      <img :src="pet.image || '/placeholder-pet.jpg'" :alt="pet.name" class="card-image" />
      <div class="pet-status" :class="pet.status">
        {{ pet.status === 'available' ? '✓ Sẵn sàng' : '⏳ Đã đặt' }}
      </div>
    </div>

    <!-- Info -->
    <div class="card-body">
      <div class="pet-type">
        <i :class="getPetIcon(pet.type)"></i>
        {{ pet.type }}
      </div>
      
      <h3 class="card-title">{{ pet.name }}</h3>
      
      <div class="pet-info">
        <span><i class="fas fa-venus-mars"></i> {{ pet.gender === 'male' ? 'Đực' : 'Cái' }}</span>
        <span><i class="fas fa-birthday-cake"></i> {{ pet.age }}</span>
      </div>

      <p class="pet-breed">{{ pet.breed }}</p>

      <!-- Price -->
      <div class="card-price-wrapper">
        <span class="card-price">{{ formatPrice(pet.price) }}</span>
      </div>

      <!-- Action Button -->
      <button 
        class="btn btn-primary btn-full" 
        @click.stop="contactNow"
        :disabled="pet.status !== 'available'"
      >
        <i class="fas fa-phone"></i> 
        {{ pet.status === 'available' ? 'Liên hệ ngay' : 'Đã có người đặt' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  pet: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function getPetIcon(type) {
  const icons = {
    'Chó': 'fas fa-dog',
    'Mèo': 'fas fa-cat',
    'Chim': 'fas fa-dove',
    'Cá': 'fas fa-fish',
    'Hamster': 'fas fa-paw',
    'Thỏ': 'fas fa-rabbit'
  }
  return icons[type] || 'fas fa-paw'
}

function goToDetail() {
  router.push(`/pets/${props.pet.id}`)
}

function contactNow() {
  router.push(`/pets/${props.pet.id}`)
}
</script>

<style scoped>
.pet-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 2px solid #2d2d2d;
  cursor: pointer;
  position: relative;
}

.pet-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 
    0 25px 50px rgba(107, 33, 168, 0.4),
    0 0 30px rgba(220, 38, 38, 0.2);
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
  height: 280px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.pet-card:hover .card-image {
  transform: scale(1.15);
}

.pet-status {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.pet-status.available {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.pet-status.reserved {
  background: rgba(249, 115, 22, 0.9);
  color: white;
}

.card-body {
  padding: 25px;
}

.pet-type {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: rgba(107, 33, 168, 0.2);
  border: 1px solid #6b21a8;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #a855f7;
  text-transform: uppercase;
}

.card-title {
  font-size: 1.4rem;
  margin: 15px 0 10px;
  color: #f8f8f8;
  font-family: 'Creepster', cursive;
  letter-spacing: 1px;
}

.pet-info {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: #888;
  font-size: 0.9rem;
}

.pet-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-info i {
  color: #dc2626;
}

.pet-breed {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-price-wrapper {
  margin-bottom: 15px;
}

.card-price {
  font-size: 1.6rem;
  font-weight: 700;
  color: #f97316;
  text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
}

.btn-full {
  width: 100%;
}

.btn-full:disabled {
  background: #404040;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
