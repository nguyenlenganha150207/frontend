<template>
  <div class="forgot-page">
    <div class="forgot-container">
      <div class="forgot-card">
        <!-- Header -->
        <div class="forgot-header">
          <div class="icon-wrapper">
            <i class="fas fa-key"></i>
          </div>
          <h2>Quên Mật Khẩu?</h2>
          <p>Đừng lo, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email của bạn.</p>
        </div>

        <!-- Success State -->
        <div class="success-state" v-if="emailSent">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Email đã được gửi! 📧</h3>
          <p>Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{{ form.email }}</strong></p>
          <p class="hint">Vui lòng kiểm tra hộp thư (và cả thư rác) của bạn.</p>
          
          <div class="resend-section">
            <p>Không nhận được email?</p>
            <button 
              class="btn btn-outline btn-sm" 
              @click="handleResend" 
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại email' }}
            </button>
          </div>

          <router-link to="/login" class="btn btn-primary btn-full mt-3">
            <i class="fas fa-arrow-left"></i> Quay lại đăng nhập
          </router-link>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-envelope"></i> Địa chỉ Email
            </label>
            <input 
              type="email" 
              v-model="form.email" 
              class="form-input"
              placeholder="Nhập email đã đăng ký"
              required
              autofocus
            />
          </div>

          <div class="alert alert-error" v-if="error">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <i class="fas fa-paper-plane" v-if="!loading"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ loading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
          </button>

          <router-link to="/login" class="back-link">
            <i class="fas fa-arrow-left"></i> Quay lại đăng nhập
          </router-link>
        </form>

        <!-- Floating Items -->
        <div class="floating-items">
          <span class="float-item">🔐</span>
          <span class="float-item">✉️</span>
          <span class="float-item">🎃</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { authAPI } from '../api'

const form = ref({
  email: ''
})
const loading = ref(false)
const error = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)

let cooldownInterval = null

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    await authAPI.forgotPassword(form.value.email)
    emailSent.value = true
    startResendCooldown()
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}

async function handleResend() {
  if (resendCooldown.value > 0) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authAPI.forgotPassword(form.value.email)
    startResendCooldown()
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể gửi lại email. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}

function startResendCooldown() {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(220, 38, 38, 0.2) 0%, transparent 50%);
}

.forgot-container {
  width: 100%;
  max-width: 450px;
}

.forgot-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 2px solid #2d2d2d;
  border-radius: 24px;
  padding: 50px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.forgot-header {
  text-align: center;
  margin-bottom: 35px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #6b21a8 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.forgot-header h2 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.forgot-header p {
  color: #888;
  font-size: 0.95rem;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #a855f7;
  font-weight: 500;
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

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 25px;
  color: #888;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #a855f7;
}

/* Success State */
.success-state {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #22c55e;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.success-state h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.success-state p {
  color: #888;
  margin-bottom: 10px;
}

.success-state p strong {
  color: #a855f7;
}

.success-state .hint {
  font-size: 0.85rem;
  color: #666;
}

.resend-section {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #2d2d2d;
}

.resend-section p {
  margin-bottom: 15px;
  color: #888;
}

.btn-sm {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.mt-3 {
  margin-top: 25px;
}

/* Floating Items */
.floating-items {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
}

.float-item {
  font-size: 1.5rem;
  opacity: 0.2;
  animation: float 3s ease-in-out infinite;
}

.float-item:nth-child(2) { animation-delay: 1s; }
.float-item:nth-child(3) { animation-delay: 2s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@media (max-width: 480px) {
  .forgot-card {
    padding: 40px 25px;
  }
  
  .forgot-header h2 {
    font-size: 1.5rem;
  }
  
  .icon-wrapper {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
}
</style>
