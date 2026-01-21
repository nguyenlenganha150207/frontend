<template>
  <div class="admin-support">
    <!-- Page Header -->
    <div class="page-header">
      <h1><i class="fas fa-headset"></i> Hỗ Trợ Khách Hàng</h1>
      <div class="header-actions">
        <button class="btn btn-outline" @click="exportTickets">
          <i class="fas fa-download"></i> Xuất báo cáo
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card new">
        <div class="stat-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <div class="stat-content">
          <h3>{{ ticketCounts.new }}</h3>
          <p>Ticket mới</p>
        </div>
      </div>
      <div class="stat-card processing">
        <div class="stat-icon">
          <i class="fas fa-spinner"></i>
        </div>
        <div class="stat-content">
          <h3>{{ ticketCounts.processing }}</h3>
          <p>Đang xử lý</p>
        </div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ ticketCounts.resolved }}</h3>
          <p>Đã giải quyết</p>
        </div>
      </div>
      <div class="stat-card avg-time">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>2.5h</h3>
          <p>Thời gian xử lý TB</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="support-layout">
      <!-- Tickets List -->
      <div class="tickets-panel">
        <div class="panel-header">
          <h3>Danh sách Ticket</h3>
          <div class="filters">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Tìm kiếm ticket..."
              />
            </div>
            <select v-model="filterStatus" class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>
            <select v-model="filterPriority" class="filter-select">
              <option value="">Tất cả độ ưu tiên</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>

        <div class="tickets-list">
          <div 
            v-for="ticket in filteredTickets" 
            :key="ticket.id"
            class="ticket-item"
            :class="{ active: selectedTicket?.id === ticket.id }"
            @click="selectTicket(ticket)"
          >
            <div class="ticket-header">
              <span class="ticket-id">#{{ ticket.id }}</span>
              <span class="ticket-priority" :class="ticket.priority">
                {{ getPriorityText(ticket.priority) }}
              </span>
            </div>
            <h4 class="ticket-subject">{{ ticket.subject }}</h4>
            <div class="ticket-meta">
              <div class="customer-info">
                <img :src="ticket.customer.avatar" :alt="ticket.customer.name" />
                <span>{{ ticket.customer.name }}</span>
              </div>
              <span class="ticket-time">{{ formatTime(ticket.createdAt) }}</span>
            </div>
            <div class="ticket-footer">
              <span class="ticket-status" :class="ticket.status">
                {{ getStatusText(ticket.status) }}
              </span>
              <span class="ticket-category">
                <i :class="getCategoryIcon(ticket.category)"></i>
                {{ ticket.category }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Detail / Chat -->
      <div class="chat-panel" v-if="selectedTicket">
        <div class="chat-header">
          <div class="ticket-info">
            <h3>{{ selectedTicket.subject }}</h3>
            <div class="ticket-badges">
              <span class="badge status" :class="selectedTicket.status">
                {{ getStatusText(selectedTicket.status) }}
              </span>
              <span class="badge priority" :class="selectedTicket.priority">
                {{ getPriorityText(selectedTicket.priority) }}
              </span>
              <span class="badge category">
                <i :class="getCategoryIcon(selectedTicket.category)"></i>
                {{ selectedTicket.category }}
              </span>
            </div>
          </div>
          <div class="chat-actions">
            <select v-model="selectedTicket.status" @change="updateTicketStatus" class="status-select">
              <option value="new">Mới</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>
            <button class="btn btn-sm btn-outline" @click="assignTicket">
              <i class="fas fa-user-plus"></i> Phân công
            </button>
          </div>
        </div>

        <!-- Customer Info Card -->
        <div class="customer-card">
          <img :src="selectedTicket.customer.avatar" :alt="selectedTicket.customer.name" />
          <div class="customer-details">
            <h4>{{ selectedTicket.customer.name }}</h4>
            <p><i class="fas fa-envelope"></i> {{ selectedTicket.customer.email }}</p>
            <p><i class="fas fa-phone"></i> {{ selectedTicket.customer.phone }}</p>
          </div>
          <div class="customer-stats">
            <div class="stat">
              <span class="value">{{ selectedTicket.customer.totalOrders }}</span>
              <span class="label">Đơn hàng</span>
            </div>
            <div class="stat">
              <span class="value">{{ selectedTicket.customer.totalTickets }}</span>
              <span class="label">Tickets</span>
            </div>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="chatContainer">
          <div 
            v-for="message in selectedTicket.messages" 
            :key="message.id"
            class="message"
            :class="{ 'from-customer': message.isCustomer, 'from-staff': !message.isCustomer }"
          >
            <div class="message-avatar">
              <img :src="message.avatar" :alt="message.sender" />
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.sender }}</span>
                <span class="message-time">{{ formatTime(message.time) }}</span>
              </div>
              <div class="message-body">
                {{ message.content }}
              </div>
              <div class="message-attachments" v-if="message.attachments?.length">
                <div 
                  v-for="(file, index) in message.attachments" 
                  :key="index"
                  class="attachment"
                >
                  <i class="fas fa-paperclip"></i>
                  <span>{{ file.name }}</span>
                  <a :href="file.url" target="_blank"><i class="fas fa-download"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Box -->
        <div class="reply-box">
          <div class="reply-toolbar">
            <button class="toolbar-btn" title="Đính kèm file">
              <i class="fas fa-paperclip"></i>
            </button>
            <button class="toolbar-btn" title="Chèn hình ảnh">
              <i class="fas fa-image"></i>
            </button>
            <button class="toolbar-btn" title="Mẫu trả lời">
              <i class="fas fa-bookmark"></i>
            </button>
          </div>
          <textarea 
            v-model="replyMessage" 
            placeholder="Nhập nội dung trả lời..."
            @keydown.ctrl.enter="sendReply"
          ></textarea>
          <div class="reply-actions">
            <div class="quick-replies">
              <button 
                v-for="quick in quickReplies" 
                :key="quick.id"
                class="quick-btn"
                @click="insertQuickReply(quick.content)"
              >
                {{ quick.label }}
              </button>
            </div>
            <button class="btn btn-primary" @click="sendReply" :disabled="!replyMessage.trim()">
              <i class="fas fa-paper-plane"></i> Gửi trả lời
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <i class="fas fa-comments"></i>
        <h3>Chọn một ticket để xem chi tiết</h3>
        <p>Chọn ticket từ danh sách bên trái để xem và trả lời</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// Reactive state
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const selectedTicket = ref(null)
const replyMessage = ref('')
const chatContainer = ref(null)

