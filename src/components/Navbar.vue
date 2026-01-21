<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img src="/Logo.jpg" alt="Pet Store Logo" class="logo-img" />
          <span class="logo-text">
            <span class="spooky-title">Spooky</span>
            <span>Pet Store</span>
          </span>
        </router-link>

        <!-- Navigation Links -->
        <nav class="nav-links" :class="{ 'active': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-home"></i> Trang Chủ
          </router-link>
          <router-link to="/pets" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-paw"></i> Thú Cưng
          </router-link>
          <router-link to="/products" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-box"></i> Sản Phẩm
          </router-link>
          <router-link to="/blog" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-blog"></i> Blog/Tips
          </router-link>
          <router-link to="/about" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-ghost"></i> Về Chúng Tôi
          </router-link>
          <router-link to="/contact" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-envelope"></i> Liên Hệ
          </router-link>
          <router-link to="/staff" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-users"></i> Nhân Viên
          </router-link>
        </nav>

        <!-- Right Section -->
        <div class="nav-right">
          <!-- Search -->
          <div class="search-box" :class="{ 'active': searchOpen }">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Tìm kiếm..." 
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="toggleSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>

          <!-- Wishlist - Visible for all users -->
          <router-link to="/wishlist" class="wishlist-btn" title="Danh sách yêu thích">
            <i class="fas fa-heart"></i>
          </router-link>

          <!-- Cart -->
          <router-link to="/cart" class="cart-btn">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-badge" v-if="cartStore.totalItems > 0">
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div class="user-menu" v-if="authStore.isAuthenticated">
            <button class="user-btn" @click="toggleUserMenu">
              <i class="fas fa-user-circle"></i>
              <span>{{ authStore.user?.name || 'User' }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" v-if="userMenuOpen">
              <router-link to="/profile" @click="closeUserMenu">
                <i class="fas fa-user"></i> Tài Khoản
              </router-link>
              <router-link to="/orders" @click="closeUserMenu">
                <i class="fas fa-receipt"></i> Đơn Hàng
              </router-link>
              <router-link to="/wishlist" @click="closeUserMenu">
                <i class="fas fa-heart"></i> Yêu Thích
              </router-link>
              <router-link to="/reviews" @click="closeUserMenu">
                <i class="fas fa-star"></i> Đánh Giá
              </router-link>
              <button @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i> Đăng Xuất
              </button>
            </div>
          </div>
          <router-link to="/login" class="btn btn-primary login-btn" v-else>
            <i class="fas fa-sign-in-alt"></i> Đăng Nhập
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-toggle" @click="toggleMobileMenu">
            <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const isScrolled = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const userMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } })
    searchQuery.value = ''
    searchOpen.value = false
  }
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function closeUserMenu() {
  userMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  closeUserMenu()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 15px 0;
  transition: all 0.3s ease;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
}

.navbar.scrolled {
  padding: 10px 0;
  background: rgba(10, 10, 10, 0.95);
  box-shadow: 0 5px 30px rgba(107, 33, 168, 0.3);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
}

.logo-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-text .spooky-title {
  font-family: 'Creepster', cursive;
  font-size: 1.5rem;
  color: #f97316;
}

.logo-text span:last-child {
  font-size: 0.9rem;
  color: #a855f7;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #f8f8f8;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #6b21a8, #dc2626);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #a855f7;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-box input {
  width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-box.active input {
  width: 200px;
  padding: 10px 15px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  color: #a855f7;
}

.cart-btn {
  position: relative;
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  color: #a855f7;
  transform: scale(1.1);
}

.wishlist-btn {
  position: relative;
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.wishlist-btn:hover {
  color: #ff6b9d;
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(107, 33, 168, 0.3);
  border: 1px solid #6b21a8;
  padding: 8px 15px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(107, 33, 168, 0.5);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #1a1a1a;
  border: 1px solid #6b21a8;
  border-radius: 12px;
  overflow: hidden;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.user-dropdown a,
.user-dropdown button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-dropdown a:hover,
.user-dropdown button:hover {
  background: rgba(107, 33, 168, 0.3);
  color: #a855f7;
}

.login-btn {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 992px) {
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.98);
    flex-direction: column;
    padding: 20px;
    gap: 10px;
    transform: translateY(-150%);
    transition: transform 0.3s ease;
  }

  .nav-links.active {
    transform: translateY(0);
  }

  .nav-link {
    padding: 15px;
    border-radius: 10px;
  }

  .nav-link:hover {
    background: rgba(107, 33, 168, 0.2);
  }

  .mobile-toggle {
    display: block;
  }

  .search-box.active input {
    width: 150px;
  }
}

@media (max-width: 576px) {
  .logo-text {
    display: none;
  }

  .login-btn span {
    display: none;
  }
}
</style>
