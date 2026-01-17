<template>
  <div class="admin-reviews">
    <div class="page-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm đánh giá..." />
        </div>
        <select v-model="filterRating" class="filter-select">
          <option value="">Tất cả sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>
    </div>

    <!-- Reviews Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">4.5</div>
        <div class="stat-label">Điểm trung bình</div>
        <div class="stars">
          <i class="fas fa-star" v-for="n in 4" :key="n"></i>
          <i class="fas fa-star-half-alt"></i>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ reviews.length }}</div>
        <div class="stat-label">Tổng đánh giá</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ reviews.filter(r => r.status === 'pending').length }}</div>
        <div class="stat-label">Chờ duyệt</div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div class="review-card" v-for="review in filteredReviews" :key="review.id">
        <div class="review-header">
          <div class="reviewer">
            <img :src="review.user.avatar" :alt="review.user.name" />
            <div>
              <h4>{{ review.user.name }}</h4>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>
          </div>
          <div class="review-product">
            <img :src="review.product.image" :alt="review.product.name" />
            <span>{{ review.product.name }}</span>
          </div>
        </div>

        <div class="review-rating">
          <i class="fas fa-star" v-for="n in review.rating" :key="'filled-'+n"></i>
          <i class="far fa-star" v-for="n in (5 - review.rating)" :key="'empty-'+n"></i>
        </div>

        <p class="review-content">{{ review.content }}</p>

        <div class="review-images" v-if="review.images?.length">
          <img v-for="(img, index) in review.images" :key="index" :src="img" />
        </div>

        <div class="review-actions">
          <span class="review-status" :class="review.status">
            {{ getStatusText(review.status) }}
          </span>
          <div class="action-btns" v-if="review.status === 'pending'">
            <button class="btn btn-sm btn-success" @click="approveReview(review)">
              <i class="fas fa-check"></i> Duyệt
            </button>
            <button class="btn btn-sm btn-danger" @click="rejectReview(review)">
              <i class="fas fa-times"></i> Từ chối
            </button>
          </div>
          <button class="btn btn-sm btn-outline" @click="deleteReview(review)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterRating = ref('')
const filterStatus = ref('')

const reviews = ref([
  {
    id: 1,
    user: { name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/40?img=1' },
    product: { name: 'Thức Ăn Cho Chó Premium', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=50' },
    rating: 5,
    content: 'Sản phẩm rất tốt, chó nhà mình rất thích ăn. Sẽ mua lại lần sau!',
    images: [],
    status: 'approved',
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    user: { name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/40?img=2' },
    product: { name: 'Vòng Cổ LED Halloween', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=50' },
    rating: 4,
    content: 'Vòng cổ đẹp, phát sáng tốt. Chỉ tiếc là pin hơi nhanh hết.',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100'],
    status: 'pending',
    createdAt: '2026-01-16'
  },
  {
    id: 3,
    user: { name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/40?img=3' },
    product: { name: 'Áo Halloween Cho Mèo', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50' },
    rating: 3,
    content: 'Áo đẹp nhưng size hơi nhỏ so với mô tả.',
    images: [],
    status: 'pending',
    createdAt: '2026-01-17'
  }
])

const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    const matchSearch = r.content.toLowerCase().includes(searchQuery.value.toLowerCase()) || r.user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRating = !filterRating.value || r.rating === parseInt(filterRating.value)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchRating && matchStatus
  })
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function getStatusText(status) {
  const texts = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' }
  return texts[status]
}

function approveReview(review) {
  review.status = 'approved'
}

function rejectReview(review) {
  review.status = 'rejected'
}

function deleteReview(review) {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    reviews.value = reviews.value.filter(r => r.id !== review.id)
  }
}
</script>

<style scoped>
.admin-reviews {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.page-actions {
  display: flex;
  justify-content: space-between;
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
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  color: #888;
  margin-top: 5px;
}

.stars {
  margin-top: 10px;
  color: #f59e0b;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.reviewer h4 {
  color: white;
  margin-bottom: 3px;
}

.review-date {
  color: #666;
  font-size: 0.85rem;
}

.review-product {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #2d2d2d;
  padding: 8px 15px;
  border-radius: 10px;
}

.review-product img {
  width: 35px;
  height: 35px;
  border-radius: 8px;
}

.review-product span {
  color: #888;
  font-size: 0.9rem;
}

.review-rating {
  margin-bottom: 15px;
}

.review-rating .fas {
  color: #f59e0b;
}

.review-rating .far {
  color: #2d2d2d;
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
  border-radius: 10px;
  object-fit: cover;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #2d2d2d;
}

.review-status {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.review-status.pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.review-status.approved { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.review-status.rejected { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.action-btns {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn-sm {
  padding: 8px 15px;
  font-size: 0.85rem;
}

.btn-success {
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