// Quick replies templates
const quickReplies = ref([
  { id: 1, label: 'Cảm ơn', content: 'Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất.' },
  { id: 2, label: 'Đang xử lý', content: 'Yêu cầu của bạn đang được xử lý. Vui lòng chờ trong giây lát.' },
  { id: 3, label: 'Hoàn thành', content: 'Yêu cầu của bạn đã được giải quyết. Nếu bạn có thêm câu hỏi, vui lòng liên hệ lại với chúng tôi.' }
])

// Sample tickets data
const tickets = ref([
  {
    id: 1001,
    subject: 'Đơn hàng chưa được giao sau 5 ngày',
    category: 'Đơn hàng',
    status: 'new',
    priority: 'high',
    createdAt: '2026-01-21T10:30:00',
    customer: {
      name: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@email.com',
      phone: '0901234567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      totalOrders: 5,
      totalTickets: 2
    },
    messages: [
      {
        id: 1,
        sender: 'Nguyễn Văn Minh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        content: 'Xin chào, tôi đặt đơn hàng #ORD-2024 từ 5 ngày trước nhưng vẫn chưa nhận được. Vui lòng kiểm tra giúp tôi.',
        time: '2026-01-21T10:30:00',
        isCustomer: true
      },
      {
        id: 2,
        sender: 'Hỗ trợ viên Linh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        content: 'Chào anh Minh, em đã kiểm tra đơn hàng của anh. Đơn hàng đang trong quá trình vận chuyển và dự kiến sẽ đến trong 1-2 ngày tới. Em sẽ theo dõi và cập nhật cho anh nhé!',
        time: '2026-01-21T11:15:00',
        isCustomer: false
      }
    ]
  },
  {
    id: 1002,
    subject: 'Hỏi về chế độ bảo hành sản phẩm',
    category: 'Sản phẩm',
    status: 'processing',
    priority: 'medium',
    createdAt: '2026-01-21T09:15:00',
    customer: {
      name: 'Trần Thị Hương',
      email: 'huong.tran@email.com',
      phone: '0912345678',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      totalOrders: 3,
      totalTickets: 1
    },
    messages: [
      {
        id: 1,
        sender: 'Trần Thị Hương',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        content: 'Tôi muốn hỏi về chế độ bảo hành cho máy lọc nước cho thú cưng mà tôi mới mua. Sản phẩm có được bảo hành không và thời gian bảo hành là bao lâu?',
        time: '2026-01-21T09:15:00',
        isCustomer: true
      }
    ]
  },
  {
    id: 1003,
    subject: 'Yêu cầu đổi trả sản phẩm',
    category: 'Đổi trả',
    status: 'processing',
    priority: 'high',
    createdAt: '2026-01-20T16:45:00',
    customer: {
      name: 'Lê Hoàng Nam',
      email: 'nam.le@email.com',
      phone: '0923456789',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      totalOrders: 8,
      totalTickets: 3
    },
    messages: [
      {
        id: 1,
        sender: 'Lê Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        content: 'Tôi muốn đổi trả chiếc vòng cổ cho chó vì size không phù hợp. Tôi đã mua cách đây 3 ngày. Làm thế nào để tiến hành đổi trả?',
        time: '2026-01-20T16:45:00',
        isCustomer: true,
        attachments: [
          { name: 'hoa_don.pdf', url: '#' },
          { name: 'hinh_san_pham.jpg', url: '#' }
        ]
      },
      {
        id: 2,
        sender: 'Hỗ trợ viên Tuấn',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        content: 'Chào anh Nam, để tiến hành đổi trả, anh vui lòng:\n1. Giữ nguyên sản phẩm và bao bì\n2. Mang đến cửa hàng hoặc gửi qua đường bưu điện\n3. Kèm theo hóa đơn mua hàng\n\nChúng tôi sẽ đổi size mới cho anh trong vòng 24h sau khi nhận được sản phẩm.',
        time: '2026-01-20T17:30:00',
        isCustomer: false
      }
    ]
  },
  {
    id: 1004,
    subject: 'Tư vấn thức ăn cho mèo con',
    category: 'Tư vấn',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-01-19T14:20:00',
    customer: {
      name: 'Phạm Thị Mai',
      email: 'mai.pham@email.com',
      phone: '0934567890',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      totalOrders: 2,
      totalTickets: 1
    },
    messages: [
      {
        id: 1,
        sender: 'Phạm Thị Mai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        content: 'Xin chào, tôi mới nuôi một bé mèo 2 tháng tuổi. Tôi nên chọn loại thức ăn nào phù hợp cho bé?',
        time: '2026-01-19T14:20:00',
        isCustomer: true
      },
      {
        id: 2,
        sender: 'Hỗ trợ viên Linh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        content: 'Chào chị Mai! Với mèo con 2 tháng tuổi, em khuyên chị nên chọn:\n\n1. Royal Canin Kitten - phù hợp cho mèo từ 1-12 tháng\n2. Whiskas Junior - giá cả phải chăng\n3. Me-O Kitten - dinh dưỡng cân đối\n\nChị nên cho bé ăn 3-4 bữa/ngày với lượng nhỏ. Nếu cần tư vấn thêm, chị cứ liên hệ nhé!',
        time: '2026-01-19T15:00:00',
        isCustomer: false
      },
      {
        id: 3,
        sender: 'Phạm Thị Mai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        content: 'Cảm ơn bạn nhiều! Mình sẽ thử Royal Canin Kitten nhé.',
        time: '2026-01-19T15:30:00',
        isCustomer: true
      }
    ]
  },
  {
    id: 1005,
    subject: 'Báo lỗi website - không thanh toán được',
    category: 'Kỹ thuật',
    status: 'new',
    priority: 'high',
    createdAt: '2026-01-21T08:00:00',
    customer: {
      name: 'Võ Đức Thắng',
      email: 'thang.vo@email.com',
      phone: '0945678901',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100',
      totalOrders: 1,
      totalTickets: 1
    },
    messages: [
      {
        id: 1,
        sender: 'Võ Đức Thắng',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100',
        content: 'Tôi không thể thanh toán được trên website. Khi bấm nút "Thanh toán" thì trang bị treo và không phản hồi. Tôi đã thử nhiều lần nhưng vẫn không được.',
        time: '2026-01-21T08:00:00',
        isCustomer: true
      }
    ]
  }
])

