<template>
  <div id="app" class="halloween-theme">
    <!-- Hiệu ứng dơi bay -->
    <div class="bats-container">
      <div class="bat" v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.5}s` }">🦇</div>
    </div>
    
    <!-- Header -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.halloween-theme {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px;
}

.bats-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.bat {
  position: absolute;
  font-size: 2rem;
  animation: flyBat 15s linear infinite;
  opacity: 0.7;
}

@keyframes flyBat {
  0% {
    transform: translateX(-100px) translateY(0) rotate(0deg);
    left: -10%;
    top: 20%;
  }
  25% {
    top: 40%;
  }
  50% {
    top: 15%;
  }
  75% {
    top: 35%;
  }
  100% {
    transform: translateX(100vw) translateY(0) rotate(360deg);
    left: 110%;
    top: 25%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
