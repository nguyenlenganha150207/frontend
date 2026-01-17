<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Decorative -->
      <div class="login-decoration">
        <div class="decoration-content">
          <h1 class="spooky-title">🎃 Spooky Pet Store</h1>
          <p>Đăng nhập để khám phá thế giới thú cưng ma quái!</p>
          <div class="floating-items">
            <span class="float-item">👻</span>
            <span class="float-item">🦇</span>
            <span class="float-item">🕷️</span>
            <span class="float-item">💀</span>
            <span class="float-item">🎃</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="login-form-wrapper">
        <div class="login-form">
          <h2>Đăng Nhập</h2>
          <p class="form-subtitle">Chào mừng trở lại! 👋</p>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-envelope"></i> Email
              </label>
              <input 
                type="email" 
                v-model="form.email" 
                class="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-lock"></i> Mật khẩu
              </label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.password" 
                  class="form-input"
                  placeholder="••••••••"
                  required
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <router-link to="/forgot-password" class="forgot-password">Quên mật khẩu?</router-link>
            </div>

            <div class="alert alert-error" v-if="error">
              <i class="fas fa-exclamation-circle"></i>
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              <i class="fas fa-sign-in-alt" v-if="!loading"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
            </button>
          </form>

          <div class="divider">
            <span>Hoặc đăng nhập bằng</span>
          </div>

          <button class="google-btn" @click="handleGoogleLogin" :disabled="googleLoading">
            <svg class="google-icon" viewBox="0 0 24 24" v-if="!googleLoading">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <i class="fas fa-spinner fa-spin" v-else></i>
            <span>{{ googleLoading ? 'Đang xử lý...' : 'Đăng nhập với Google' }}</span>
          </button>

          <p class="register-link">
            Chưa có tài khoản? 
            <router-link to="/register">Đăng ký ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}

function handleGoogleLogin() {
  googleLoading.value = true
  window.location.href = '/api/auth/google'
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: #1a1a1a;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid #2d2d2d;
}

/* Decoration Side */
.login-decoration {
  background: linear-gradient(135deg, #6b21a8 0%, #dc2626 50%, #0a0a0a 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.decoration-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.decoration-content h1 {
  font-family: 'Creepster', cursive;
  font-size: 2.5rem;
  color: #f97316;
  margin-bottom: 20px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.decoration-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.floating-items {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.float-item {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

.float-item:nth-child(2) { animation-delay: 0.5s; }
.float-item:nth-child(3) { animation-delay: 1s; }
.float-item:nth-child(4) { animation-delay: 1.5s; }
.float-item:nth-child(5) { animation-delay: 2s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Form Side */
.login-form-wrapper {
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  max-width: 380px;
}

.login-form h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;
}

.form-subtitle {
  color: #888;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #a855f7;
  font-weight: 500;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #a855f7;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  cursor: pointer;
}

.remember-me input {
  accent-color: #6b21a8;
}

.forgot-password {
  color: #a855f7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #dc2626;
}

.alert-error {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-full {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 25px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #2d2d2d;
}

.divider span {
  padding: 0 15px;
  color: #666;
  font-size: 0.9rem;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 24px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 25px;
}

.google-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 22px;
  height: 22px;
}

.register-link {
  text-align: center;
  color: #888;
}

.register-link a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  color: #f97316;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  
  .login-decoration {
    display: none;
  }
  
  .login-form-wrapper {
    padding: 40px 30px;
  }
}
</style>
