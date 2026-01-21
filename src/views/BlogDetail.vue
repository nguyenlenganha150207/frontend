<template>
  <div class="blog-detail-page">
    <!-- Article Header -->
    <section class="article-header">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/blog" class="breadcrumb-link">
            <i class="fas fa-arrow-left"></i>
            Quay lại Blog
          </router-link>
        </div>

        <div v-if="article" class="article-header-content">
          <div class="article-category">{{ article.category }}</div>
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>{{ article.author }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>{{ formatDate(article.date) }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-eye"></i>
              <span>{{ article.views }} lượt xem</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>{{ article.readTime }} phút đọc</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <section v-if="article" class="article-content-section">
      <div class="container">
        <div class="article-layout">
          <!-- Main Content -->
          <div class="article-main">
            <div class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>

            <div class="article-body">
              <div class="article-content" v-html="article.content"></div>

              <!-- Tags -->
              <div class="article-tags">
                <h4>Tags:</h4>
                <div class="tags-list">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- Social Share -->
              <div class="social-share">
                <h4>Chia sẻ bài viết:</h4>
                <div class="share-buttons">
                  <button @click="shareOnFacebook" class="share-btn facebook">
                    <i class="fab fa-facebook-f"></i>
                    Facebook
                  </button>
                  <button @click="shareOnTwitter" class="share-btn twitter">
                    <i class="fab fa-twitter"></i>
                    Twitter
                  </button>
                  <button @click="copyLink" class="share-btn copy">
                    <i class="fas fa-link"></i>
                    Sao chép link
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="article-sidebar">
            <!-- Author Info -->
            <div class="sidebar-card author-card">
              <h4>Về tác giả</h4>
              <div class="author-info">
                <img :src="article.authorAvatar" :alt="article.author" class="author-avatar" />
                <div class="author-details">
                  <h5>{{ article.author }}</h5>
                  <p>{{ article.authorBio }}</p>
                  <div class="author-stats">
                    <span>{{ article.authorArticles }} bài viết</span>
                    <span>{{ article.authorFollowers }} người theo dõi</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Articles -->
            <div class="sidebar-card related-card">
              <h4>Bài viết liên quan</h4>
              <div class="related-articles">
                <article
                  v-for="related in relatedArticles"
                  :key="related.id"
                  class="related-article"
                  @click="goToArticle(related.id)"
                >
                  <img :src="related.image" :alt="related.title" />
                  <div class="related-content">
                    <h5>{{ related.title }}</h5>
                    <span class="related-date">{{ formatDate(related.date) }}</span>
                  </div>
                </article>
              </div>
            </div>

            <!-- Newsletter Signup -->
            <div class="sidebar-card newsletter-card">
              <h4>📧 Nhận bài viết mới</h4>
              <p>Đăng ký để nhận những mẹo chăm sóc thú cưng hữu ích</p>
              <div class="newsletter-form">
                <input
                  type="email"
                  v-model="sidebarNewsletterEmail"
                  placeholder="Nhập email"
                />
                <button @click="subscribeNewsletter" class="btn btn-primary">
                  Đăng ký
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Đang tải bài viết...</p>
    </div>

    <!-- Related Articles Section -->
    <section v-if="article" class="related-section">
      <div class="container">
        <h2>Bài viết khác bạn có thể thích</h2>
        <div class="related-grid">
          <article
            v-for="related in moreRelatedArticles"
            :key="related.id"
            class="related-card-large"
            @click="goToArticle(related.id)"
          >
            <div class="related-image">
              <img :src="related.image" :alt="related.title" />
            </div>
            <div class="related-content">
              <div class="related-category">{{ related.category }}</div>
              <h3>{{ related.title }}</h3>
              <p>{{ related.excerpt }}</p>
              <div class="related-meta">
                <span>{{ related.author }}</span>
                <span>{{ formatDate(related.date) }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Route and router
const route = useRoute()
const router = useRouter()

// Reactive data
const article = ref(null)
const sidebarNewsletterEmail = ref('')
const relatedArticles = ref([])
const moreRelatedArticles = ref([])

// Sample articles data (same as Blog.vue)
const articles = ref([
  {
    id: 1,
    title: 'Cách chọn thức ăn phù hợp cho chó con',
    excerpt: 'Hướng dẫn chi tiết về việc lựa chọn thức ăn phù hợp cho chó con dựa trên độ tuổi, giống chó và nhu cầu dinh dưỡng.',
    content: `
      <h2>Giới thiệu</h2>
      <p>Chọn thức ăn phù hợp cho chó con là một trong những yếu tố quan trọng nhất để đảm bảo sức khỏe và sự phát triển toàn diện của chúng. Việc lựa chọn thức ăn không đúng có thể dẫn đến các vấn đề về dinh dưỡng, ảnh hưởng đến sự phát triển của chó con.</p>

      <h2>Các yếu tố cần xem xét</h2>
      <h3>1. Độ tuổi của chó con</h3>
      <p>Chó con từ 2-6 tháng tuổi cần thức ăn có hàm lượng protein cao (25-30%) và calo nhiều hơn để hỗ trợ sự phát triển nhanh chóng. Chó con từ 6-12 tháng tuổi cần giảm dần hàm lượng calo nhưng vẫn duy trì protein cao.</p>

      <h3>2. Giống chó</h3>
      <p>Các giống chó lớn như Golden Retriever, Labrador cần thức ăn có hàm lượng calo thấp hơn để tránh tăng cân quá nhanh. Ngược lại, các giống chó nhỏ như Chihuahua cần thức ăn giàu calo hơn.</p>

      <h3>3. Trạng thái sức khỏe</h3>
      <p>Nếu chó con có vấn đề về tiêu hóa, bạn nên chọn thức ăn dễ tiêu hóa. Đối với chó con bị dị ứng, cần chọn thức ăn không chứa các thành phần gây dị ứng.</p>

      <h2>Các loại thức ăn phổ biến</h2>
      <ul>
        <li><strong>Thức ăn khô (Kibble):</strong> Tiện lợi, giúp làm sạch răng, bảo quản được lâu</li>
        <li><strong>Thức ăn ướt:</strong> Dễ tiêu hóa, phù hợp cho chó con có vấn đề về răng miệng</li>
        <li><strong>Thức ăn tự làm:</strong> Kiểm soát được chất lượng nhưng cần bổ sung vitamin và khoáng chất</li>
      </ul>

      <h2>Lời khuyên từ chuyên gia</h2>
      <p>Luôn tham khảo ý kiến của bác sĩ thú y trước khi thay đổi chế độ ăn cho chó con. Theo dõi cân nặng và sức khỏe định kỳ để điều chỉnh khẩu phần ăn phù hợp.</p>
    `,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
    category: 'Dinh dưỡng',
    categoryId: 'nutrition',
    author: 'Dr. Nguyễn Văn A',
    authorAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100',
    authorBio: 'Bác sĩ thú y với hơn 10 năm kinh nghiệm trong lĩnh vực dinh dưỡng thú cưng.',
    authorArticles: 25,
    authorFollowers: 1200,
    date: '2024-01-15',
    views: 1250,
    readTime: 5,
    tags: ['chó con', 'thức ăn', 'dinh dưỡng']
  },
  {
    id: 2,
    title: 'Dấu hiệu bệnh thường gặp ở mèo và cách phòng ngừa',
    excerpt: 'Tìm hiểu các dấu hiệu bệnh phổ biến ở mèo và những biện pháp phòng ngừa hiệu quả.',
    content: `
      <h2>Các dấu hiệu bệnh thường gặp</h2>
      <p>Mèo là loài vật rất giỏi che giấu bệnh tật, vì vậy việc nhận biết sớm các dấu hiệu bệnh là rất quan trọng để có thể điều trị kịp thời.</p>

      <h3>Dấu hiệu về hành vi</h3>
      <ul>
        <li>Mèo trở nên lãnh đạm, ít chơi đùa</li>
        <li>Ăn uống thất thường</li>
        <li>Giảm hoạt động, nằm một chỗ</li>
        <li>Tránh tiếp xúc với người</li>
      </ul>

      <h3>Dấu hiệu về thể chất</h3>
      <ul>
        <li>Rụng lông bất thường</li>
        <li>Da khô, ngứa ngáy</li>
        <li>Tiêu chảy hoặc táo bón</li>
        <li>Hơi thở có mùi</li>
      </ul>
    `,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    category: 'Sức khỏe',
    categoryId: 'health',
    author: 'Dr. Trần Thị B',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100',
    authorBio: 'Chuyên gia về sức khỏe mèo với nhiều năm nghiên cứu.',
    authorArticles: 18,
    authorFollowers: 950,
    date: '2024-01-12',
    views: 980,
    readTime: 7,
    tags: ['mèo', 'bệnh', 'phòng ngừa']
  },
  {
    id: 3,
    title: 'Huấn luyện chó đi vệ sinh đúng chỗ',
    excerpt: 'Hướng dẫn từng bước để dạy chó đi vệ sinh đúng chỗ.',
    content: `
      <h2>Nguyên tắc cơ bản</h2>
      <p>Huấn luyện chó đi vệ sinh đúng chỗ đòi hỏi sự kiên nhẫn và nhất quán từ phía chủ nuôi.</p>

      <h3>Bước 1: Chuẩn bị</h3>
      <p>Chọn một khu vực cố định trong nhà hoặc ngoài trời làm nơi đi vệ sinh. Sử dụng chất hấp thụ mùi để đánh dấu khu vực.</p>

      <h3>Bước 2: Lên lịch</h3>
      <p>Đưa chó ra ngoài theo lịch cố định: sau khi thức dậy, sau ăn uống, sau chơi đùa.</p>
    `,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Huấn luyện',
    categoryId: 'training',
    author: 'Huấn luyện viên Minh',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    authorBio: 'Huấn luyện viên chó chuyên nghiệp với 8 năm kinh nghiệm.',
    authorArticles: 32,
    authorFollowers: 2100,
    date: '2024-01-10',
    views: 1540,
    readTime: 6,
    tags: ['huấn luyện', 'chó', 'vệ sinh']
  }
])

// Computed properties
const articleId = computed(() => parseInt(route.params.id))

// Methods
function loadArticle() {
  article.value = articles.value.find(a => a.id === articleId.value)

  if (!article.value) {
    router.push('/blog')
    return
  }

  // Load related articles
  loadRelatedArticles()
}

function loadRelatedArticles() {
  // Get articles from same category, excluding current article
  relatedArticles.value = articles.value
    .filter(a => a.categoryId === article.value.categoryId && a.id !== article.value.id)
    .slice(0, 3)

  // Get more related articles for bottom section
  moreRelatedArticles.value = articles.value
    .filter(a => a.id !== article.value.id)
    .slice(0, 3)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function goToArticle(id) {
  router.push(`/blog/${id}`)
}

function shareOnFacebook() {
  const url = window.location.href
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(shareUrl, '_blank')
}

function shareOnTwitter() {
  const url = window.location.href
  const text = `Đọc bài viết: ${article.value.title}`
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  window.open(shareUrl, '_blank')
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('Đã sao chép link vào clipboard!')
}

function subscribeNewsletter() {
  if (!sidebarNewsletterEmail.value.trim()) {
    alert('Vui lòng nhập email!')
    return
  }

  alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi bài viết mới nhất đến email của bạn.')
  sidebarNewsletterEmail.value = ''
}

// Lifecycle
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
}

/* Article Header */
.article-header {
  background: linear-gradient(135deg, #1e0a3c 0%, #2d1654 40%, #4c1d6e 100%);
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
}

.article-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(219, 39, 119, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.breadcrumb {
  margin-bottom: 30px;
}

.breadcrumb-link {
  color: #a855f7;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #8b5cf6;
}

.article-header-content {
  text-align: center;
}

.article-category {
  display: inline-block;
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.article-header-content h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.9rem;
}

/* Article Content */
.article-content-section {
  padding: 60px 0;
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 50px;
}

.article-main {
  background: linear-gradient(145deg, rgba(76, 29, 110, 0.5) 0%, rgba(45, 22, 84, 0.6) 100%);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.article-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-body {
  padding: 40px;
}

.article-content {
  color: #ccc;
  line-height: 1.8;
  margin-bottom: 40px;
}

.article-content h2 {
  color: white;
  font-size: 1.8rem;
  margin: 40px 0 20px 0;
}

.article-content h3 {
  color: white;
  font-size: 1.4rem;
  margin: 30px 0 15px 0;
}

.article-content ul {
  margin: 20px 0;
  padding-left: 30px;
}

.article-content li {
  margin-bottom: 10px;
}

.article-content strong {
  color: white;
}

/* Tags */
.article-tags {
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  padding-top: 30px;
  margin-bottom: 30px;
}

.article-tags h4 {
  color: white;
  margin-bottom: 15px;
}

.tags-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(147, 51, 234, 0.25);
  color: #c084fc;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

/* Social Share */
.social-share {
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  padding-top: 30px;
}

.social-share h4 {
  color: white;
  margin-bottom: 15px;
}

.share-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  background: rgba(76, 29, 110, 0.4);
  color: #e9d5ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-btn:hover {
  border-color: #c084fc;
  color: #c084fc;
  background: rgba(147, 51, 234, 0.3);
}

.share-btn.facebook:hover {
  border-color: #1877f2;
  color: #1877f2;
}

.share-btn.twitter:hover {
  border-color: #1da1f2;
  color: #1da1f2;
}

/* Sidebar */
.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-card {
  background: linear-gradient(145deg, rgba(76, 29, 110, 0.5) 0%, rgba(45, 22, 84, 0.6) 100%);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.sidebar-card h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

/* Author Card */
.author-info {
  display: flex;
  gap: 15px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details h5 {
  color: white;
  margin-bottom: 8px;
}

.author-details p {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.author-stats {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #888;
}

/* Related Articles */
.related-articles {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-article {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.related-article:hover {
  background: rgba(168, 85, 247, 0.1);
}

.related-article img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.related-content h5 {
  color: white;
  font-size: 0.9rem;
  margin-bottom: 5px;
  line-height: 1.3;
}

.related-date {
  color: #888;
  font-size: 0.8rem;
}

/* Newsletter */
.newsletter-card p {
  color: #e9d5ff;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.newsletter-form input {
  padding: 12px 15px;
  background: rgba(30, 10, 60, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  color: white;
}

.newsletter-form input:focus {
  outline: none;
  border-color: #c084fc;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #9333ea, #db2777);
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.4);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #ccc;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #2d2d2d;
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Related Section */
.related-section {
  padding: 80px 0;
  background: linear-gradient(180deg, transparent 0%, rgba(30, 10, 60, 0.4) 100%);
}

.related-section h2 {
  color: white;
  text-align: center;
  margin-bottom: 50px;
  font-size: 2rem;
  text-shadow: 0 2px 10px rgba(147, 51, 234, 0.3);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.related-card-large {
  background: linear-gradient(145deg, rgba(76, 29, 110, 0.5) 0%, rgba(45, 22, 84, 0.6) 100%);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.related-card-large:hover {
  transform: translateY(-8px);
  border-color: #c084fc;
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.35), 0 0 30px rgba(219, 39, 119, 0.2);
}

.related-image {
  height: 200px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card-large:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: 25px;
}

.related-category {
  color: #a855f7;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.related-content h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.related-content p {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
}

/* Responsive */
@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .article-header-content h1 {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 15px;
  }

  .article-body {
    padding: 25px;
  }

  .share-buttons {
    flex-direction: column;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
