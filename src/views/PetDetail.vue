<template>
  <div class="pet-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">🏠 Trang chủ</router-link>
        <span>/</span>
        <router-link to="/pets">Thú cưng</router-link>
        <span>/</span>
        <span class="current">{{ pet.name }}</span>
      </nav>

      <div class="pet-layout">
        <!-- Pet Gallery -->
        <div class="pet-gallery">
          <div class="main-image">
            <img :src="selectedImage || pet.images[0]" :alt="pet.name" />
            <div class="pet-badges">
              <span class="badge vaccinated" v-if="pet.vaccinated">
                <i class="fas fa-syringe"></i> Đã tiêm phòng
              </span>
              <span class="badge verified">
                <i class="fas fa-check-circle"></i> Đã xác thực
              </span>
            </div>
            <button class="wishlist-btn" @click="toggleWishlist" :class="{ active: isWishlisted }">
              <i :class="isWishlisted ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>
          <div class="thumbnail-list">
            <div 
              class="thumbnail" 
              v-for="(img, index) in pet.images" 
              :key="index"
              :class="{ active: selectedImage === img }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`${pet.name} ${index + 1}`" />
            </div>
          </div>

          <!-- Video Section -->
          <div class="pet-video" v-if="pet.video">
            <h4>🎬 Video của bé</h4>
            <div class="video-wrapper">
              <video controls :poster="pet.images[0]">
                <source :src="pet.video" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <!-- Pet Info -->
        <div class="pet-info">
          <div class="pet-status">
            <span class="pet-type-tag">{{ getPetTypeIcon(pet.type) }} {{ pet.type }}</span>
            <span class="availability" :class="pet.available ? 'available' : 'sold'">
              {{ pet.available ? '🟢 Còn nhận nuôi' : '🔴 Đã có chủ' }}
            </span>
          </div>

          <h1 class="pet-name">{{ pet.name }}</h1>

          <div class="pet-breed">
            <span class="breed-tag">{{ pet.breed }}</span>
          </div>

          <!-- Quick Info -->
          <div class="quick-info">
            <div class="info-item">
              <span class="info-icon">🎂</span>
              <div class="info-content">
                <strong>Tuổi</strong>
                <span>{{ pet.age }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">⚧</span>
              <div class="info-content">
                <strong>Giới tính</strong>
                <span>{{ pet.gender === 'male' ? 'Đực' : 'Cái' }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">⚖️</span>
              <div class="info-content">
                <strong>Cân nặng</strong>
                <span>{{ pet.weight }}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">🎨</span>
              <div class="info-content">
                <strong>Màu lông</strong>
                <span>{{ pet.color }}</span>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="pet-price">
            <div class="price-info">
              <span class="label">Phí nhận nuôi:</span>
              <span class="current-price">{{ formatPrice(pet.price) }}</span>
            </div>
            <p class="price-note">* Bao gồm tiêm phòng, sổ giun, microchip</p>
          </div>

          <!-- Health Status -->
          <div class="health-status">
            <h4>🏥 Tình Trạng Sức Khỏe</h4>
            <div class="health-items">
              <div class="health-item" :class="{ done: pet.vaccinated }">
                <i :class="pet.vaccinated ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                <span>Tiêm phòng đầy đủ</span>
              </div>
              <div class="health-item" :class="{ done: pet.dewormed }">
                <i :class="pet.dewormed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                <span>Đã sổ giun</span>
              </div>
              <div class="health-item" :class="{ done: pet.neutered }">
                <i :class="pet.neutered ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                <span>{{ pet.gender === 'male' ? 'Đã thiến' : 'Đã triệt sản' }}</span>
              </div>
              <div class="health-item" :class="{ done: pet.microchipped }">
                <i :class="pet.microchipped ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                <span>Đã gắn microchip</span>
              </div>
            </div>
          </div>

          <!-- Personality -->
          <div class="pet-personality">
            <h4>💝 Tính Cách</h4>
            <div class="personality-tags">
              <span class="tag" v-for="trait in pet.personality" :key="trait">{{ trait }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-primary btn-lg" @click="adoptPet" :disabled="!pet.available">
              <i class="fas fa-paw"></i> Đăng Ký Nhận Nuôi
            </button>
            <button class="btn btn-outline btn-lg" @click="contactSeller">
              <i class="fas fa-comments"></i> Liên Hệ Tư Vấn
            </button>
          </div>

          <!-- Seller Info -->
          <div class="seller-info">
            <img :src="seller.avatar" :alt="seller.name" class="seller-avatar" />
            <div class="seller-details">
              <strong>{{ seller.name }}</strong>
              <div class="seller-rating">
                <i class="fas fa-star"></i>
                <span>{{ seller.rating }} ({{ seller.reviews }} đánh giá)</span>
              </div>
              <span class="response-time">
                <i class="fas fa-clock"></i> Thường phản hồi trong {{ seller.responseTime }}
              </span>
            </div>
            <button class="btn btn-sm btn-ghost" @click="viewSellerProfile">
              Xem Shop
            </button>
          </div>

          <!-- Share -->
          <div class="share-section">
            <span>Chia sẻ bé:</span>
            <div class="share-buttons">
              <button class="share-btn facebook"><i class="fab fa-facebook-f"></i></button>
              <button class="share-btn messenger"><i class="fab fa-facebook-messenger"></i></button>
              <button class="share-btn zalo">Zalo</button>
              <button class="share-btn copy" @click="copyLink"><i class="fas fa-link"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pet Tabs -->
      <div class="pet-tabs">
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
          <!-- About Tab -->
          <div v-if="activeTab === 'about'" class="tab-pane">
            <h3>🐾 Giới Thiệu Về {{ pet.name }}</h3>
            <div class="about-content">
              <p>{{ pet.description }}</p>
            </div>

            <div class="pet-story" v-if="pet.story">
              <h4>📖 Câu Chuyện Của Bé</h4>
              <p>{{ pet.story }}</p>
            </div>

            <div class="care-needs">
              <h4>🍖 Nhu Cầu Chăm Sóc</h4>
              <div class="needs-grid">
                <div class="need-item">
                  <span class="need-icon">🍽️</span>
                  <div class="need-info">
                    <strong>Chế độ ăn</strong>
                    <span>{{ pet.diet }}</span>
                  </div>
                </div>
                <div class="need-item">
                  <span class="need-icon">🏃</span>
                  <div class="need-info">
                    <strong>Vận động</strong>
                    <span>{{ pet.exercise }}</span>
                  </div>
                </div>
                <div class="need-item">
                  <span class="need-icon">✂️</span>
                  <div class="need-info">
                    <strong>Chải lông</strong>
                    <span>{{ pet.grooming }}</span>
                  </div>
                </div>
                <div class="need-item">
                  <span class="need-icon">🏠</span>
                  <div class="need-info">
                    <strong>Không gian</strong>
                    <span>{{ pet.space }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Health Tab -->
          <div v-if="activeTab === 'health'" class="tab-pane">
            <h3>🏥 Hồ Sơ Sức Khỏe</h3>
            
            <div class="health-records">
              <div class="record-card">
                <div class="record-header">
                  <span class="record-icon">💉</span>
                  <h4>Lịch Sử Tiêm Phòng</h4>
                </div>
                <table class="record-table">
                  <tr v-for="vaccine in pet.vaccineHistory" :key="vaccine.name">
                    <td>{{ vaccine.name }}</td>
                    <td>{{ vaccine.date }}</td>
                    <td class="status done"><i class="fas fa-check"></i></td>
                  </tr>
                </table>
              </div>

              <div class="record-card">
                <div class="record-header">
                  <span class="record-icon">📋</span>
                  <h4>Khám Sức Khỏe</h4>
                </div>
                <div class="checkup-info">
                  <p><strong>Lần khám gần nhất:</strong> {{ pet.lastCheckup }}</p>
                  <p><strong>Bác sĩ:</strong> {{ pet.veterinarian }}</p>
                  <p><strong>Kết quả:</strong> <span class="health-good">Sức khỏe tốt</span></p>
                </div>
              </div>
            </div>

            <div class="health-certificate">
              <h4>📄 Giấy Tờ & Chứng Nhận</h4>
              <div class="certificates">
                <div class="cert-item">
                  <i class="fas fa-file-medical"></i>
                  <span>Sổ tiêm phòng</span>
                </div>
                <div class="cert-item">
                  <i class="fas fa-id-card"></i>
                  <span>Giấy khai sinh</span>
                </div>
                <div class="cert-item">
                  <i class="fas fa-microchip"></i>
                  <span>Giấy chứng nhận Microchip</span>
                </div>
                <div class="cert-item" v-if="pet.pedigree">
                  <i class="fas fa-award"></i>
                  <span>Giấy phả hệ (Pedigree)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-pane">
            <h3>⭐ Đánh Giá Từ Người Nhận Nuôi</h3>
            
            <div class="reviews-list">
              <div class="review-item" v-for="review in reviews" :key="review.id">
                <div class="review-header">
                  <img :src="review.avatar" :alt="review.name" class="reviewer-avatar" />
                  <div class="reviewer-info">
                    <strong>{{ review.name }}</strong>
                    <span class="adopted-pet">Đã nhận nuôi: {{ review.adoptedPet }}</span>
                  </div>
                  <div class="review-rating">
                    <i v-for="n in 5" :key="n" :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </div>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <div class="review-images" v-if="review.images && review.images.length > 0">
                  <img v-for="(img, idx) in review.images" :key="idx" :src="img" alt="Review" />
                </div>
                <span class="review-date">{{ review.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Adoption Process -->
      <div class="adoption-process">
        <h2 class="section-title spooky-title">🎃 Quy Trình Nhận Nuôi</h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-icon">📝</div>
            <h4>Đăng Ký</h4>
            <p>Điền form đăng ký nhận nuôi với thông tin cá nhân</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-icon">📞</div>
            <h4>Tư Vấn</h4>
            <p>Nhân viên liên hệ tư vấn và hẹn gặp thú cưng</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-icon">🤝</div>
            <h4>Gặp Mặt</h4>
            <p>Đến gặp và tương tác với thú cưng</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-icon">📋</div>
            <h4>Ký Hợp Đồng</h4>
            <p>Hoàn tất thủ tục và ký hợp đồng nhận nuôi</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">5</div>
            <div class="step-icon">🏠</div>
            <h4>Đón Bé Về</h4>
            <p>Đón thú cưng về nhà mới cùng đầy đủ giấy tờ</p>
          </div>
        </div>
      </div>

      <!-- Related Pets -->
      <div class="related-pets">
        <h2 class="section-title spooky-title">👻 Thú Cưng Tương Tự</h2>
        <div class="pets-grid">
          <div class="pet-card" v-for="item in relatedPets" :key="item.id">
            <router-link :to="`/pets/${item.id}`">
              <div class="card-image">
                <img :src="item.image" :alt="item.name" />
                <span class="pet-type-badge">{{ getPetTypeIcon(item.type) }}</span>
              </div>
              <div class="card-content">
                <h4>{{ item.name }}</h4>
                <p class="breed">{{ item.breed }}</p>
                <div class="card-meta">
                  <span>{{ item.age }}</span>
                  <span>{{ item.gender === 'male' ? '♂️' : '♀️' }}</span>
                </div>
                <span class="card-price">{{ formatPrice(item.price) }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Adoption Modal -->
    <div class="modal-overlay" v-if="showAdoptModal" @click.self="showAdoptModal = false">
      <div class="modal-content adoption-modal">
        <button class="modal-close" @click="showAdoptModal = false">
          <i class="fas fa-times"></i>
        </button>
        <h2>🐾 Đăng Ký Nhận Nuôi {{ pet.name }}</h2>
        
        <form @submit.prevent="submitAdoption" class="adoption-form">
          <div class="form-group">
            <label>Họ và tên *</label>
            <input type="text" v-model="adoptionForm.fullName" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Số điện thoại *</label>
              <input type="tel" v-model="adoptionForm.phone" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" v-model="adoptionForm.email" required />
            </div>
          </div>
          <div class="form-group">
            <label>Địa chỉ *</label>
            <input type="text" v-model="adoptionForm.address" required />
          </div>
          <div class="form-group">
            <label>Loại nhà ở</label>
            <select v-model="adoptionForm.housingType">
              <option value="house">Nhà riêng</option>
              <option value="apartment">Chung cư</option>
              <option value="room">Phòng trọ</option>
            </select>
          </div>
          <div class="form-group">
            <label>Bạn đã từng nuôi thú cưng chưa?</label>
            <select v-model="adoptionForm.experience">
              <option value="yes">Có, đã có kinh nghiệm</option>
              <option value="no">Chưa, đây là lần đầu</option>
            </select>
          </div>
          <div class="form-group">
            <label>Lý do muốn nhận nuôi</label>
            <textarea v-model="adoptionForm.reason" rows="3" placeholder="Chia sẻ lý do bạn muốn nhận nuôi bé..."></textarea>
          </div>
          <div class="form-group checkbox">
            <input type="checkbox" id="agree" v-model="adoptionForm.agree" required />
            <label for="agree">Tôi cam kết chăm sóc thú cưng tốt nhất và tuân thủ quy định nhận nuôi</label>
          </div>
          <button type="submit" class="btn btn-primary btn-full">
            <i class="fas fa-paper-plane"></i> Gửi Đăng Ký
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const selectedImage = ref(null)
const activeTab = ref('about')
const isWishlisted = ref(false)
const showAdoptModal = ref(false)

const tabs = [
  { id: 'about', label: 'Giới thiệu', icon: '🐾' },
  { id: 'health', label: 'Sức khỏe', icon: '🏥' },
  { id: 'reviews', label: 'Đánh giá', icon: '⭐' }
]

const adoptionForm = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  housingType: 'house',
  experience: 'yes',
  reason: '',
  agree: false
})

// Demo pet data
const pet = ref({
  id: 1,
  name: 'Shadow',
  type: 'Chó',
  breed: 'Husky Siberian',
  age: '8 tháng',
  gender: 'male',
  weight: '15kg',
  color: 'Đen trắng',
  price: 8500000,
  available: true,
  vaccinated: true,
  dewormed: true,
  neutered: false,
  microchipped: true,
  pedigree: true,
  images: [
    'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600',
    'https://images.unsplash.com/photo-1617895153857-3aabb8b3b3b8?w=600',
    'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=600',
    'https://images.unsplash.com/photo-1568572933382-74d440642117?w=600'
  ],
  video: null,
  personality: ['Năng động', 'Thân thiện', 'Thông minh', 'Trung thành', 'Vui vẻ'],
  description: 'Shadow là một chú Husky Siberian đáng yêu với đôi mắt xanh biếc đặc trưng. Bé rất năng động, thích chạy nhảy và chơi đùa. Shadow thân thiện với mọi người và các thú cưng khác, rất phù hợp với gia đình có trẻ nhỏ.',
  story: 'Shadow được sinh ra tại trại nuôi chuyên nghiệp. Bé được chăm sóc cẩn thận từ nhỏ và đã quen với môi trường gia đình. Bé rất thích Halloween và luôn háo hức mỗi khi được mặc trang phục!',
  diet: '2 bữa/ngày, thức ăn hạt cao cấp',
  exercise: 'Cần vận động 1-2 giờ/ngày',
  grooming: 'Chải lông 2-3 lần/tuần',
  space: 'Nhà có sân hoặc không gian rộng',
  vaccineHistory: [
    { name: 'Parvo', date: '15/08/2024' },
    { name: 'Distemper', date: '15/09/2024' },
    { name: 'Rabies', date: '15/10/2024' }
  ],
  lastCheckup: '20/10/2024',
  veterinarian: 'BS. Nguyễn Văn An - PetCare Clinic'
})

const seller = ref({
  name: 'Halloween Pet Store',
  avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100',
  rating: 4.9,
  reviews: 256,
  responseTime: '1 giờ'
})

const reviews = ref([
  {
    id: 1,
    name: 'Nguyễn Thị Mai',
    avatar: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    adoptedPet: 'Milo - Golden Retriever',
    content: 'Trại rất uy tín! Bé Milo nhà mình khỏe mạnh, đã tiêm phòng đầy đủ. Nhân viên tư vấn nhiệt tình, hỗ trợ rất tốt sau khi nhận nuôi.',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=200'],
    date: '25/10/2024'
  },
  {
    id: 2,
    name: 'Trần Văn Nam',
    avatar: 'https://i.pravatar.cc/100?img=8',
    rating: 5,
    adoptedPet: 'Luna - Corgi',
    content: 'Quy trình nhận nuôi chuyên nghiệp, bé Luna rất khỏe và lanh lợi. Cảm ơn shop đã ghép mình với em ấy! 🎃',
    images: [],
    date: '20/10/2024'
  }
])

const relatedPets = ref([
  { id: 2, name: 'Luna', type: 'Chó', breed: 'Corgi', age: '6 tháng', gender: 'female', price: 12000000, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300' },
  { id: 3, name: 'Mochi', type: 'Mèo', breed: 'British Shorthair', age: '4 tháng', gender: 'male', price: 8000000, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300' },
  { id: 4, name: 'Buddy', type: 'Chó', breed: 'Golden Retriever', age: '1 tuổi', gender: 'male', price: 15000000, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300' },
  { id: 5, name: 'Whiskers', type: 'Mèo', breed: 'Maine Coon', age: '8 tháng', gender: 'female', price: 18000000, image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300' }
])

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function getPetTypeIcon(type) {
  const icons = {
    'Chó': '🐕',
    'Mèo': '🐱',
    'Chim': '🐦',
    'Cá': '🐠',
    'Hamster': '🐹',
    'Thỏ': '🐰'
  }
  return icons[type] || '🐾'
}

function toggleWishlist() {
  isWishlisted.value = !isWishlisted.value
  if (isWishlisted.value) {
    alert('❤️ Đã thêm vào danh sách yêu thích!')
  }
}

function adoptPet() {
  showAdoptModal.value = true
}

function contactSeller() {
  alert('📞 Đang kết nối với tư vấn viên...')
}

function viewSellerProfile() {
  router.push('/shop/halloween-pet-store')
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('📋 Đã sao chép link!')
}

function submitAdoption() {
  if (!adoptionForm.value.agree) {
    alert('Vui lòng đồng ý với điều khoản nhận nuôi!')
    return
  }
  alert('✅ Đăng ký nhận nuôi thành công! Chúng tôi sẽ liên hệ bạn trong 24h.')
  showAdoptModal.value = false
}

onMounted(() => {
  // Fetch pet detail from API
  // const petId = route.params.id
  // petsAPI.getById(petId).then(res => pet.value = res.data)
})
</script>

<style scoped>
.pet-detail-page {
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

/* Pet Layout */
.pet-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
}

/* Pet Gallery */
.pet-gallery {
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

.pet-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge.vaccinated {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.badge.verified {
  background: rgba(107, 33, 168, 0.9);
  color: white;
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
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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

.pet-video h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.video-wrapper {
  border-radius: 15px;
  overflow: hidden;
}

.video-wrapper video {
  width: 100%;
  max-height: 300px;
}

/* Pet Info */
.pet-info {
  padding: 20px 0;
}

.pet-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.pet-type-tag {
  background: rgba(107, 33, 168, 0.2);
  color: #a855f7;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.availability {
  font-weight: 500;
  font-size: 0.9rem;
}

.availability.available {
  color: #22c55e;
}

.availability.sold {
  color: #ef4444;
}

.pet-name {
  font-size: 2.2rem;
  font-weight: 700;
  color: #f8f8f8;
  margin-bottom: 10px;
}

.pet-breed {
  margin-bottom: 25px;
}

.breed-tag {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 500;
}

/* Quick Info */
.quick-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 12px;
}

.info-icon {
  font-size: 1.5rem;
}

.info-content strong {
  display: block;
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 3px;
}

.info-content span {
  color: #f8f8f8;
  font-weight: 500;
}

/* Price */
.pet-price {
  padding: 20px;
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-radius: 15px;
  margin-bottom: 25px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.price-info .label {
  color: #888;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #f97316;
}

.price-note {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #22c55e;
}

/* Health Status */
.health-status {
  margin-bottom: 25px;
}

.health-status h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.health-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #1a1a1a;
  border-radius: 10px;
  color: #888;
}

.health-item.done {
  color: #22c55e;
}

.health-item i {
  font-size: 1.1rem;
}

/* Personality */
.pet-personality {
  margin-bottom: 30px;
}

.pet-personality h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.personality-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.personality-tags .tag {
  padding: 8px 18px;
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 20px;
  color: #f97316;
  font-size: 0.9rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1;
}

.btn-lg {
  padding: 18px 35px;
  font-size: 1rem;
}

.btn-sm {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid #6b21a8;
  color: #a855f7;
}

.btn-outline:hover {
  background: rgba(107, 33, 168, 0.1);
}

.btn-ghost {
  background: rgba(107, 33, 168, 0.1);
  color: #a855f7;
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Seller Info */
.seller-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 15px;
  margin-bottom: 25px;
}

.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-details {
  flex: 1;
}

.seller-details strong {
  display: block;
  color: #f8f8f8;
  margin-bottom: 5px;
}

.seller-rating {
  color: #fbbf24;
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.seller-rating span {
  color: #888;
  margin-left: 5px;
}

.response-time {
  color: #888;
  font-size: 0.85rem;
}

/* Share */
.share-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.share-section > span {
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.share-btn.facebook { background: #1877f2; }
.share-btn.messenger { background: #0084ff; }
.share-btn.zalo { background: #0068ff; }
.share-btn.copy { background: #6b21a8; }

.share-btn:hover {
  transform: scale(1.1);
}

/* Pet Tabs */
.pet-tabs {
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

.about-content {
  color: #ccc;
  line-height: 1.8;
  margin-bottom: 30px;
}

.pet-story {
  padding: 20px;
  background: rgba(249, 115, 22, 0.1);
  border-left: 4px solid #f97316;
  border-radius: 0 15px 15px 0;
  margin-bottom: 30px;
}

.pet-story h4 {
  color: #f97316;
  margin-bottom: 10px;
}

.pet-story p {
  color: #ccc;
  line-height: 1.6;
}

/* Care Needs */
.care-needs h4 {
  color: #a855f7;
  margin-bottom: 20px;
}

.needs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.need-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #0a0a0a;
  border-radius: 15px;
}

.need-icon {
  font-size: 2rem;
}

.need-info strong {
  display: block;
  color: #a855f7;
  margin-bottom: 5px;
}

.need-info span {
  color: #888;
  font-size: 0.9rem;
}

/* Health Records */
.health-records {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 30px;
}

.record-card {
  padding: 25px;
  background: #0a0a0a;
  border-radius: 15px;
}

.record-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.record-icon {
  font-size: 1.5rem;
}

.record-header h4 {
  color: #a855f7;
  margin: 0;
}

.record-table {
  width: 100%;
}

.record-table tr {
  border-bottom: 1px solid #2d2d2d;
}

.record-table td {
  padding: 12px 5px;
  color: #ccc;
}

.record-table .status.done {
  color: #22c55e;
}

.checkup-info p {
  margin: 10px 0;
  color: #ccc;
}

.health-good {
  color: #22c55e;
  font-weight: 500;
}

/* Certificates */
.health-certificate h4 {
  color: #a855f7;
  margin-bottom: 20px;
}

.certificates {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.cert-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #0a0a0a;
  border-radius: 15px;
  text-align: center;
}

.cert-item i {
  font-size: 2rem;
  color: #22c55e;
}

.cert-item span {
  color: #888;
  font-size: 0.85rem;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-item {
  padding: 25px;
  background: #0a0a0a;
  border-radius: 15px;
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
  margin-bottom: 3px;
}

.adopted-pet {
  color: #888;
  font-size: 0.85rem;
}

.review-rating {
  color: #fbbf24;
}

.review-content {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 15px;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.review-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.review-date {
  color: #666;
  font-size: 0.85rem;
}

/* Adoption Process */
.adoption-process {
  margin-bottom: 60px;
}

.section-title {
  font-family: 'Creepster', cursive;
  font-size: 2rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 40px;
}

.process-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
}

.step {
  text-align: center;
  max-width: 160px;
}

.step-number {
  width: 30px;
  height: 30px;
  background: #6b21a8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-weight: 700;
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.step h4 {
  color: #a855f7;
  margin-bottom: 10px;
}

.step p {
  color: #888;
  font-size: 0.85rem;
  line-height: 1.4;
}

.step-arrow {
  color: #6b21a8;
  font-size: 1.5rem;
  margin-top: 60px;
}

/* Related Pets */
.related-pets {
  margin-top: 60px;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.pet-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.pet-card:hover {
  border-color: #6b21a8;
  transform: translateY(-5px);
}

.pet-card a {
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

.pet-card:hover .card-image img {
  transform: scale(1.1);
}

.pet-type-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
}

.card-content {
  padding: 20px;
}

.card-content h4 {
  color: #f8f8f8;
  margin-bottom: 5px;
}

.card-content .breed {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.card-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #888;
}

.card-price {
  color: #f97316;
  font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content h2 {
  color: #f97316;
  margin-bottom: 25px;
  padding-right: 40px;
}

/* Adoption Form */
.adoption-form .form-group {
  margin-bottom: 20px;
}

.adoption-form label {
  display: block;
  color: #a855f7;
  margin-bottom: 8px;
  font-weight: 500;
}

.adoption-form input,
.adoption-form select,
.adoption-form textarea {
  width: 100%;
  padding: 12px 15px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
  font-size: 1rem;
}

.adoption-form input:focus,
.adoption-form select:focus,
.adoption-form textarea:focus {
  outline: none;
  border-color: #6b21a8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.form-group.checkbox input {
  width: auto;
  margin-top: 3px;
}

.form-group.checkbox label {
  margin-bottom: 0;
  color: #ccc;
  font-weight: 400;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .pet-layout {
    grid-template-columns: 1fr;
  }

  .pet-gallery {
    position: static;
  }

  .needs-grid,
  .health-records {
    grid-template-columns: 1fr;
  }

  .certificates {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-steps {
    flex-wrap: wrap;
  }

  .step-arrow {
    display: none;
  }

  .pets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .quick-info {
    grid-template-columns: 1fr;
  }

  .health-items {
    grid-template-columns: 1fr;
  }

  .certificates {
    grid-template-columns: 1fr;
  }

  .pets-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
