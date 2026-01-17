<template>
  <div class="contact-page">
    <div class="container">
      <h1 class="page-title spooky-title">📞 Liên Hệ Với Chúng Tôi</h1>

      <!-- Contact Info -->
      <div class="contact-info-section">
        <div class="info-card">
          <div class="info-icon">📍</div>
          <div class="info-content">
            <h3>Địa Chỉ</h3>
            <p>123 Đường Ma Quái, Phường Bí Ẩn<br>Quận Halloween, TP. Hồ Chí Minh</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">📞</div>
          <div class="info-content">
            <h3>Điện Thoại</h3>
            <p>Hotline: 1900-XXXX<br>Zalo: 0901-XXXXXX</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">✉️</div>
          <div class="info-content">
            <h3>Email</h3>
            <p>info@halloweenpetstore.com<br>support@halloweenpetstore.com</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">🕒</div>
          <div class="info-content">
            <h3>Giờ Mở Cửa</h3>
            <p>Thứ 2 - Chủ Nhật: 9:00 - 21:00<br>Không nghỉ lễ Halloween!</p>
          </div>
        </div>
      </div>

      <!-- Contact Form & Map -->
      <div class="contact-layout">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
          <form @submit.prevent="submitContact" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>Họ và tên *</label>
                <input type="text" v-model="contactForm.name" required />
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" v-model="contactForm.email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="tel" v-model="contactForm.phone" />
              </div>
              <div class="form-group">
                <label>Chủ đề</label>
                <select v-model="contactForm.subject">
                  <option value="general">Tư vấn chung</option>
                  <option value="adoption">Nhận nuôi thú cưng</option>
                  <option value="products">Sản phẩm</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="partnership">Hợp tác</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Nội dung tin nhắn *</label>
              <textarea v-model="contactForm.message" rows="6" required placeholder="Hãy chia sẻ với chúng tôi..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin"></i> Đang gửi...
              </span>
              <span v-else>
                <i class="fas fa-paper-plane"></i> Gửi Tin Nhắn
              </span>
            </button>
          </form>
        </div>

        <!-- Map & Social -->
        <div class="contact-sidebar">
          <!-- Map Placeholder -->
          <div class="map-section">
            <h3>🗺️ Tìm Đường Đến Cửa Hàng</h3>
            <div class="map-placeholder">
              <i class="fas fa-map-marked-alt"></i>
              <p>Bản đồ sẽ hiển thị ở đây</p>
              <small>Địa chỉ: 123 Đường Ma Quái, Q.Halloween, TP.HCM</small>
            </div>
          </div>

          <!-- Social Media -->
          <div class="social-section">
            <h3>📱 Theo Dõi Chúng Tôi</h3>
            <div class="social-links">
              <a href="#" class="social-link facebook">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <a href="#" class="social-link instagram">
                <i class="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>
              <a href="#" class="social-link youtube">
                <i class="fab fa-youtube"></i>
                <span>YouTube</span>
              </a>
              <a href="#" class="social-link tiktok">
                <i class="fab fa-tiktok"></i>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          <!-- Quick Contact -->
          <div class="quick-contact">
            <h3>⚡ Liên Hệ Nhanh</h3>
            <div class="quick-actions">
              <a href="tel:1900XXXX" class="quick-btn">
                <i class="fas fa-phone"></i>
                <span>Gọi ngay</span>
              </a>
              <a href="https://zalo.me/0901XXXXXX" class="quick-btn">
                <i class="fas fa-comment"></i>
                <span>Chat Zalo</span>
              </a>
              <a href="mailto:info@halloweenpetstore.com" class="quick-btn">
                <i class="fas fa-envelope"></i>
                <span>Gửi email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <h2 class="section-title">❓ Câu Hỏi Thường Gặp</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>🐾 Quy trình nhận nuôi thú cưng như thế nào?</h4>
            <p>Chúng tôi có quy trình nhận nuôi chuyên nghiệp gồm: tư vấn, gặp gỡ thú cưng, ký hợp đồng và hướng dẫn chăm sóc tại nhà.</p>
          </div>
          <div class="faq-item">
            <h4>💉 Thú cưng có được tiêm phòng đầy đủ không?</h4>
            <p>Có, tất cả thú cưng của chúng tôi đều được tiêm phòng đầy đủ theo khuyến cáo của bác sĩ thú y.</p>
          </div>
          <div class="faq-item">
            <h4>🚚 Chính sách giao hàng như thế nào?</h4>
            <p>Chúng tôi giao hàng tận nơi trên toàn quốc. Phí ship từ 30k, miễn phí cho đơn hàng từ 500k.</p>
          </div>
          <div class="faq-item">
            <h4>🔄 Chính sách đổi trả sản phẩm?</h4>
            <p>Đổi trả trong 7 ngày với sản phẩm còn nguyên tem mác. Thú cưng đổi trả trong 30 ngày nếu có vấn đề sức khỏe.</p>
          </div>
          <div class="faq-item">
            <h4>🏥 Dịch vụ chăm sóc sức khỏe?</h4>
            <p>Chúng tôi có phòng khám thú y tại cửa hàng và dịch vụ chăm sóc tại nhà 24/7.</p>
          </div>
          <div class="faq-item">
            <h4>🎁 Có chương trình khuyến mãi không?</h4>
            <p>Có, đặc biệt vào các dịp lễ Halloween, chúng tôi có nhiều ưu đãi hấp dẫn cho khách hàng.</p>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="newsletter-section">
        <div class="newsletter-content">
          <h2>📧 Đăng Ký Nhận Tin Mới</h2>
          <p>Nhận thông tin về thú cưng mới, khuyến mãi và mẹo chăm sóc thú cưng!</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input type="email" v-model="newsletterEmail" placeholder="Nhập email của bạn..." required />
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-envelope"></i> Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: ''
})

