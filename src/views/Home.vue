<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="floating-elements">
          <span class="float-item" v-for="n in 10" :key="n" :style="getRandomStyle()">
            {{ getRandomEmoji() }}
          </span>
        </div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="spooky-title">Spooky Pet Store</span>
            <span class="hero-subtitle">🎃 Halloween Edition 🦇</span>
          </h1>
          <p class="hero-desc">
            Chào mừng đến với cửa hàng thú cưng ma quái nhất! Khám phá bộ sưu tập thú cưng 
            đáng yêu và các sản phẩm chất lượng cao dành cho người bạn đồng hành của bạn.
          </p>
          <div class="hero-btns">
            <router-link to="/pets" class="btn btn-primary btn-lg">
              <i class="fas fa-paw"></i> Xem Thú Cưng
            </router-link>
            <router-link to="/products" class="btn btn-outline btn-lg">
              <i class="fas fa-shopping-bag"></i> Mua Sắm Ngay
            </router-link>
          </div>
          
          <!-- Stats -->
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Thú Cưng</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Sản Phẩm</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5000+</span>
              <span class="stat-label">Khách Hàng</span>
            </div>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="hero-card">
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500" alt="Cute Dog" />
            <div class="hero-card-badge">🎃 Halloween Sale!</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title spooky-title">👻 Danh Mục Nổi Bật</h2>
          <p class="section-subtitle">Khám phá các danh mục thú cưng và sản phẩm của chúng tôi</p>
        </div>
        
        <div class="categories-grid">
          <router-link to="/pets?type=dog" class="category-card">
            <div class="category-icon">🐕</div>
            <h3>Chó</h3>
            <p>150+ giống chó</p>
          </router-link>
          <router-link to="/pets?type=cat" class="category-card">
            <div class="category-icon">🐈</div>
            <h3>Mèo</h3>
            <p>100+ giống mèo</p>
          </router-link>
          <router-link to="/products?category=food" class="category-card">
            <div class="category-icon">🦴</div>
            <h3>Thức Ăn</h3>
            <p>500+ sản phẩm</p>
          </router-link>
          <router-link to="/products?category=toys" class="category-card">
            <div class="category-icon">🎾</div>
            <h3>Đồ Chơi</h3>
            <p>200+ món đồ</p>
          </router-link>
          <router-link to="/products?category=accessories" class="category-card">
            <div class="category-icon">🎀</div>
            <h3>Phụ Kiện</h3>
            <p>300+ phụ kiện</p>
          </router-link>
          <router-link to="/products?category=health" class="category-card">
            <div class="category-icon">💊</div>
            <h3>Sức Khỏe</h3>
            <p>100+ sản phẩm</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Pets Section -->
    <section class="section pets-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title spooky-title">🦇 Thú Cưng Nổi Bật</h2>
          <p class="section-subtitle">Những người bạn đồng hành đáng yêu đang chờ bạn!</p>
        </div>
        
        <div class="grid grid-4">
          <PetCard 
            v-for="pet in featuredPets" 
            :key="pet.id" 
            :pet="pet" 
          />
        </div>
        
        <div class="text-center mt-3">
          <router-link to="/pets" class="btn btn-outline">
            Xem Tất Cả Thú Cưng <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Sale Banner -->
    <section class="sale-banner">
      <div class="container">
        <div class="banner-content">
          <div class="banner-text">
            <span class="banner-label">🎃 Halloween Special</span>
            <h2>Giảm Giá Đến <span class="highlight">50%</span></h2>
            <p>Ưu đãi đặc biệt cho mùa Halloween! Mua sắm ngay để nhận những phần quà hấp dẫn.</p>
            <router-link to="/products?sale=true" class="btn btn-danger btn-lg">
              <i class="fas fa-ghost"></i> Mua Ngay
            </router-link>
          </div>
          <div class="banner-image">
            <div class="discount-badge floating">
              <span>-50%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="section products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title spooky-title">💀 Sản Phẩm Hot</h2>
          <p class="section-subtitle">Những sản phẩm được yêu thích nhất</p>
        </div>
        
        <div class="grid grid-4">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        
        <div class="text-center mt-3">
          <router-link to="/products" class="btn btn-outline">
            Xem Tất Cả Sản Phẩm <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section services-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title spooky-title">🕷️ Dịch Vụ Của Chúng Tôi</h2>
          <p class="section-subtitle">Chăm sóc toàn diện cho thú cưng của bạn</p>
        </div>
        
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-truck"></i></div>
            <h3>Giao Hàng Nhanh</h3>
            <p>Giao hàng trong 24h tại TP.HCM và 2-3 ngày toàn quốc</p>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-shield-alt"></i></div>
            <h3>Bảo Hành Sức Khỏe</h3>
            <p>Bảo hành sức khỏe 30 ngày cho tất cả thú cưng</p>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-cut"></i></div>
            <h3>Spa & Grooming</h3>
            <p>Dịch vụ tắm, cắt tỉa lông chuyên nghiệp</p>
          </div>
          <div class="service-card">
            <div class="service-icon"><i class="fas fa-stethoscope"></i></div>
            <h3>Khám Sức Khỏe</h3>
            <p>Tư vấn và khám sức khỏe miễn phí</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title spooky-title">🎃 Khách Hàng Nói Gì</h2>
          <p class="section-subtitle">Những đánh giá từ khách hàng thân yêu</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-content">
              <div class="quote-icon">"</div>
              <p>{{ testimonial.content }}</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" />
              <div>
                <h4>{{ testimonial.name }}</h4>
                <div class="stars">
                  <i class="fas fa-star" v-for="n in 5" :key="n"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import PetCard from '../components/PetCard.vue'
