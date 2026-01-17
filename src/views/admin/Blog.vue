<template>
  <div class="admin-blog">
    <div class="page-header">
      <h1><i class="fas fa-blog"></i> Quản lý Blog</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="fas fa-plus"></i> Tạo bài viết mới
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ blogPosts.length }}</h3>
          <p>Tổng bài viết</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalViews }}</h3>
          <p>Tổng lượt xem</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-heart"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalLikes }}</h3>
          <p>Tổng lượt thích</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-comments"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalComments }}</h3>
          <p>Tổng bình luận</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm bài viết..."
          @input="filterPosts"
        />
        <i class="fas fa-search"></i>
      </div>
      <div class="filter-buttons">
        <button
          v-for="status in statusFilters"
          :key="status.id"
          :class="['filter-btn', { active: activeStatus === status.id }]"
          @click="setStatusFilter(status.id)"
        >
          {{ status.name }}
        </button>
      </div>
    </div>

    <!-- Blog Posts Table -->
    <div class="posts-table">
      <div class="table-header">
        <h3>Danh sách bài viết</h3>
        <div class="table-actions">
          <select v-model="sortBy" @change="sortPosts">
            <option value="date">Sắp xếp theo ngày</option>
            <option value="views">Sắp xếp theo lượt xem</option>
            <option value="title">Sắp xếp theo tiêu đề</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in paginatedPosts" :key="post.id">
              <td>
                <img :src="post.image" :alt="post.title" class="post-thumbnail" />
              </td>
              <td>
                <div class="post-title">
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.excerpt }}</p>
                </div>
              </td>
              <td>{{ post.author }}</td>
              <td>
                <span class="category-badge">{{ post.category }}</span>
              </td>
              <td>
                <span :class="['status-badge', post.status]">
                  {{ getStatusText(post.status) }}
                </span>
              </td>
              <td>{{ post.views }}</td>
              <td>{{ formatDate(post.date) }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon edit" @click="editPost(post)" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon view" @click="viewPost(post)" title="Xem">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="btn-icon delete"
                    @click="deletePost(post)"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="savePost" class="post-form">
          <div class="form-row">
            <div class="form-group">
              <label>Tiêu đề *</label>
              <input type="text" v-model="postForm.title" required />
            </div>
            <div class="form-group">
              <label>Danh mục *</label>
              <select v-model="postForm.categoryId" required>
                <option value="">Chọn danh mục</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Tóm tắt *</label>
            <textarea v-model="postForm.excerpt" rows="3" required></textarea>
          </div>

          <div class="form-group">
            <label>Nội dung *</label>
            <textarea v-model="postForm.content" rows="10" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Hình ảnh *</label>
              <input type="url" v-model="postForm.image" placeholder="URL hình ảnh" required />
            </div>
            <div class="form-group">
              <label>Tags (phân cách bằng dấu phẩy)</label>
              <input type="text" v-model="postForm.tags" placeholder="chó, mèo, chăm sóc" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="postForm.status">
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tác giả</label>
              <input type="text" v-model="postForm.author" />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Cập nhật' : 'Tạo bài viết' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const blogPosts = ref([
  {
    id: 1,
    title: 'Cách chọn thức ăn phù hợp cho chó con',
    excerpt: 'Hướng dẫn chi tiết về việc lựa chọn thức ăn phù hợp cho chó con...',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    category: 'Dinh dưỡng',
    categoryId: 'nutrition',
    author: 'Dr. Nguyễn Văn A',
    status: 'published',
    date: '2024-01-15',
    views: 1250,
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: 'Dấu hiệu bệnh thường gặp ở mèo',
    excerpt: 'Tìm hiểu các dấu hiệu bệnh phổ biến ở mèo...',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    category: 'Sức khỏe',
    categoryId: 'health',
    author: 'Dr. Trần Thị B',
    status: 'published',
    date: '2024-01-12',
    views: 980,
    likes: 32,
    comments: 8
  },
  {
    id: 3,
    title: 'Huấn luyện chó đi vệ sinh đúng chỗ',
    excerpt: 'Hướng dẫn từng bước để dạy chó đi vệ sinh đúng chỗ...',
    content: 'Nội dung đầy đủ của bài viết...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Huấn luyện',
    categoryId: 'training',
    author: 'Huấn luyện viên Minh',
    status: 'draft',
    date: '2024-01-10',
    views: 0,
    likes: 0,
    comments: 0
  }
])

const categories = ref([
  { id: 'care', name: 'Chăm sóc' },
  { id: 'health', name: 'Sức khỏe' },
  { id: 'training', name: 'Huấn luyện' },
  { id: 'nutrition', name: 'Dinh dưỡng' },
  { id: 'grooming', name: 'Làm đẹp' }
])

const statusFilters = ref([
  { id: 'all', name: 'Tất cả' },
  { id: 'published', name: 'Đã xuất bản' },
  { id: 'draft', name: 'Bản nháp' },
  { id: 'archived', name: 'Lưu trữ' }
])

const searchQuery = ref('')
const activeStatus = ref('all')
const sortBy = ref('date')
const currentPage = ref(1)
const postsPerPage = ref(10)
const showModal = ref(false)
const isEditing = ref(false)
const editingPost = ref(null)

