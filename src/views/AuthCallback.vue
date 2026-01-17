<template>
  <div class="callback-page">
    <div class="callback-card">
      <div class="loading-spinner" v-if="loading">
        <div class="spinner"></div>
        <p>Đang xử lý đăng nhập...</p>
      </div>
      
      <div class="error-state" v-else-if="error">
        <div class="error-icon">❌</div>
        <h2>Đăng nhập thất bại</h2>
        <p>{{ error }}</p>
        <router-link to="/login" class="btn btn-primary">
          Thử lại
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Lấy token và user info từ query params (được gửi từ backend sau Google OAuth)
    const token = route.query.token
    const userStr = route.query.user
    
    if (token && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr))
      authStore.handleGoogleCallback(token, user)
      router.push('/')
    } else {
      error.value = 'Không nhận được thông tin đăng nhập từ Google'
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi xử lý đăng nhập'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.callback-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 2px solid #2d2d2d;
  border-radius: 24px;
  padding: 60px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #2d2d2d;
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #888;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.error-icon {
  font-size: 3rem;
}

.error-state h2 {
  color: #dc2626;
  margin: 0;
}

.error-state p {
  color: #888;
  margin-bottom: 10px;
}
</style>