import { productsAPI, petsAPI } from '../api'

const featuredPets = ref([
  {
    id: 1,
    name: 'Shadow',
    type: 'Chó',
    breed: 'Husky Siberian',
    age: '3 tháng',
    gender: 'male',
    price: 15000000,
    image: 'https://images.unsplash.com/photo-1617895153857-3cfa232f4b03?w=400',
    status: 'available',
    isSpecial: true
  },
  {
    id: 2,
    name: 'Midnight',
    type: 'Mèo',
    breed: 'Mèo Anh Lông Ngắn',
    age: '2 tháng',
    gender: 'female',
    price: 8000000,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400',
    status: 'available',
    isNew: true
  },
  {
    id: 3,
    name: 'Pumpkin',
    type: 'Chó',
    breed: 'Corgi',
    age: '4 tháng',
    gender: 'male',
    price: 12000000,
    image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400',
    status: 'available',
    isSpecial: true
  },
  {
    id: 4,
    name: 'Ghost',
    type: 'Mèo',
    breed: 'Mèo Ba Tư',
    age: '5 tháng',
    gender: 'female',
    price: 10000000,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    status: 'reserved'
  }
])

const featuredProducts = ref([
  {
    id: 1,
    name: 'Thức Ăn Cho Chó Halloween Edition',
    category: 'Thức Ăn',
    price: 450000,
    salePrice: 350000,
    rating: 5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
    isHot: true
  },
  {
    id: 2,
    name: 'Vòng Cổ Bí Ngô LED',
    category: 'Phụ Kiện',
    price: 250000,
    salePrice: 180000,
    rating: 4,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    isNew: true
  },
  {
    id: 3,
    name: 'Áo Halloween Cho Mèo',
    category: 'Quần Áo',
    price: 180000,
    rating: 4,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
  },
  {
    id: 4,
    name: 'Đồ Chơi Dơi Vampire',
    category: 'Đồ Chơi',
    price: 120000,
    salePrice: 89000,
    rating: 5,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400',
    isHot: true
  }
])

const testimonials = ref([
  {
    name: 'Nguyễn Văn A',
    content: 'Tôi rất hài lòng với chú chó Husky mua tại đây. Nhân viên tư vấn nhiệt tình, chó khỏe mạnh và đáng yêu!',
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    name: 'Trần Thị B',
    content: 'Sản phẩm chất lượng, giao hàng nhanh. Mèo nhà tôi rất thích đồ chơi Halloween mới!',
    avatar: 'https://i.pravatar.cc/100?img=2'
  },
  {
    name: 'Lê Văn C',
    content: 'Dịch vụ spa cho thú cưng tuyệt vời. Sẽ quay lại lần sau!',
    avatar: 'https://i.pravatar.cc/100?img=3'
  }
])

const emojis = ['🎃', '👻', '🦇', '🕷️', '💀', '🕸️', '🌙', '⭐', '✨']

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)]
}

