<template>
  <div class="staff-page">
    <!-- Hero Section -->
    <section class="staff-hero">
      <div class="hero-content">
        <h1>👥 Đội Ngũ Nhân Viên</h1>
        <p>Gặp gỡ những người tận tâm chăm sóc thú cưng của bạn</p>
      </div>
    </section>

    <!-- Staff Grid -->
    <section class="staff-section">
      <div class="container">
        <!-- Department Filter -->
        <div class="department-filter">
          <button
            v-for="dept in departments"
            :key="dept.id"
            :class="['filter-btn', { active: activeDepartment === dept.id }]"
            @click="activeDepartment = dept.id"
          >
            <i :class="dept.icon"></i>
            {{ dept.name }}
          </button>
        </div>

        <!-- Staff Cards -->
        <div class="staff-grid">
          <div
            v-for="member in filteredStaff"
            :key="member.id"
            class="staff-card"
          >
            <div class="staff-image">
              <img :src="member.avatar" :alt="member.name" />
              <div class="staff-overlay">
                <div class="social-links">
                  <a v-if="member.facebook" :href="member.facebook" target="_blank" class="social-link">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a v-if="member.instagram" :href="member.instagram" target="_blank" class="social-link">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a v-if="member.email" :href="'mailto:' + member.email" class="social-link">
                    <i class="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="staff-info">
              <h3>{{ member.name }}</h3>
              <span class="staff-role">{{ member.role }}</span>
              <p class="staff-bio">{{ member.bio }}</p>
              <div class="staff-skills">
                <span
                  v-for="skill in member.skills"
                  :key="skill"
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredStaff.length === 0" class="no-staff">
          <i class="fas fa-users-slash"></i>
          <h3>Không tìm thấy nhân viên</h3>
          <p>Vui lòng chọn phòng ban khác</p>
        </div>
      </div>
    </section>

    <!-- Join Our Team Section -->
    <section class="join-section">
      <div class="container">
        <div class="join-content">
          <h2>🌟 Gia Nhập Đội Ngũ Của Chúng Tôi</h2>
          <p>Bạn yêu thích thú cưng và muốn làm việc trong môi trường năng động?</p>
          <router-link to="/contact" class="btn btn-primary">
            <i class="fas fa-paper-plane"></i>
            Ứng Tuyển Ngay
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeDepartment = ref('all')

const departments = ref([
  { id: 'all', name: 'Tất cả', icon: 'fas fa-users' },
  { id: 'management', name: 'Quản lý', icon: 'fas fa-user-tie' },
  { id: 'veterinary', name: 'Thú y', icon: 'fas fa-stethoscope' },
  { id: 'sales', name: 'Bán hàng', icon: 'fas fa-shopping-bag' },
  { id: 'grooming', name: 'Chăm sóc', icon: 'fas fa-cut' },
  { id: 'support', name: 'Hỗ trợ', icon: 'fas fa-headset' }
])