const postForm = ref({
  title: '',
  excerpt: '',
  content: '',
  image: '',
  categoryId: '',
  author: '',
  tags: '',
  status: 'draft'
})

// Computed properties
const filteredPosts = computed(() => {
  let filtered = blogPosts.value

  // Filter by status
  if (activeStatus.value !== 'all') {
    filtered = filtered.filter(post => post.status === activeStatus.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  }

  // Sort posts
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'views':
        return b.views - a.views
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage.value))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage.value
  const end = start + postsPerPage.value
  return filteredPosts.value.slice(start, end)
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

const totalViews = computed(() => blogPosts.value.reduce((sum, post) => sum + post.views, 0))
const totalLikes = computed(() => blogPosts.value.reduce((sum, post) => sum + post.likes, 0))
const totalComments = computed(() => blogPosts.value.reduce((sum, post) => sum + post.comments, 0))

// Methods
function filterPosts() {
  currentPage.value = 1
}

function setStatusFilter(status) {
  activeStatus.value = status
  currentPage.value = 1
}

function sortPosts() {
  currentPage.value = 1
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

function getStatusText(status) {
  const statusMap = {
    published: 'Đã xuất bản',
    draft: 'Bản nháp',
    archived: 'Lưu trữ'
  }
  return statusMap[status] || status
}

function openCreateModal() {
  isEditing.value = false
  postForm.value = {
    title: '',
    excerpt: '',
    content: '',
    image: '',
    categoryId: '',
    author: '',
    tags: '',
    status: 'draft'
  }
  showModal.value = true
}

function editPost(post) {
  isEditing.value = true
  editingPost.value = post
  postForm.value = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    categoryId: post.categoryId,
    author: post.author,
    tags: post.tags ? post.tags.join(', ') : '',
    status: post.status
  }
  showModal.value = true
}

function viewPost(post) {
  // Open in new tab or navigate to blog detail
  window.open(`/blog/${post.id}`, '_blank')
}

function deletePost(post) {
  if (confirm(`Bạn có chắc muốn xóa bài viết "${post.title}"?`)) {
    const index = blogPosts.value.findIndex(p => p.id === post.id)
    if (index > -1) {
      blogPosts.value.splice(index, 1)
    }
  }
}

function savePost() {
  const category = categories.value.find(c => c.categoryId === postForm.value.categoryId)
  const postData = {
    ...postForm.value,
    category: category ? category.name : '',
    tags: postForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    date: isEditing.value ? editingPost.value.date : new Date().toISOString().split('T')[0],
    views: isEditing.value ? editingPost.value.views : 0,
    likes: isEditing.value ? editingPost.value.likes : 0,
    comments: isEditing.value ? editingPost.value.comments : 0
  }

  if (isEditing.value) {
    const index = blogPosts.value.findIndex(p => p.id === editingPost.value.id)
    if (index > -1) {
      blogPosts.value[index] = { ...editingPost.value, ...postData }
    }
  } else {
    const newPost = {
      ...postData,
      id: Math.max(...blogPosts.value.map(p => p.id)) + 1
    }
    blogPosts.value.unshift(newPost)
  }

  closeModal()
}

function closeModal() {
  showModal.value = false
  isEditing.value = false
  editingPost.value = null
}

// Lifecycle
onMounted(() => {
  // Any initialization if needed
})
</script>

<style scoped>
.admin-blog {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #a855f7, #8b5cf6);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(168, 85, 247, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #a855f7, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  color: white;
  font-size: 2rem;
  margin-bottom: 5px;
}

.stat-content p {
  color: #ccc;
  margin: 0;
}

/* Filters */
.filters-section {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-box input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: white;
}

.search-box i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 10px 20px;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #a855f7;
  color: white;
  border-color: #a855f7;
}

/* Posts Table */
.posts-table {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  padding: 25px;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  color: white;
  margin: 0;
}

.table-actions select {
  padding: 8px 12px;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 6px;
  color: white;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  padding: 15px 20px;
  text-align: left;
  color: #ccc;
  font-weight: 500;
  border-bottom: 1px solid #2d2d2d;
}

tbody td {
  padding: 20px;
  border-bottom: 1px solid #2d2d2d;
  vertical-align: top;
}

.post-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.post-title h4 {
  color: white;
  margin-bottom: 5px;
  font-size: 1rem;
}

.post-title p {
  color: #ccc;
  font-size: 0.85rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-badge {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.published {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-badge.draft {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.status-badge.archived {
  background: rgba(156, 163, 175, 0.2);
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.btn-icon.edit:hover {
  background: #3b82f6;
  color: white;
}

.btn-icon.view {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.btn-icon.view:hover {
  background: #22c55e;
  color: white;
}

.btn-icon.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-icon.delete:hover {
  background: #ef4444;
  color: white;
}

/* Pagination */
.pagination {
  padding: 25px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.page-btn {
  padding: 10px 15px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled),
.page-btn.active {
  background: #a855f7;
  color: white;
  border-color: #a855f7;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

.modal-content {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 25px;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.post-form {
  padding: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #ccc;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  background: #0f0f12;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #a855f7;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #2d2d2d;
}

.btn-secondary {
  background: #2d2d2d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #404040;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .table-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
