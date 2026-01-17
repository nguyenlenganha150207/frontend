<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Form Side -->
      <div class="register-form-wrapper">
        <div class="register-form">
          <h2>Đăng Ký Tài Khoản</h2>
          <p class="form-subtitle">Tham gia cùng chúng tôi! 🎃</p>

          <form @submit.prevent="handleRegister">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-user"></i> Họ tên
                </label>
                <input 
                  type="text" 
                  v-model="form.name" 
                  class="form-input"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-phone"></i> Số điện thoại
                </label>
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  class="form-input"
                  placeholder="0123 456 789"
                  required
                />
              </div>
            </div>

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
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minlength="6"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-lock"></i> Xác nhận mật khẩu
              </label>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.confirmPassword" 
                class="form-input"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <div class="form-group">
              <label class="terms-checkbox">
                <input type="checkbox" v-model="acceptTerms" required />
                <span>Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a></span>
              </label>
            </div>

            <div class="alert alert-error" v-if="error">
              <i class="fas fa-exclamation-circle"></i>
              {{ error }}
            </div>

            <div class="alert alert-success" v-if="success">
              <i class="fas fa-check-circle"></i>
              {{ success }}
            </div>

            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              <i class="fas fa-user-plus" v-if="!loading"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ loading ? 'Đang đăng ký...' : 'Đăng Ký' }}
            </button>
          </form>

          <p class="login-link">
            Đã có tài khoản? 
            <router-link to="/login">Đăng nhập ngay</router-link>
          </p>
        </div>
      </div>

      <!-- Decoration Side -->
      <div class="register-decoration">
        <div class="decoration-content">
          <h1 class="spooky-title">🦇 Welcome!</h1>
          <p>Trở thành thành viên để nhận nhiều ưu đãi hấp dẫn</p>
          
          <div class="benefits">
            <div class="benefit-item">
              <i class="fas fa-gift"></i>
              <span>Giảm 10% đơn hàng đầu tiên</span>
            </div>
            <div class="benefit-item">
              <i class="fas fa-truck"></i>
              <span>Miễn phí vận chuyển từ 500k</span>
            </div>
            <div class="benefit-item">
              <i class="fas fa-star"></i>
              <span>Tích điểm đổi quà hấp dẫn</span>
            </div>
          </div>

          <div class="floating-items">
            <span class="float-item">🎃</span>
            <span class="float-item">👻</span>
            <span class="float-item">🦇</span>
          </div>
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
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})
const showPassword = ref(false)
const acceptTerms = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Mật khẩu không khớp!'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form.value)
    success.value = 'Đăng ký thành công! Đang chuyển hướng...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  width: 100%;
  background: #1a1a1a;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid #2d2d2d;
}

/* Form Side */
.register-form-wrapper {
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-form {
  width: 100%;
  max-width: 450px;
}

.register-form h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;
}

.form-subtitle {
  color: #888;
  margin-bottom: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #a855f7;
  font-weight: 500;
  font-size: 0.95rem;
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

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #888;
  font-size: 0.9rem;
  cursor: pointer;
}

.terms-checkbox input {
  margin-top: 3px;
  accent-color: #6b21a8;
}

.terms-checkbox a {
  color: #a855f7;
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.btn-full {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  color: #888;
  margin-top: 25px;
}

.login-link a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  color: #f97316;
}

/* Decoration Side */
.register-decoration {
  background: linear-gradient(135deg, #0a0a0a 0%, #dc2626 50%, #6b21a8 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.decoration-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.decoration-content h1 {
  font-family: 'Creepster', cursive;
  font-size: 3rem;
  color: #f97316;
  margin-bottom: 15px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.decoration-content > p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.benefit-item i {
  font-size: 1.5rem;
  color: #f97316;
}

.benefit-item span {
  color: white;
}

.floating-items {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.float-item {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

.float-item:nth-child(2) { animation-delay: 0.5s; }
.float-item:nth-child(3) { animation-delay: 1s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 992px) {
  .register-container {
    grid-template-columns: 1fr;
  }
  
  .register-decoration {
    display: none;
  }
}

@media (max-width: 576px) {
  .register-form-wrapper {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
