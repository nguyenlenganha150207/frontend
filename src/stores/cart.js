import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart')) || [])
  const loading = ref(false)

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const price = item.salePrice || item.price
      return sum + (price * item.quantity)
    }, 0)
  })

  const totalDiscount = computed(() => {
    return items.value.reduce((sum, item) => {
      if (item.salePrice) {
        return sum + ((item.price - item.salePrice) * item.quantity)
      }
      return sum
    }, 0)
  })

  function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => 
      item.id === product.id && item.type === (product.type || 'product')
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image || product.images?.[0],
        quantity: quantity,
        type: product.type || 'product'
      })
    }
    saveToStorage()
  }

  function updateQuantity(itemId, quantity, type = 'product') {
    const item = items.value.find(i => i.id === itemId && i.type === type)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId, type)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  function removeItem(itemId, type = 'product') {
    const index = items.value.findIndex(i => i.id === itemId && i.type === type)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cart')
  }

  function isInCart(productId, type = 'product') {
    return items.value.some(item => item.id === productId && item.type === type)
  }

  return {
    items,
    loading,
    totalItems,
    totalPrice,
    totalDiscount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart
  }
})
