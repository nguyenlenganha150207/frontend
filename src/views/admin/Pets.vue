<template>
  <div class="admin-pets">
    <!-- Header Actions -->
    <div class="page-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm thú cưng..." />
        </div>
        <select v-model="filterType" class="filter-select">
          <option value="">Loại thú cưng</option>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="bird">Chim</option>
          <option value="other">Khác</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Trạng thái</option>
          <option value="available">Có sẵn</option>
          <option value="reserved">Đã đặt</option>
          <option value="sold">Đã bán</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm thú cưng
      </button>
    </div>

    <!-- Pets Grid -->
    <div class="pets-grid">
      <div class="pet-card" v-for="pet in filteredPets" :key="pet.id">
        <div class="pet-image">
          <img :src="pet.image" :alt="pet.name" />
          <span class="pet-type">{{ pet.type }}</span>
          <span class="pet-status" :class="pet.status">{{ getStatusText(pet.status) }}</span>
        </div>
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p class="pet-breed">{{ pet.breed }}</p>
          <div class="pet-details">
            <span><i class="fas fa-birthday-cake"></i> {{ pet.age }}</span>
            <span><i class="fas fa-venus-mars"></i> {{ pet.gender === 'male' ? 'Đực' : 'Cái' }}</span>
          </div>
          <div class="pet-price">{{ formatPrice(pet.price) }}</div>
        </div>
        <div class="pet-actions">
          <button class="action-btn edit" @click="editPet(pet)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn view" @click="viewPet(pet)">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn delete" @click="deletePet(pet)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingPet ? 'Sửa thông tin thú cưng' : 'Thêm thú cưng mới' }}</h3>
          <button class="close-btn" @click="showAddModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Tên thú cưng *</label>
              <input type="text" v-model="form.name" placeholder="VD: Shadow" />
            </div>
            <div class="form-group">
              <label>Loại *</label>
              <select v-model="form.type">
                <option value="">Chọn loại</option>
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
                <option value="Chim">Chim</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Giống *</label>
              <input type="text" v-model="form.breed" placeholder="VD: Husky Siberian" />
            </div>
            <div class="form-group">
              <label>Tuổi</label>
              <input type="text" v-model="form.age" placeholder="VD: 3 tháng" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="form.gender">
                <option value="male">Đực</option>
                <option value="female">Cái</option>
              </select>
            </div>
            <div class="form-group">
              <label>Giá (VNĐ) *</label>
              <input type="number" v-model="form.price" placeholder="0" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="form.status">
                <option value="available">Có sẵn</option>
                <option value="reserved">Đã đặt</option>
                <option value="sold">Đã bán</option>
              </select>
            </div>
            <div class="form-group">
              <label>Hình ảnh URL</label>
              <input type="text" v-model="form.image" placeholder="https://..." />
            </div>
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="form.description" rows="3" placeholder="Mô tả thú cưng..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal = false">Hủy</button>
          <button class="btn btn-primary" @click="savePet">
            <i class="fas fa-save"></i> {{ editingPet ? 'Cập nhật' : 'Thêm mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const editingPet = ref(null)

const form = ref({
  name: '',
  type: '',
  breed: '',
  age: '',
  gender: 'male',
  price: '',
  status: 'available',
  image: '',
  description: ''
})

const pets = ref([
  { id: 1, name: 'Shadow', type: 'Chó', breed: 'Husky Siberian', age: '3 tháng', gender: 'male', price: 15000000, status: 'available', image: 'https://images.unsplash.com/photo-1617895153857-3cfa232f4b03?w=400' },
  { id: 2, name: 'Midnight', type: 'Mèo', breed: 'Mèo Anh Lông Ngắn', age: '2 tháng', gender: 'female', price: 8000000, status: 'available', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400' },
  { id: 3, name: 'Pumpkin', type: 'Chó', breed: 'Corgi', age: '4 tháng', gender: 'male', price: 12000000, status: 'reserved', image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400' },
  { id: 4, name: 'Ghost', type: 'Mèo', breed: 'Mèo Ba Tư', age: '5 tháng', gender: 'female', price: 10000000, status: 'sold', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400' },
  { id: 5, name: 'Vampire', type: 'Chó', breed: 'Poodle', age: '6 tháng', gender: 'male', price: 9000000, status: 'available', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
  { id: 6, name: 'Luna', type: 'Mèo', breed: 'Scottish Fold', age: '3 tháng', gender: 'female', price: 12000000, status: 'available', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' }
])

const filteredPets = computed(() => {
  return pets.value.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.breed.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !filterType.value || p.type.toLowerCase() === filterType.value
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    return matchSearch && matchType && matchStatus
  })
})

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function getStatusText(status) {
  const texts = { available: 'Có sẵn', reserved: 'Đã đặt', sold: 'Đã bán' }
  return texts[status]
}

function editPet(pet) {
  editingPet.value = pet
  form.value = { ...pet }
  showAddModal.value = true
}

function viewPet(pet) {
  window.open(`/pets/${pet.id}`, '_blank')
}

function deletePet(pet) {
  if (confirm(`Bạn có chắc muốn xóa "${pet.name}"?`)) {
    pets.value = pets.value.filter(p => p.id !== pet.id)
  }
}

function savePet() {
  if (editingPet.value) {
    const index = pets.value.findIndex(p => p.id === editingPet.value.id)
    pets.value[index] = { ...form.value }
  } else {
    pets.value.push({ ...form.value, id: Date.now() })
  }
  showAddModal.value = false
  resetForm()
}

function resetForm() {
  form.value = { name: '', type: '', breed: '', age: '', gender: 'male', price: '', status: 'available', image: '', description: '' }
  editingPet.value = null
}
</script>

<style scoped>
.admin-pets {
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

/* Pets Grid */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.pet-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.pet-card:hover {
  border-color: #6b21a8;
  transform: translateY(-5px);
}

.pet-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-type {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(107, 33, 168, 0.9);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.pet-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.pet-status.available { background: rgba(34, 197, 94, 0.9); color: white; }
.pet-status.reserved { background: rgba(245, 158, 11, 0.9); color: white; }
.pet-status.sold { background: rgba(156, 163, 175, 0.9); color: white; }

.pet-info {
  padding: 20px;
}

.pet-info h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.pet-breed {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.pet-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.pet-details span {
  color: #666;
  font-size: 0.85rem;
}

.pet-details i {
  margin-right: 5px;
  color: #a855f7;
}

.pet-price {
  color: #22c55e;
  font-size: 1.2rem;
  font-weight: 700;
}

.pet-actions {
  display: flex;
  gap: 10px;
  padding: 0 20px 20px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn.edit { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.action-btn.view { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.action-btn.delete { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.action-btn:hover { transform: scale(1.05); }

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
}

.modal {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
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

.modal-header h3 { color: white; }

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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 25px;
  border-top: 1px solid #2d2d2d;
}
</style>
