<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <router-link to="/admin" class="logo">
          <span class="logo-icon">🎃</span>
          <span class="logo-text" v-if="!sidebarCollapsed">Admin Panel</span>
        </router-link>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact-active-class="active">
          <i class="fas fa-tachometer-alt"></i>
          <span v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" active-class="active">
          <i class="fas fa-box"></i>
          <span v-if="!sidebarCollapsed">Sản phẩm</span>
        </router-link>
        <router-link to="/admin/pets" class="nav-item" active-class="active">
          <i class="fas fa-paw"></i>
          <span v-if="!sidebarCollapsed">Thú cưng</span>
        </router-link>
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="!sidebarCollapsed">Đơn hàng</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <i class="fas fa-users"></i>
          <span v-if="!sidebarCollapsed">Người dùng</span>
        </router-link>
        <router-link to="/admin/reviews" class="nav-item" active-class="active">
          <i class="fas fa-star"></i>
          <span v-if="!sidebarCollapsed">Đánh giá</span>
        </router-link>
        <router-link to="/admin/blog" class="nav-item" active-class="active">
          <i class="fas fa-blog"></i>
          <span v-if="!sidebarCollapsed">Blog</span>
        </router-link>
        <router-link to="/admin/support" class="nav-item" active-class="active">
          <i class="fas fa-headset"></i>
          <span v-if="!sidebarCollapsed">Hỗ trợ KH</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item" active-class="active">
          <i class="fas fa-cog"></i>
          <span v-if="!sidebarCollapsed">Cài đặt</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" class="nav-item">
          <i class="fas fa-store"></i>
          <span v-if="!sidebarCollapsed">Về cửa hàng</span>
        </router-link>
        <button class="nav-item logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!sidebarCollapsed">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Header -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="header-search">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <button class="notification-btn">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </button>
          <div class="admin-profile">
            <img :src="authStore.user?.avatar || 'https://i.pravatar.cc/40'" alt="Admin" />
            <span>{{ authStore.user?.name || 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)

const pageTitle = computed(() => {
  const titles = {
    'AdminDashboard': 'Dashboard',
    'AdminProducts': 'Quản lý Sản phẩm',
    'AdminPets': 'Quản lý Thú cưng',
    'AdminOrders': 'Quản lý Đơn hàng',
    'AdminUsers': 'Quản lý Người dùng',
    'AdminReviews': 'Quản lý Đánh giá',
    'AdminSettings': 'Cài đặt'
  }
  return titles[route.name] || 'Admin Panel'
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f12 100%);
  border-right: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2d2d2d;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  font-family: 'Creepster', cursive;
  font-size: 1.3rem;
  color: #f97316;
}

.collapse-btn {
  background: #2d2d2d;
  border: none;
  color: #888;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: #6b21a8;
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: #888;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
}

.nav-item i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background: rgba(107, 33, 168, 0.2);
  color: #a855f7;
}

.nav-item.active {
  background: linear-gradient(135deg, #6b21a8 0%, #dc2626 100%);
  color: white;
}

.sidebar-footer {
  padding: 20px 15px;
  border-top: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

/* Main Content */
.admin-main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
}

.admin-sidebar.collapsed + .admin-main {
  margin-left: 80px;
}

.admin-header {
  background: #1a1a1a;
  border-bottom: 1px solid #2d2d2d;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: 1.5rem;
  color: white;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-search {
  position: relative;
}

.header-search i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.header-search input {
  background: #2d2d2d;
  border: 1px solid #3d3d3d;
  border-radius: 10px;
  padding: 10px 15px 10px 40px;
  color: white;
  width: 250px;
  transition: all 0.3s ease;
}

.header-search input:focus {
  outline: none;
  border-color: #6b21a8;
}

.notification-btn {
  position: relative;
  background: #2d2d2d;
  border: none;
  color: #888;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: #3d3d3d;
  color: white;
}

.notification-btn .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  background: #2d2d2d;
  border-radius: 10px;
}

.admin-profile img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.admin-profile span {
  color: white;
  font-weight: 500;
}

.admin-content {
  padding: 30px;
  min-height: calc(100vh - 72px);
}

@media (max-width: 1024px) {
  .admin-sidebar {
    width: 80px;
  }
  
  .admin-sidebar .logo-text,
  .admin-sidebar .nav-item span {
    display: none;
  }
  
  .admin-main {
    margin-left: 80px;
  }
}
</style>
