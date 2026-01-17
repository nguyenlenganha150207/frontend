<template>
  <footer class="footer">
    <!-- Hiệu ứng mồ mả -->
    <div class="graveyard">
      <div class="grave" v-for="n in 5" :key="n">
        <div class="tombstone">RIP</div>
      </div>
    </div>

    <div class="container">
      <div class="footer-content">
        <!-- Logo & About -->
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-icon">🎃</span>
            <span class="spooky-title">Spooky Pet Store</span>
          </div>
          <p class="footer-desc">
            Cửa hàng thú cưng đáng sợ nhất với những người bạn đồng hành dễ thương! 
            Chúng tôi mang đến cho bạn những thú cưng và sản phẩm chất lượng cao.
          </p>
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">🦇 Liên Kết Nhanh</h3>
          <ul class="footer-links">
            <li><router-link to="/"><i class="fas fa-spider"></i> Trang Chủ</router-link></li>
            <li><router-link to="/pets"><i class="fas fa-spider"></i> Thú Cưng</router-link></li>
            <li><router-link to="/products"><i class="fas fa-spider"></i> Sản Phẩm</router-link></li>
            <li><router-link to="/about"><i class="fas fa-spider"></i> Về Chúng Tôi</router-link></li>
            <li><router-link to="/contact"><i class="fas fa-spider"></i> Liên Hệ</router-link></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="footer-section">
          <h3 class="footer-title">👻 Danh Mục</h3>
          <ul class="footer-links">
            <li><router-link to="/pets?type=dog"><i class="fas fa-dog"></i> Chó</router-link></li>
            <li><router-link to="/pets?type=cat"><i class="fas fa-cat"></i> Mèo</router-link></li>
            <li><router-link to="/products?category=food"><i class="fas fa-bone"></i> Thức Ăn</router-link></li>
            <li><router-link to="/products?category=toys"><i class="fas fa-baseball-ball"></i> Đồ Chơi</router-link></li>
            <li><router-link to="/products?category=accessories"><i class="fas fa-tshirt"></i> Phụ Kiện</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section">
          <h3 class="footer-title">💀 Liên Hệ</h3>
          <ul class="footer-contact">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>123 Đường Ma Ám, Q.Bình Thạnh, TP.HCM</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span>0123 456 789</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <span>info@spookypetstore.com</span>
            </li>
            <li>
              <i class="fas fa-clock"></i>
              <span>8:00 - 22:00 (Hàng ngày)</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="newsletter">
        <div class="newsletter-content">
          <h3>🦇 Đăng Ký Nhận Tin</h3>
          <p>Nhận thông tin khuyến mãi và sản phẩm mới nhất!</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribe">
          <input type="email" v-model="email" placeholder="Email của bạn..." required />
          <button type="submit" class="btn btn-danger">
            <i class="fas fa-paper-plane"></i> Đăng Ký
          </button>
        </form>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p>© 2024 Spooky Pet Store. All rights reserved. Made with 🖤 by Halloween Team</p>
        <div class="footer-bottom-links">
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Chính sách đổi trả</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

function subscribe() {
  alert(`Đã đăng ký với email: ${email.value}`)
  email.value = ''
}
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a20 100%);
  padding: 80px 0 0;
  position: relative;
  overflow: hidden;
  border-top: 3px solid #6b21a8;
}

.graveyard {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
  opacity: 0.1;
}

.grave {
  text-align: center;
}

.tombstone {
  font-family: 'Creepster', cursive;
  font-size: 1.5rem;
  color: #6b21a8;
  background: #2d2d2d;
  padding: 20px 15px;
  border-radius: 20px 20px 0 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 40px;
  margin-bottom: 50px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.footer-logo .logo-icon {
  font-size: 2.5rem;
}

.footer-logo .spooky-title {
  font-family: 'Creepster', cursive;
  font-size: 1.8rem;
  color: #f97316;
}

.footer-desc {
  color: #888;
  line-height: 1.8;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(107, 33, 168, 0.2);
  border: 1px solid #6b21a8;
  border-radius: 50%;
  color: #a855f7;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #6b21a8;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(107, 33, 168, 0.5);
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: #f97316;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #888;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #a855f7;
  transform: translateX(5px);
}

.footer-links i {
  font-size: 0.8rem;
  color: #dc2626;
}

.footer-contact {
  list-style: none;
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  color: #888;
}

.footer-contact i {
  color: #a855f7;
  margin-top: 4px;
}

.newsletter {
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid #6b21a8;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.newsletter-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: white;
}

.newsletter-content p {
  color: #888;
}

.newsletter-form {
  display: flex;
  gap: 15px;
}

.newsletter-form input {
  padding: 15px 25px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #404040;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  width: 300px;
  transition: all 0.3s ease;
}

.newsletter-form input:focus {
  outline: none;
  border-color: #a855f7;
}

.footer-bottom {
  border-top: 1px solid #2d2d2d;
  padding: 25px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  color: #666;
}

.footer-bottom-links {
  display: flex;
  gap: 25px;
}

.footer-bottom-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: #a855f7;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .newsletter {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
    width: 100%;
  }

  .newsletter-form input {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .footer-bottom-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
