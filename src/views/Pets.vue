<template>
  <div class="pets-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="spooky-title">🦇 Thú Cưng</h1>
        <p>Tìm người bạn đồng hành hoàn hảo cho bạn</p>
      </div>
    </div>

    <div class="container">
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          :class="{ active: activeType === 'all' }"
          @click="activeType = 'all'"
        >
          <span class="tab-icon">🐾</span> Tất Cả
        </button>
        <button 
          :class="{ active: activeType === 'dog' }"
          @click="activeType = 'dog'"
        >
          <span class="tab-icon">🐕</span> Chó
        </button>
        <button 
          :class="{ active: activeType === 'cat' }"
          @click="activeType = 'cat'"
        >
          <span class="tab-icon">🐈</span> Mèo
        </button>
        <button 
          :class="{ active: activeType === 'bird' }"
          @click="activeType = 'bird'"
        >
          <span class="tab-icon">🐦</span> Chim
        </button>
        <button 
          :class="{ active: activeType === 'other' }"
          @click="activeType = 'other'"
        >
          <span class="tab-icon">🐹</span> Khác
        </button>
      </div>

      <!-- Sort & View -->
      <div class="pets-toolbar">
        <div class="results-info">
          <span>Tìm thấy <strong>{{ filteredPets.length }}</strong> thú cưng</span>
        </div>
        <div class="toolbar-actions">
          <select v-model="sortBy" class="sort-select">
            <option value="newest">Mới nhất</option>
            <option value="price-low">Giá: Thấp → Cao</option>
            <option value="price-high">Giá: Cao → Thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      <!-- Pets Grid -->
      <div class="pets-grid" v-if="!loading">
        <PetCard 
          v-for="pet in filteredPets" 
          :key="pet.id" 
          :pet="pet"
        />
      </div>

      <!-- Loading -->
      <div class="loading-grid" v-else>
        <div class="skeleton-pet" v-for="n in 8" :key="n">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-if="!loading && filteredPets.length === 0">
        <div class="empty-icon">🦇</div>
        <h3>Chưa có thú cưng nào</h3>
        <p>Hãy quay lại sau nhé!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PetCard from '../components/PetCard.vue'
import { petsAPI } from '../api'

const route = useRoute()
const loading = ref(false)
const activeType = ref('all')
const sortBy = ref('newest')
const pets = ref([])

// Mock data
const mockPets = [
  { id: 1, name: 'Shadow', type: 'Chó', typeKey: 'dog', breed: 'Husky Siberian', age: '3 tháng', gender: 'male', price: 15000000, image: 'https://images.unsplash.com/photo-1617895153857-3cfa232f4b03?w=400', status: 'available', isSpecial: true },
  { id: 2, name: 'Midnight', type: 'Mèo', typeKey: 'cat', breed: 'Mèo Anh Lông Ngắn', age: '2 tháng', gender: 'female', price: 8000000, image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400', status: 'available', isNew: true },
  { id: 3, name: 'Pumpkin', type: 'Chó', typeKey: 'dog', breed: 'Corgi', age: '4 tháng', gender: 'male', price: 12000000, image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400', status: 'available', isSpecial: true },
  { id: 4, name: 'Ghost', type: 'Mèo', typeKey: 'cat', breed: 'Mèo Ba Tư', age: '5 tháng', gender: 'female', price: 10000000, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400', status: 'reserved' },
  { id: 5, name: 'Thunder', type: 'Chó', typeKey: 'dog', breed: 'Golden Retriever', age: '3 tháng', gender: 'male', price: 18000000, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', status: 'available' },
  { id: 6, name: 'Luna', type: 'Mèo', typeKey: 'cat', breed: 'Scottish Fold', age: '4 tháng', gender: 'female', price: 12000000, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', status: 'available', isNew: true },
  { id: 7, name: 'Tweety', type: 'Chim', typeKey: 'bird', breed: 'Vẹt Cockatiel', age: '6 tháng', gender: 'male', price: 3500000, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400', status: 'available' },
  { id: 8, name: 'Hammy', type: 'Hamster', typeKey: 'other', breed: 'Hamster Winter White', age: '2 tháng', gender: 'male', price: 150000, image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400', status: 'available' }
]

const filteredPets = computed(() => {
  let result = [...pets.value]
  
  // Filter by type
  if (activeType.value !== 'all') {
    result = result.filter(p => p.typeKey === activeType.value)
  }
  
  // Sort
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  
  return result
})

onMounted(async () => {
  loading.value = true
  
  // Check route query
  if (route.query.type) {
    activeType.value = route.query.type
  }
  
  try {
    // const response = await petsAPI.getAll()
    // pets.value = response.data
    pets.value = mockPets
  } catch (error) {
    pets.value = mockPets
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.pets-page {
  min-height: 100vh;
  padding-bottom: 60px;
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

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.filter-tabs button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: #1a1a1a;
  border: 2px solid #2d2d2d;
  border-radius: 50px;
  color: #b0b0b0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tabs button:hover {
  border-color: #6b21a8;
  color: white;
}

.filter-tabs button.active {
  background: linear-gradient(135deg, #6b21a8 0%, #dc2626 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.4);
}

.tab-icon {
  font-size: 1.3rem;
}

.pets-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 25px;
  background: #1a1a1a;
  border-radius: 15px;
  border: 1px solid #2d2d2d;
}

.results-info {
  color: #888;
}

.results-info strong {
  color: #a855f7;
}

.sort-select {
  padding: 12px 40px 12px 20px;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23a855f7' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.skeleton-pet {
  background: #1a1a1a;
  border-radius: 25px;
  padding: 20px;
}

.skeleton-img {
  height: 250px;
  border-radius: 15px;
  margin-bottom: 15px;
}

.skeleton-text {
  height: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.skeleton-text.short {
  width: 60%;
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.empty-state h3 {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
}

@media (max-width: 1200px) {
  .pets-grid,
  .loading-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .pets-grid,
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .pets-grid,
  .loading-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs button {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
  
  .pets-toolbar {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
