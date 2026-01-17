<template>
  <div class="reviews-page">
    <div class="container">
      <h1 class="page-title spooky-title">⭐ Đánh Giá Sản Phẩm</h1>

      <!-- Review Stats -->
      <div class="review-stats">
        <div class="overall-rating">
          <div class="rating-big">
            <span class="rating-number">4.8</span>
            <span class="rating-max">/5</span>
          </div>
          <div class="stars-big">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
          </div>
          <p class="total-reviews">Dựa trên {{ totalReviews }} đánh giá</p>
        </div>

        <div class="rating-breakdown">
          <div class="rating-bar" v-for="n in 5" :key="n">
            <span class="star-label">{{ 6 - n }} <i class="fas fa-star"></i></span>
            <div class="bar">
              <div class="fill" :style="{ width: getRatingPercent(6 - n) + '%' }"></div>
            </div>
            <span class="percent">{{ getRatingPercent(6 - n) }}%</span>
          </div>
        </div>

        <div class="review-highlights">
          <h4>✨ Điểm nổi bật</h4>
          <div class="highlight-tags">
            <span class="tag">Chất lượng tốt (89)</span>
            <span class="tag">Giao hàng nhanh (76)</span>
            <span class="tag">Đóng gói cẩn thận (65)</span>
            <span class="tag">Giá hợp lý (58)</span>
          </div>
        </div>
      </div>

      <!-- Filter & Sort -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button 
            v-for="tab in filterTabs" 
            :key="tab.value"
            :class="['filter-btn', { active: activeFilter === tab.value }]"
            @click="activeFilter = tab.value"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <div class="filter-options">
          <select v-model="sortBy">
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Đánh giá cao nhất</option>
            <option value="lowest">Đánh giá thấp nhất</option>
            <option value="helpful">Hữu ích nhất</option>
          </select>

          <label class="checkbox-filter">
            <input type="checkbox" v-model="showWithImages" />
            <span>Có hình ảnh</span>
          </label>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div class="review-card" v-for="review in filteredReviews" :key="review.id">
          <div class="review-header">
            <div class="reviewer">
              <img :src="review.avatar" :alt="review.name" class="avatar" />
              <div class="reviewer-info">
                <strong>{{ review.name }}</strong>
                <div class="verified" v-if="review.verified">
                  <i class="fas fa-check-circle"></i> Đã mua hàng
                </div>
              </div>
            </div>
            <div class="review-meta">
              <div class="rating">
                <i 
                  v-for="n in 5" 
                  :key="n" 
                  :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"
                ></i>
              </div>
              <span class="date">{{ review.date }}</span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="reviewed-product">
            <img :src="review.product.image" :alt="review.product.name" />
            <div class="product-info">
              <router-link :to="`/products/${review.product.id}`">
                {{ review.product.name }}
              </router-link>
              <span class="variant" v-if="review.variant">Phân loại: {{ review.variant }}</span>
            </div>
          </div>

          <!-- Review Content -->
          <div class="review-content">
            <h4 v-if="review.title">{{ review.title }}</h4>
            <p>{{ review.content }}</p>
          </div>

          <!-- Review Images -->
          <div class="review-images" v-if="review.images && review.images.length > 0">
            <div 
              class="image-thumb" 
              v-for="(img, idx) in review.images" 
              :key="idx"
              @click="openImageModal(review.images, idx)"
            >
              <img :src="img" :alt="`Review image ${idx + 1}`" />
            </div>
          </div>

          <!-- Review Tags -->
          <div class="review-tags" v-if="review.tags && review.tags.length > 0">
            <span class="tag" v-for="tag in review.tags" :key="tag">{{ tag }}</span>
          </div>

          <!-- Review Actions -->
          <div class="review-actions">
            <button class="action-btn" @click="markHelpful(review)">
              <i class="far fa-thumbs-up"></i>
              Hữu ích ({{ review.helpful }})
            </button>
            <button class="action-btn" @click="replyReview(review)">
              <i class="far fa-comment"></i>
              Trả lời
            </button>
            <button class="action-btn" @click="reportReview(review)">
              <i class="far fa-flag"></i>
              Báo cáo
            </button>
          </div>

          <!-- Shop Reply -->
          <div class="shop-reply" v-if="review.shopReply">
            <div class="reply-header">
              <span class="shop-badge">🏪 Phản hồi từ Shop</span>
              <span class="reply-date">{{ review.shopReply.date }}</span>
            </div>
            <p>{{ review.shopReply.content }}</p>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="load-more" v-if="hasMoreReviews">
        <button class="btn btn-outline" @click="loadMoreReviews">
          <i class="fas fa-plus"></i> Xem thêm đánh giá
        </button>
      </div>

      <!-- Write Review Section -->
      <div class="write-review-section">
        <h2 class="section-title">✍️ Viết Đánh Giá Của Bạn</h2>
        
        <div class="review-form-card">
          <!-- Select Product -->
          <div class="form-group">
            <label>Chọn sản phẩm đã mua</label>
            <select v-model="newReview.productId">
              <option value="">-- Chọn sản phẩm --</option>
              <option v-for="product in purchasedProducts" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Rating -->
          <div class="form-group">
            <label>Đánh giá sao</label>
            <div class="star-rating-input">
              <i 
                v-for="n in 5" 
                :key="n" 
                :class="['star', n <= newReview.rating ? 'fas fa-star active' : 'far fa-star']"
                @click="newReview.rating = n"
                @mouseenter="hoverRating = n"
                @mouseleave="hoverRating = 0"
              ></i>
              <span class="rating-text">{{ getRatingText(newReview.rating) }}</span>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label>Tiêu đề đánh giá</label>
            <input 
              type="text" 
              v-model="newReview.title" 
              placeholder="Tóm tắt trải nghiệm của bạn..."
            />
          </div>

          <!-- Content -->
          <div class="form-group">
            <label>Nội dung đánh giá</label>
            <textarea 
              v-model="newReview.content" 
              rows="5"
              placeholder="Chia sẻ chi tiết về sản phẩm: chất lượng, màu sắc, kích thước..."
            ></textarea>
            <span class="char-count">{{ newReview.content.length }}/500</span>
          </div>

          <!-- Upload Images -->
          <div class="form-group">
            <label>Thêm hình ảnh (tối đa 5 ảnh)</label>
            <div class="image-upload">
              <div class="upload-preview" v-for="(img, idx) in newReview.images" :key="idx">
                <img :src="img" alt="Preview" />
                <button class="remove-img" @click="removeImage(idx)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <label class="upload-btn" v-if="newReview.images.length < 5">
                <input type="file" accept="image/*" @change="handleImageUpload" hidden />
                <i class="fas fa-camera"></i>
                <span>Thêm ảnh</span>
              </label>
            </div>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>Điểm nổi bật</label>
            <div class="tag-options">
              <label 
                v-for="tag in tagOptions" 
                :key="tag"
                :class="['tag-option', { selected: newReview.tags.includes(tag) }]"
              >
                <input 
                  type="checkbox" 
                  :value="tag" 
                  v-model="newReview.tags"
                  hidden
                />
                {{ tag }}
              </label>
            </div>
          </div>

          <!-- Submit -->
          <button class="btn btn-primary btn-lg" @click="submitReview">
            <i class="fas fa-paper-plane"></i> Gửi Đánh Giá
          </button>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div class="image-modal" v-if="showImageModal" @click.self="showImageModal = false">
      <button class="modal-close" @click="showImageModal = false">
        <i class="fas fa-times"></i>
      </button>
      <button class="modal-nav prev" @click="prevImage" v-if="currentImageIndex > 0">
        <i class="fas fa-chevron-left"></i>
      </button>
      <img :src="modalImages[currentImageIndex]" alt="Review image" />
      <button class="modal-nav next" @click="nextImage" v-if="currentImageIndex < modalImages.length - 1">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="modal-counter">{{ currentImageIndex + 1 }} / {{ modalImages.length }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeFilter = ref('all')
const sortBy = ref('newest')
const showWithImages = ref(false)
const hoverRating = ref(0)
const showImageModal = ref(false)
const modalImages = ref([])
const currentImageIndex = ref(0)

const filterTabs = [
  { label: 'Tất cả', value: 'all', icon: '📋' },
  { label: '5 sao', value: '5', icon: '⭐' },
  { label: '4 sao', value: '4', icon: '⭐' },
  { label: '3 sao', value: '3', icon: '⭐' },
  { label: '2 sao', value: '2', icon: '⭐' },
  { label: '1 sao', value: '1', icon: '⭐' }
]

const tagOptions = [
  'Chất lượng tốt',
  'Đúng mô tả',
  'Giao hàng nhanh',
  'Đóng gói cẩn thận',
  'Giá hợp lý',
  'Sẽ mua lại'
]

const totalReviews = ref(256)
const hasMoreReviews = ref(true)

const newReview = ref({
  productId: '',
  rating: 0,
  title: '',
  content: '',
  images: [],
  tags: []
})

// Demo reviews data
const reviews = ref([
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    date: '28/10/2024',
    verified: true,
    product: {
      id: 1,
      name: 'Áo Choàng Dracula Cho Chó',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100'
    },
    variant: 'Size M - Màu đỏ đen',
    title: 'Sản phẩm tuyệt vời cho mùa Halloween!',
    content: 'Mình rất hài lòng với sản phẩm này. Chất liệu vải mềm mại, không gây kích ứng da cho bé cún. Màu sắc đẹp đúng như hình, size M vừa vặn với bé Golden 15kg nhà mình. Đóng gói cẩn thận, giao hàng nhanh. Sẽ ủng hộ shop tiếp! 🎃',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300'
    ],
    tags: ['Chất lượng tốt', 'Đúng mô tả', 'Giao hàng nhanh'],
    helpful: 45,
    shopReply: {
      date: '29/10/2024',
      content: 'Cảm ơn bạn đã tin tưởng và ủng hộ shop! Chúc bé cún nhà bạn có một mùa Halloween thật vui vẻ! 🦇🎃'
    }
  },
  {
    id: 2,
    name: 'Trần Văn Hùng',
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 4,
    date: '25/10/2024',
    verified: true,
    product: {
      id: 2,
      name: 'Mũ Phù Thủy Cho Mèo',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100'
    },
    variant: 'Size S',
    title: 'Khá ổn, bé mèo thích lắm',
    content: 'Mũ đẹp, thiết kế cute. Tuy nhiên dây đeo hơi ngắn, phải nới ra một chút cho bé mèo 4kg. Nhìn chung là hài lòng với giá tiền.',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300'
    ],
    tags: ['Đúng mô tả', 'Giá hợp lý'],
    helpful: 28,
    shopReply: null
  },
  {
    id: 3,
    name: 'Lê Thị Hương',
    avatar: 'https://i.pravatar.cc/100?img=3',
    rating: 5,
    date: '20/10/2024',
    verified: true,
    product: {
      id: 3,
      name: 'Vòng Cổ Bí Ngô Phát Sáng',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100'
    },
    variant: 'Màu cam',
    title: 'Đèn sáng đẹp, bé đeo rất nổi bật!',
    content: 'Vòng cổ phát sáng rất đẹp, có 3 chế độ sáng khác nhau. Pin dùng được khá lâu. Bé Corgi nhà mình đeo đi dạo tối mọi người ai cũng nhìn! Rất hài lòng ạ.',
    images: [],
    tags: ['Chất lượng tốt', 'Sẽ mua lại'],
    helpful: 35,
    shopReply: {
      date: '21/10/2024',
      content: 'Cảm ơn bạn đã đánh giá! Rất vui vì bé Corgi thích món quà Halloween này! 🎃✨'
    }
  },
  {
    id: 4,
    name: 'Phạm Đức Minh',
    avatar: 'https://i.pravatar.cc/100?img=4',
    rating: 3,
    date: '18/10/2024',
    verified: true,
    product: {
      id: 4,
      name: 'Đồ Chơi Dơi Ma Halloween',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100'
    },
    variant: null,
    title: 'Tạm được',
    content: 'Đồ chơi ổn nhưng chất liệu hơi cứng. Bé chó nhà mình không thích lắm, chơi được vài lần rồi bỏ. Có thể phù hợp với những bé thích nhai đồ cứng hơn.',
    images: [],
    tags: [],
    helpful: 12,
    shopReply: null
  },
  {
    id: 5,
    name: 'Nguyễn Thị Mai',
    avatar: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    date: '15/10/2024',
    verified: true,
    product: {
      id: 1,
      name: 'Áo Choàng Dracula Cho Chó',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100'
    },
    variant: 'Size L - Màu tím đen',
    title: 'Xuất sắc! Mua lần 2 rồi',
    content: 'Đây là lần thứ 2 mình mua áo ở shop. Lần trước mua cho bé Husky, giờ mua thêm cho bé Poodle. Chất lượng vẫn như lần đầu, rất tốt! Shop uy tín, giao hàng nhanh.',
    images: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=300',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300'
    ],
    tags: ['Chất lượng tốt', 'Đúng mô tả', 'Giao hàng nhanh', 'Sẽ mua lại'],
    helpful: 52,
    shopReply: {
      date: '16/10/2024',
      content: 'Cảm ơn bạn đã quay lại ủng hộ shop! Chúc 2 bé có một mùa Halloween thật đáng nhớ! 🐕🦇'
    }
  }
])