const staffMembers = ref([
  {
    id: 1,
    name: 'Nguyễn Văn An',
    role: 'Giám đốc điều hành',
    department: 'management',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Hơn 15 năm kinh nghiệm trong ngành thú cưng, đam mê mang lại những sản phẩm và dịch vụ tốt nhất.',
    skills: ['Quản lý', 'Chiến lược', 'Kinh doanh'],
    email: 'an.nguyen@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    role: 'Bác sĩ thú y trưởng',
    department: 'veterinary',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    bio: 'Tốt nghiệp Đại học Nông Lâm, chuyên gia về sức khỏe chó mèo với 10 năm kinh nghiệm.',
    skills: ['Khám bệnh', 'Phẫu thuật', 'Tiêm phòng'],
    email: 'binh.tran@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 3,
    name: 'Lê Hoàng Cường',
    role: 'Trưởng phòng kinh doanh',
    department: 'sales',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Chuyên gia tư vấn thú cưng, giúp khách hàng tìm được người bạn đồng hành hoàn hảo.',
    skills: ['Tư vấn', 'Bán hàng', 'Chăm sóc KH'],
    email: 'cuong.le@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    role: 'Chuyên viên chăm sóc',
    department: 'grooming',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Nghệ nhân grooming với đôi tay khéo léo, biến thú cưng của bạn thành ngôi sao.',
    skills: ['Cắt tỉa lông', 'Tắm spa', 'Làm đẹp'],
    email: 'dung.pham@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 5,
    name: 'Võ Minh Đức',
    role: 'Bác sĩ thú y',
    department: 'veterinary',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    bio: 'Chuyên gia về dinh dưỡng thú cưng, tư vấn chế độ ăn phù hợp cho từng giai đoạn.',
    skills: ['Dinh dưỡng', 'Tư vấn', 'Xét nghiệm'],
    email: 'duc.vo@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 6,
    name: 'Hoàng Thị Ema',
    role: 'Nhân viên hỗ trợ',
    department: 'support',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của khách hàng 24/7.',
    skills: ['Tư vấn', 'Giải quyết vấn đề', 'Hỗ trợ online'],
    email: 'ema.hoang@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 7,
    name: 'Nguyễn Thị Fương',
    role: 'Nhân viên bán hàng',
    department: 'sales',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Nhiệt tình, vui vẻ và am hiểu sâu về các sản phẩm dành cho thú cưng.',
    skills: ['Sản phẩm', 'Tư vấn', 'Chăm sóc KH'],
    email: 'fuong.nguyen@petstore.com',
    facebook: '#',
    instagram: '#'
  },
  {
    id: 8,
    name: 'Trần Văn Giang',
    role: 'Chuyên viên chăm sóc',
    department: 'grooming',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Yêu động vật từ nhỏ, luôn đối xử với thú cưng như thành viên trong gia đình.',
    skills: ['Chăm sóc', 'Tắm gội', 'Cắt móng'],
    email: 'giang.tran@petstore.com',
    facebook: '#',
    instagram: '#'
  }
])

const filteredStaff = computed(() => {
  if (activeDepartment.value === 'all') {
    return staffMembers.value
  }
  return staffMembers.value.filter(member => member.department === activeDepartment.value)
})
</script>

<style scoped>
.staff-page {
  min-height: 100vh;
  padding-top: 80px;
}

/* Hero Section */
.staff-hero {
  background: linear-gradient(135deg, #1e1145 0%, #3b1d5c 40%, #5c2d7a 70%, #7c3d91 100%);
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.staff-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 30%, rgba(168, 85, 247, 0.25) 0%, transparent 45%),
    radial-gradient(ellipse at 60% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content h1 {
  color: white;
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-content p {
  color: #ccc;
  font-size: 1.2rem;
}

/* Staff Section */
.staff-section {
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Department Filter */
.department-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(45, 27, 78, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 25px;
  color: #aaa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, #9333ea, #a855f7);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(168, 85, 247, 0.3);
}

/* Staff Grid */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.staff-card {
  background: linear-gradient(145deg, #2d1b4e 0%, #1a1035 100%);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.staff-card:hover {
  transform: translateY(-10px);
  border-color: #a855f7;
  box-shadow: 0 20px 40px rgba(147, 51, 234, 0.35);
}

.staff-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.staff-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.staff-card:hover .staff-image img {
  transform: scale(1.1);
}

.staff-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 30px 20px 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.staff-card:hover .staff-overlay {
  opacity: 1;
  transform: translateY(0);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #a855f7;
  border-color: #a855f7;
  transform: scale(1.1);
}

.staff-info {
  padding: 25px;
}

.staff-info h3 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.staff-role {
  display: inline-block;
  color: #a855f7;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.staff-bio {
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.staff-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: rgba(168, 85, 247, 0.25);
  color: #d4b5fd;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* No Staff */
.no-staff {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.no-staff i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #a855f7;
}

.no-staff h3 {
  color: white;
  margin-bottom: 10px;
}

/* Join Section */
.join-section {
  background: linear-gradient(135deg, #1a1035 0%, #251845 50%, #2d1b4e 100%);
  padding: 80px 0;
  text-align: center;
  position: relative;
}

.join-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.join-content h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.join-content p {
  color: #ccc;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  padding: 15px 35px;
  border-radius: 30px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .staff-grid {
    grid-template-columns: 1fr;
  }

  .department-filter {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .filter-btn {
    white-space: nowrap;
  }

  .join-content h2 {
    font-size: 1.8rem;
  }
}
</style>
