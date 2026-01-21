<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="blog-hero">
      <div class="hero-content">
        <h1>🐾 Blog Chăm Sóc Thú Cưng</h1>
        <p>Khám phá những bí quyết chăm sóc thú cưng tốt nhất từ các chuyên gia</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="number">{{ articles.length }}</span>
            <span class="label">Bài viết</span>
          </div>
          <div class="stat">
            <span class="number">50+</span>
            <span class="label">Mẹo hay</span>
          </div>
          <div class="stat">
            <span class="number">1000+</span>
            <span class="label">Người đọc</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filter -->
    <section class="blog-controls">
      <div class="container">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm bài viết..."
            @input="filterArticles"
          />
          <i class="fas fa-search"></i>
        </div>
        <div class="filter-buttons">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['filter-btn', { active: activeCategory === category.id }]"
            @click="setCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="articles-section">
      <div class="container">
        <div v-if="filteredArticles.length === 0" class="no-articles">
          <i class="fas fa-search"></i>
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </div>

        <div v-else class="articles-grid">
          <article
            v-for="article in paginatedArticles"
            :key="article.id"
            class="article-card"
            @click="goToArticle(article.id)"
          >
            <div class="article-image">
              <img :src="article.image" :alt="article.title" />
              <div class="article-category">{{ article.category }}</div>
            </div>
            <div class="article-content">
              <h3>{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-meta">
                <span class="author">
                  <i class="fas fa-user"></i>
                  {{ article.author }}
                </span>
                <span class="date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(article.date) }}
                </span>
                <span class="views">
                  <i class="fas fa-eye"></i>
                  {{ article.views }}
                </span>
              </div>
              <div class="read-more">
                Đọc tiếp <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="page-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['page-btn', { active: page === currentPage }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="page-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <h2>📧 Nhận bài viết mới nhất</h2>
          <p>Đăng ký để nhận những mẹo chăm sóc thú cưng hữu ích qua email</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" v-model="newsletterEmail" />
            <button @click="subscribeNewsletter" class="btn btn-primary">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const articlesPerPage = 9
const newsletterEmail = ref('')

// Categories
const categories = ref([
  { id: 'all', name: 'Tất cả' },
  { id: 'care', name: 'Chăm sóc' },
  { id: 'health', name: 'Sức khỏe' },
  { id: 'training', name: 'Huấn luyện' },
  { id: 'nutrition', name: 'Dinh dưỡng' },
  { id: 'grooming', name: 'Làm đẹp' }
])

// Sample articles data
const articles = ref([
  {
    id: 1,
    title: 'Cách chọn thức ăn phù hợp cho chó con',
    excerpt: 'Hướng dẫn chi tiết về việc lựa chọn thức ăn phù hợp cho chó con dựa trên độ tuổi, giống chó và nhu cầu dinh dưỡng.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    category: 'Dinh dưỡng',
    categoryId: 'nutrition',
    author: 'Dr. Nguyễn Văn A',
    date: '2024-01-15',
    views: 1250,
    tags: ['chó con', 'thức ăn', 'dinh dưỡng']
  },
  {
    id: 2,
    title: 'Dấu hiệu bệnh thường gặp ở mèo và cách phòng ngừa',
    excerpt: 'Tìm hiểu các dấu hiệu bệnh phổ biến ở mèo và những biện pháp phòng ngừa hiệu quả để giữ cho mèo luôn khỏe mạnh.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    category: 'Sức khỏe',
    categoryId: 'health',
    author: 'Dr. Trần Thị B',
    date: '2024-01-12',
    views: 980,
    tags: ['mèo', 'bệnh', 'phòng ngừa']
  },
  {
    id: 3,
    title: 'Huấn luyện chó đi vệ sinh đúng chỗ',
    excerpt: 'Hướng dẫn từng bước để dạy chó đi vệ sinh đúng chỗ một cách hiệu quả và nhân đạo.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Huấn luyện',
    categoryId: 'training',
    author: 'Huấn luyện viên Minh',
    date: '2024-01-10',
    views: 1540,
    tags: ['huấn luyện', 'chó', 'vệ sinh']
  },
  {
    id: 4,
    title: 'Lịch tiêm phòng cho thú cưng theo độ tuổi',
    excerpt: 'Bảng lịch tiêm phòng đầy đủ cho chó và mèo theo từng giai đoạn phát triển.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
    category: 'Sức khỏe',
    categoryId: 'health',
    author: 'Dr. Lê Văn C',
    date: '2024-01-08',
    views: 890,
    tags: ['tiêm phòng', 'chó', 'mèo']
  },
  {
    id: 5,
    title: 'Cách cắt tỉa lông cho chó tại nhà',
    excerpt: 'Hướng dẫn chi tiết cách cắt tỉa lông cho chó tại nhà an toàn và hiệu quả.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    category: 'Làm đẹp',
    categoryId: 'grooming',
    author: 'Stylist Linh',
    date: '2024-01-05',
    views: 720,
    tags: ['cắt tỉa', 'lông', 'chó']
  },
  {
    id: 6,
    title: 'Thói quen chăm sóc hàng ngày cho mèo',
    excerpt: 'Những thói quen chăm sóc cơ bản mà mọi chủ nuôi mèo nên biết và thực hiện.',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    category: 'Chăm sóc',
    categoryId: 'care',
    author: 'Chuyên gia Pet Care',
    date: '2024-01-03',
    views: 1100,
    tags: ['mèo', 'chăm sóc', 'hàng ngày']
  }
])

// Computed properties
const filteredArticles = computed(() => {
  let filtered = articles.value

  // Filter by category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(article => article.categoryId === activeCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
function setCategory(categoryId) {
  activeCategory.value = categoryId
  currentPage.value = 1
}

function filterArticles() {
  currentPage.value = 1
}

function goToArticle(articleId) {
  router.push(`/blog/${articleId}`)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function subscribeNewsletter() {
  if (!newsletterEmail.value.trim()) {
    alert('Vui lòng nhập email!')
    return
  }

  // Here you would send the email to your backend
  alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi bài viết mới nhất đến email của bạn.')
  newsletterEmail.value = ''
}

// Watch for category changes to reset page
onMounted(() => {
  // Any initialization if needed
})
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
}

/* Hero Section */
.blog-hero {
  background: linear-gradient(135deg, #1e0a3c 0%, #2d1654 30%, #4c1d6e 60%, #7c3aad 100%);
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.blog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(219, 39, 119, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.3)"/><circle cx="80" cy="40" r="0.5" fill="rgba(255,255,255,0.4)"/><circle cx="60" cy="80" r="0.8" fill="rgba(255,255,255,0.2)"/><circle cx="40" cy="60" r="0.6" fill="rgba(255,255,255,0.35)"/></svg>');
  opacity: 0.8;
}

.hero-content h1 {
  color: white;
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-content p {
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 40px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat {
  text-align: center;
}

.stat .number {
  display: block;
  color: #a855f7;
  font-size: 2.5rem;
  font-weight: bold;
}

.stat .label {
  color: #888;
  font-size: 0.9rem;
}

/* Controls */
.blog-controls {
  padding: 40px 0;
  background: linear-gradient(180deg, #1e1145 0%, #2a1856 50%, #1a1040 100%);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  position: relative;
}

.blog-controls::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-bar {
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
}

.search-bar input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  background: rgba(30, 17, 69, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.search-bar input:focus {
  outline: none;
  border-color: #a855f7;
  background: rgba(30, 30, 45, 0.9);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
}

.search-bar i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: rgba(30, 17, 69, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 20px;
  color: #d4b5fd;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  color: white;
  border-color: transparent;
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.4);
  transform: translateY(-2px);
}

/* Articles */
.articles-section {
  padding: 60px 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.article-card {
  background: linear-gradient(145deg, #2d1b4e 0%, #1a1035 100%);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-8px);
  border-color: #a855f7;
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.35);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(168, 85, 247, 0.9);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-content {
  padding: 25px;
}

.article-content h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.article-excerpt {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 15px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.read-more {
  color: #a855f7;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.article-card:hover .read-more {
  color: #8b5cf6;
}

/* No articles */
.no-articles {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.no-articles i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #a855f7;
}

.no-articles h3 {
  color: white;
  margin-bottom: 10px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-btn {
  padding: 10px 15px;
  background: rgba(76, 29, 110, 0.4);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  color: #e9d5ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled),
.page-btn.active {
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  color: white;
  border-color: transparent;
  box-shadow: 0 5px 15px rgba(147, 51, 234, 0.4);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Newsletter */
.newsletter-section {
  background: linear-gradient(135deg, rgba(30, 10, 60, 0.8) 0%, rgba(76, 29, 110, 0.6) 50%, rgba(124, 58, 173, 0.4) 100%);
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.newsletter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(219, 39, 119, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.newsletter-content {
  position: relative;
  z-index: 1;
}

.newsletter-content h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(147, 51, 234, 0.3);
}

.newsletter-content p {
  color: #e9d5ff;
  margin-bottom: 30px;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 15px;
}

.newsletter-form input {
  flex: 1;
  padding: 15px 20px;
  background: rgba(76, 29, 110, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 25px;
  color: white;
  backdrop-filter: blur(10px);
}

.newsletter-form input:focus {
  outline: none;
  border-color: #c084fc;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #9333ea, #db2777);
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.5), 0 0 30px rgba(219, 39, 119, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .article-meta {
    flex-direction: column;
    gap: 8px;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .filter-buttons {
    justify-content: center;
  }
}
</style>