const purchasedProducts = ref([
  { id: 1, name: 'Áo Choàng Dracula Cho Chó - Size M' },
  { id: 2, name: 'Mũ Phù Thủy Cho Mèo - Size S' },
  { id: 3, name: 'Vòng Cổ Bí Ngô Phát Sáng' }
])

function getRatingPercent(star) {
  const percents = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 }
  return percents[star] || 0
}

function getRatingText(rating) {
  const texts = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời'
  }
  return texts[rating] || 'Chọn số sao'
}

const filteredReviews = computed(() => {
  let result = reviews.value

  // Filter by rating
  if (activeFilter.value !== 'all') {
    result = result.filter(r => r.rating === parseInt(activeFilter.value))
  }

  // Filter with images
  if (showWithImages.value) {
    result = result.filter(r => r.images && r.images.length > 0)
  }

  // Sort
  switch (sortBy.value) {
    case 'oldest':
      result = [...result].reverse()
      break
    case 'highest':
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
    case 'lowest':
      result = [...result].sort((a, b) => a.rating - b.rating)
      break
    case 'helpful':
      result = [...result].sort((a, b) => b.helpful - a.helpful)
      break
  }

  return result
})

function openImageModal(images, index) {
  modalImages.value = images
  currentImageIndex.value = index
  showImageModal.value = true
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

function nextImage() {
  if (currentImageIndex.value < modalImages.value.length - 1) {
    currentImageIndex.value++
  }
}

function markHelpful(review) {
  review.helpful++
}

function replyReview(review) {
  alert('Tính năng trả lời đang được phát triển!')
}

function reportReview(review) {
  if (confirm('Bạn muốn báo cáo đánh giá này?')) {
    alert('Đã gửi báo cáo. Cảm ơn bạn!')
  }
}

function loadMoreReviews() {
  // Load more reviews from API
  alert('Đang tải thêm đánh giá...')
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file && newReview.value.images.length < 5) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newReview.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

function removeImage(index) {
  newReview.value.images.splice(index, 1)
}

function submitReview() {
  if (!newReview.value.productId) {
    alert('Vui lòng chọn sản phẩm!')
    return
  }
  if (!newReview.value.rating) {
    alert('Vui lòng chọn số sao đánh giá!')
    return
  }
  if (!newReview.value.content) {
    alert('Vui lòng nhập nội dung đánh giá!')
    return
  }

  alert('✅ Gửi đánh giá thành công! Cảm ơn bạn đã chia sẻ.')
  
  // Reset form
  newReview.value = {
    productId: '',
    rating: 0,
    title: '',
    content: '',
    images: [],
    tags: []
  }
}
</script>

<style scoped>
.reviews-page {
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

/* Review Stats */
.review-stats {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 40px;
  padding: 30px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  margin-bottom: 40px;
}

.overall-rating {
  text-align: center;
  padding: 20px;
  border-right: 1px solid #2d2d2d;
}

.rating-big {
  margin-bottom: 15px;
}

.rating-number {
  font-size: 4rem;
  font-weight: 700;
  color: #f97316;
}

.rating-max {
  font-size: 1.5rem;
  color: #888;
}

.stars-big {
  color: #fbbf24;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.total-reviews {
  color: #888;
}

/* Rating Breakdown */
.rating-breakdown {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.star-label {
  width: 50px;
  color: #888;
  font-size: 0.9rem;
}

.star-label i {
  color: #fbbf24;
}

.bar {
  flex: 1;
  height: 10px;
  background: #2d2d2d;
  border-radius: 5px;
  overflow: hidden;
}

.bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.percent {
  width: 45px;
  text-align: right;
  color: #888;
  font-size: 0.9rem;
}

/* Review Highlights */
.review-highlights {
  padding-left: 30px;
  border-left: 1px solid #2d2d2d;
}

.review-highlights h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.highlight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.highlight-tags .tag {
  padding: 8px 15px;
  background: rgba(107, 33, 168, 0.2);
  border-radius: 20px;
  color: #a855f7;
  font-size: 0.85rem;
}

/* Filter Section */
.filter-section {
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
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 18px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 25px;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #6b21a8;
  color: #a855f7;
}

.filter-btn.active {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  border-color: transparent;
  color: white;
}

.filter-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-options select {
  padding: 10px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
  cursor: pointer;
}

.checkbox-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  cursor: pointer;
}

.checkbox-filter input {
  accent-color: #6b21a8;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.review-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
}

.review-card:hover {
  border-color: #6b21a8;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.reviewer {
  display: flex;
  gap: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-info strong {
  display: block;
  color: #f8f8f8;
  margin-bottom: 5px;
}

.verified {
  color: #22c55e;
  font-size: 0.85rem;
}

.verified i {
  margin-right: 5px;
}

.review-meta {
  text-align: right;
}

.rating {
  color: #fbbf24;
  margin-bottom: 5px;
}

.date {
  color: #666;
  font-size: 0.85rem;
}

/* Reviewed Product */
.reviewed-product {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #0a0a0a;
  border-radius: 12px;
  margin-bottom: 20px;
}

.reviewed-product img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}

.product-info a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-bottom: 5px;
}

.product-info a:hover {
  text-decoration: underline;
}

.variant {
  color: #888;
  font-size: 0.85rem;
}

/* Review Content */
.review-content {
  margin-bottom: 20px;
}

.review-content h4 {
  color: #f8f8f8;
  margin-bottom: 10px;
}

.review-content p {
  color: #ccc;
  line-height: 1.7;
}

/* Review Images */
.review-images {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.image-thumb {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.image-thumb:hover {
  transform: scale(1.05);
}

.image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Review Tags */
.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.review-tags .tag {
  padding: 6px 14px;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 15px;
  color: #22c55e;
  font-size: 0.85rem;
}

/* Review Actions */
.review-actions {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #2d2d2d;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.action-btn:hover {
  color: #a855f7;
}

/* Shop Reply */
.shop-reply {
  margin-top: 20px;
  padding: 20px;
  background: rgba(107, 33, 168, 0.1);
  border-left: 3px solid #6b21a8;
  border-radius: 0 12px 12px 0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.shop-badge {
  color: #a855f7;
  font-weight: 600;
}

.reply-date {
  color: #666;
  font-size: 0.85rem;
}

.shop-reply p {
  color: #ccc;
  line-height: 1.6;
}

/* Load More */
.load-more {
  text-align: center;
  margin-bottom: 60px;
}

/* Write Review Section */
.write-review-section {
  margin-top: 60px;
}

.section-title {
  font-size: 1.8rem;
  color: #a855f7;
  text-align: center;
  margin-bottom: 30px;
}

.review-form-card {
  max-width: 700px;
  margin: 0 auto;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 40px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  color: #a855f7;
  margin-bottom: 10px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #f8f8f8;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b21a8;
}

.char-count {
  display: block;
  text-align: right;
  color: #666;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Star Rating Input */
.star-rating-input {
  display: flex;
  align-items: center;
  gap: 15px;
}

.star-rating-input .star {
  font-size: 2rem;
  color: #2d2d2d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-rating-input .star:hover,
.star-rating-input .star.active {
  color: #fbbf24;
  transform: scale(1.1);
}

.rating-text {
  color: #888;
  font-size: 0.95rem;
}

/* Image Upload */
.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.upload-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  cursor: pointer;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #2d2d2d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  border-color: #6b21a8;
  color: #a855f7;
}

.upload-btn i {
  font-size: 1.5rem;
}

.upload-btn span {
  font-size: 0.85rem;
}

/* Tag Options */
.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-option {
  padding: 10px 18px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-option:hover {
  border-color: #6b21a8;
}

.tag-option.selected {
  background: rgba(107, 33, 168, 0.2);
  border-color: #6b21a8;
  color: #a855f7;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-lg {
  width: 100%;
  padding: 18px;
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
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

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-nav.prev {
  left: 20px;
}

.modal-nav.next {
  right: 20px;
}

.modal-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .review-stats {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .overall-rating {
    border-right: none;
    border-bottom: 1px solid #2d2d2d;
    padding-bottom: 30px;
  }

  .review-highlights {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #2d2d2d;
    padding-top: 30px;
  }
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .filter-options {
    width: 100%;
    justify-content: space-between;
  }

  .review-header {
    flex-direction: column;
    gap: 15px;
  }

  .review-meta {
    text-align: left;
  }

  .review-actions {
    flex-wrap: wrap;
  }

  .review-form-card {
    padding: 25px;
  }
}
</style>