function getRandomStyle() {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${1 + Math.random() * 2}rem`
  }
}

onMounted(async () => {
  try {
    // Fetch data from API
    // const petsRes = await petsAPI.getFeatured()
    // featuredPets.value = petsRes.data
    // const productsRes = await productsAPI.getFeatured()
    // featuredProducts.value = productsRes.data
  } catch (error) {
    console.log('Using mock data')
  }
})
</script>

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 100px 0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(107, 33, 168, 0.35) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(219, 39, 119, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.float-item {
  position: absolute;
  animation: floatRandom 10s ease-in-out infinite;
  opacity: 0.3;
}

@keyframes floatRandom {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.hero-title .spooky-title {
  font-family: 'Creepster', cursive;
  font-size: 4rem;
  color: #f97316;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #a855f7;
  margin-top: 10px;
}

.hero-desc {
  font-size: 1.2rem;
  color: #b0b0b0;
  line-height: 1.8;
  margin-bottom: 30px;
}

.hero-btns {
  display: flex;
  gap: 20px;
  margin-bottom: 50px;
}

.btn-lg {
  padding: 16px 35px;
  font-size: 1.1rem;
}

.hero-stats {
  display: flex;
  gap: 50px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #f97316;
  font-family: 'Creepster', cursive;
}

.stat-label {
  color: #888;
}

.hero-image {
  display: flex;
  justify-content: center;
}

.hero-card {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(107, 33, 168, 0.4);
  animation: float 6s ease-in-out infinite;
}

.hero-card img {
  width: 450px;
  height: 500px;
  object-fit: cover;
}

.hero-card-badge {
  position: absolute;
  top: 20px;
  right: -30px;
  background: #dc2626;
  color: white;
  padding: 10px 50px;
  font-weight: 700;
  transform: rotate(45deg);
  font-size: 0.9rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Categories Section */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.category-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 2px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 0.4s ease;
}

.category-card:hover {
  transform: translateY(-10px);
  border-color: #6b21a8;
  box-shadow: 0 20px 40px rgba(107, 33, 168, 0.3);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
}

.category-card h3 {
  color: white;
  margin-bottom: 5px;
}

.category-card p {
  color: #666;
  font-size: 0.9rem;
}

/* Sale Banner */
.sale-banner {
  background: linear-gradient(135deg, #6b21a8 0%, #dc2626 50%, #0a0a0a 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.sale-banner::before {
  content: '👻 🎃 💀 🦇 🕷️ 👻 🎃 💀 🦇 🕷️';
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 2rem;
  white-space: nowrap;
  animation: scroll 20s linear infinite;
  opacity: 0.2;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-label {
  display: inline-block;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.banner-text h2 {
  font-size: 3rem;
  margin-bottom: 15px;
}

.banner-text .highlight {
  color: #f97316;
  font-family: 'Creepster', cursive;
  font-size: 4rem;
}

.banner-text p {
  font-size: 1.1rem;
  margin-bottom: 25px;
  opacity: 0.9;
}

.discount-badge {
  width: 150px;
  height: 150px;
  background: #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  box-shadow: 0 0 50px rgba(220, 38, 38, 0.5);
}

/* Services Section */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.service-card {
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f12 100%);
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.4s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  border-color: #6b21a8;
  box-shadow: 0 20px 40px rgba(107, 33, 168, 0.2);
}

.service-icon {
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

.service-card h3 {
  margin-bottom: 10px;
  color: #f97316;
}

.service-card p {
  color: #888;
  font-size: 0.95rem;
}

/* Testimonials Section */
.testimonials-section {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a20 100%);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.testimonial-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  transition: all 0.4s ease;
}

.testimonial-card:hover {
  border-color: #6b21a8;
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.2);
}

.quote-icon {
  font-size: 4rem;
  color: #6b21a8;
  line-height: 1;
  font-family: serif;
}

.testimonial-content p {
  color: #b0b0b0;
  font-style: italic;
  line-height: 1.8;
  margin-bottom: 20px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.testimonial-author img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #6b21a8;
}

.testimonial-author h4 {
  color: white;
  margin-bottom: 5px;
}

.testimonial-author .stars {
  display: flex;
  gap: 3px;
}

.testimonial-author .stars i {
  color: #f97316;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-btns {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-card img {
    width: 350px;
    height: 400px;
  }
  
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .hero-title .spooky-title {
    font-size: 2.5rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .services-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-btns {
    flex-direction: column;
  }
}
</style>