const newsletterEmail = ref('')
const isSubmitting = ref(false)

function submitContact() {
  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    alert('✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 24h.')
    contactForm.value = { name: '', email: '', phone: '', subject: 'general', message: '' }
    isSubmitting.value = false
  }, 2000)
}

function subscribeNewsletter() {
  alert('🎃 Chào mừng bạn đến với cộng đồng Halloween Pet Store!')
  newsletterEmail.value = ''
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding: 40px 0 80px;
}

.page-title {
  font-family: 'Creepster', cursive;
  font-size: 2.5rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 60px;
}

/* Contact Info */
.contact-info-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 60px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: #6b21a8;
  transform: translateY(-3px);
}

.info-icon {
  font-size: 2rem;
  color: #a855f7;
}

.info-content h3 {
  color: #f8f8f8;
  margin-bottom: 10px;
}

.info-content p {
  color: #ccc;
  line-height: 1.6;
}

/* Contact Layout */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  margin-bottom: 80px;
}

.contact-form-section {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 20px;
  padding: 40px;
}

.contact-form-section h2 {
  color: #f97316;
  margin-bottom: 30px;
  text-align: center;
}

.contact-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #a855f7;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 18px;
  background: #0a0a0a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #f8f8f8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6b21a8;
  box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Contact Sidebar */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.map-section,
.social-section,
.quick-contact {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
  padding: 25px;
}

.map-section h3,
.social-section h3,
.quick-contact h3 {
  color: #a855f7;
  margin-bottom: 20px;
}

.map-placeholder {
  height: 200px;
  background: #0a0a0a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  text-align: center;
}

.map-placeholder i {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #6b21a8;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #0a0a0a;
  border-radius: 10px;
  text-decoration: none;
  color: #f8f8f8;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(107, 33, 168, 0.1);
  color: #a855f7;
}

.social-link i {
  font-size: 1.5rem;
  width: 30px;
}

.social-link.facebook i { color: #1877f2; }
.social-link.instagram i { color: #e4405f; }
.social-link.youtube i { color: #ff0000; }
.social-link.tiktok i { color: #000000; }

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  border-radius: 10px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(107, 33, 168, 0.4);
}

.quick-btn i {
  font-size: 1.2rem;
}

/* FAQ Section */
.faq-section {
  margin-bottom: 60px;
}

.section-title {
  font-family: 'Creepster', cursive;
  font-size: 2rem;
  color: #f97316;
  text-align: center;
  margin-bottom: 40px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.faq-item {
  padding: 25px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 15px;
}

.faq-item h4 {
  color: #a855f7;
  margin-bottom: 15px;
}

.faq-item p {
  color: #ccc;
  line-height: 1.6;
}

/* Newsletter */
.newsletter-section {
  text-align: center;
  padding: 50px;
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-radius: 20px;
  border: 1px solid #2d2d2d;
}

.newsletter-content h2 {
  color: #f8f8f8;
  margin-bottom: 15px;
}

.newsletter-content p {
  color: #ccc;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-form {
  display: flex;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 15px 20px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 10px;
  color: #f8f8f8;
}

.newsletter-form input:focus {
  outline: none;
  border-color: #6b21a8;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6b21a8 0%, #a855f7 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(107, 33, 168, 0.4);
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .contact-info-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-info-section {
    grid-template-columns: 1fr;
  }

  .contact-form .form-row {
    grid-template-columns: 1fr;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .social-links {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .quick-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
