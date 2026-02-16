import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('success') // success, error, info

  function showAlert(msg, alertType = 'success', duration = 3000) {
    message.value = msg
    type.value = alertType
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, duration)
  }

  return { isVisible, message, type, showAlert }
})