// Computed
const ticketCounts = computed(() => ({
  new: tickets.value.filter(t => t.status === 'new').length,
  processing: tickets.value.filter(t => t.status === 'processing').length,
  resolved: tickets.value.filter(t => t.status === 'resolved').length,
  closed: tickets.value.filter(t => t.status === 'closed').length
}))

const filteredTickets = computed(() => {
  let result = tickets.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.subject.toLowerCase().includes(query) ||
      t.customer.name.toLowerCase().includes(query) ||
      t.id.toString().includes(query)
    )
  }

  if (filterStatus.value) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  if (filterPriority.value) {
    result = result.filter(t => t.priority === filterPriority.value)
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Methods
function selectTicket(ticket) {
  selectedTicket.value = ticket
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function getStatusText(status) {
  const statusMap = {
    new: 'Mới',
    processing: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng'
  }
  return statusMap[status] || status
}

function getPriorityText(priority) {
  const priorityMap = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp'
  }
  return priorityMap[priority] || priority
}

function getCategoryIcon(category) {
  const iconMap = {
    'Đơn hàng': 'fas fa-shopping-bag',
    'Sản phẩm': 'fas fa-box',
    'Đổi trả': 'fas fa-exchange-alt',
    'Tư vấn': 'fas fa-comment-dots',
    'Kỹ thuật': 'fas fa-cog'
  }
  return iconMap[category] || 'fas fa-question-circle'
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function updateTicketStatus() {
  // API call to update status
  console.log('Updating ticket status:', selectedTicket.value.status)
}

function assignTicket() {
  alert('Chức năng phân công ticket sẽ được triển khai!')
}

function insertQuickReply(content) {
  replyMessage.value = content
}

function sendReply() {
  if (!replyMessage.value.trim()) return

  const newMessage = {
    id: Date.now(),
    sender: 'Hỗ trợ viên',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: replyMessage.value,
    time: new Date().toISOString(),
    isCustomer: false
  }

  selectedTicket.value.messages.push(newMessage)
  replyMessage.value = ''

  // Update status to processing if it was new
  if (selectedTicket.value.status === 'new') {
    selectedTicket.value.status = 'processing'
  }

  nextTick(() => {
    scrollToBottom()
  })
}

function exportTickets() {
  alert('Xuất báo cáo ticket!')
}
</script>

<style scoped>
.admin-support {
  padding: 20px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h1 i {
  color: #a855f7;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 35, 0.9));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.stat-card.new .stat-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.stat-card.processing .stat-icon {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.stat-card.resolved .stat-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.stat-card.avg-time .stat-icon {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.stat-content h3 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.stat-content p {
  color: #888;
  font-size: 0.9rem;
}

/* Support Layout */
.support-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  height: calc(100vh - 280px);
  min-height: 500px;
}

/* Tickets Panel */
.tickets-panel {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 35, 0.9));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.1);
}

.panel-header h3 {
  color: white;
  margin-bottom: 15px;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
  border-color: #a855f7;
}

.filter-select {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
}

.filter-select option {
  background: #1a1a2e;
}

/* Tickets List */
.tickets-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.ticket-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ticket-item:hover {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
}

.ticket-item.active {
  background: rgba(168, 85, 247, 0.15);
  border-color: #a855f7;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ticket-id {
  color: #888;
  font-size: 0.85rem;
}

.ticket-priority {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.ticket-priority.high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.ticket-priority.medium {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.ticket-priority.low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.ticket-subject {
  color: white;
  font-size: 0.95rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.ticket-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-info img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.customer-info span {
  color: #ccc;
  font-size: 0.85rem;
}

.ticket-time {
  color: #666;
  font-size: 0.8rem;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.ticket-status.new {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.ticket-status.processing {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.ticket-status.resolved {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.ticket-status.closed {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.ticket-category {
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Chat Panel */
.chat-panel {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 35, 0.9));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ticket-info h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.ticket-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.status.new { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.badge.status.processing { background: rgba(249, 115, 22, 0.2); color: #f97316; }
.badge.status.resolved { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.badge.priority.high { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.badge.priority.medium { background: rgba(249, 115, 22, 0.2); color: #f97316; }
.badge.priority.low { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.badge.category { background: rgba(168, 85, 247, 0.2); color: #a855f7; }

.chat-actions {
  display: flex;
  gap: 10px;
}

.status-select {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
}

.status-select option {
  background: #1a1a2e;
}

/* Customer Card */
.customer-card {
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(168, 85, 247, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.customer-card > img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.customer-details {
  flex: 1;
}

.customer-details h4 {
  color: white;
  margin-bottom: 5px;
}

.customer-details p {
  color: #888;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.customer-stats {
  display: flex;
  gap: 20px;
}

.customer-stats .stat {
  text-align: center;
}

.customer-stats .value {
  display: block;
  color: #a855f7;
  font-size: 1.2rem;
  font-weight: 600;
}

.customer-stats .label {
  color: #888;
  font-size: 0.8rem;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.from-customer {
  align-self: flex-start;
}

.message.from-staff {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 12px 16px;
}

.message.from-staff .message-content {
  background: rgba(168, 85, 247, 0.2);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 15px;
}

.sender-name {
  color: #a855f7;
  font-weight: 500;
  font-size: 0.9rem;
}

.message-time {
  color: #666;
  font-size: 0.75rem;
}

.message-body {
  color: #ccc;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-attachments {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #888;
}

.attachment a {
  color: #a855f7;
  margin-left: auto;
}

/* Reply Box */
.reply-box {
  padding: 20px;
  border-top: 1px solid rgba(168, 85, 247, 0.1);
}

.reply-toolbar {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toolbar-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border-color: #a855f7;
}

.reply-box textarea {
  width: 100%;
  height: 100px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  color: white;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
}

.reply-box textarea:focus {
  outline: none;
  border-color: #a855f7;
}

.reply-box textarea::placeholder {
  color: #666;
}

.reply-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.quick-replies {
  display: flex;
  gap: 8px;
}

.quick-btn {
  padding: 6px 12px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 20px;
  color: #a855f7;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: rgba(168, 85, 247, 0.2);
}

/* Empty State */
.empty-state {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.8), rgba(20, 20, 35, 0.9));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  color: #a855f7;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: white;
  margin-bottom: 10px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(168, 85, 247, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(168, 85, 247, 0.5);
  color: #a855f7;
}

.btn-outline:hover {
  background: rgba(168, 85, 247, 0.1);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .support-layout {
    grid-template-columns: 350px 1fr;
  }
}

@media (max-width: 992px) {
  .support-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .tickets-panel {
    max-height: 400px;
  }

  .chat-panel {
    min-height: 500px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-replies {
    display: none;
  }
}
</style>
