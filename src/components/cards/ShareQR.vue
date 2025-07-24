<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-300/80 flex items-center justify-center z-50 p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 relative overflow-hidden"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Icon icon="mdi:close" class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Header Section -->
      <div class="bg-gradient-to-br from-gray-400 to-slate-500 px-6 pt-8 pb-6 text-center">
        <!-- Place Logo -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              v-if="placeLogo"
              :src="placeLogo"
              :alt="placeName"
              class="w-12 h-12 rounded-full object-cover"
            />
            <Icon
              v-else
              icon="mdi:store"
              class="w-8 h-8 text-gray-600"
            />
          </div>
        </div>

        <!-- Place Name -->
        <h3 class="text-white  text-lg mb-2">{{ placeName }}</h3>

        <!-- QR Code Container -->
        <div class="bg-white h-82 flex flex-col items-center justify-center rounded-xl shadow-lg">
          <div class="flex justify-center mb-4">
            <div ref="qrCodeContainer" class="w-48 h-48 flex items-center justify-center">
              <!-- QR Code will be generated here -->
            </div>
          </div>

          <!-- Instruction Text -->
          <p class="text-gray-600 text-sm">
            Share QR code with your friends
          </p>

          <!-- LoopyLyte Branding -->
          <div class="flex items-center justify-center text-gray-500">
            <img src="/mykh-logo-light.png" class="h-10" alt="">
          </div>
        </div>
      </div>

      <!-- Share Options -->
      <div class="px-6 py-6">
        <p class="text-center text-gray-600 text-sm mb-4">Share to</p>

        <div class="flex justify-center gap-8 space-x-6">
          <!-- Download Button -->
          <button
            @click="downloadQR"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:download" class="w-6 h-6 text-gray-600" />
            </div>
            <span class="text-xs text-gray-600">Download</span>
          </button>

          <!-- SMS Button -->
          <button
            @click="shareViaTelegram"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon icon="logos:telegram" class="w-6 h-6 text-green-600" />
            </div>
            <span class="text-xs text-gray-600">Telegram</span>
          </button>

          <!-- Email Button -->
          <button
            @click="shareViaEmail"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:email" class="w-6 h-6 text-blue-600" />
            </div>
            <span class="text-xs text-gray-600">Email</span>
          </button>

          <!-- More Options Button -->
          <button
            @click="shareViaOther"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:dots-horizontal" class="w-6 h-6 text-purple-600" />
            </div>
            <span class="text-xs text-gray-600">Other</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import QRCode from 'qrcode'

interface Props {
  isVisible: boolean
  placeName: string
  placeLogo?: string
  shareUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeName: 'Place Name',
  placeLogo: '',
  shareUrl: ''
})

const emit = defineEmits<{
  close: []
}>()

const qrCodeContainer = ref<HTMLElement>()
const qrCodeDataUrl = ref<string>('')

const closeModal = () => {
  emit('close')
}

const generateQRCode = async () => {
  if (!qrCodeContainer.value) return

  const url = props.shareUrl || window.location.href

  try {
    // Clear previous QR code
    qrCodeContainer.value.innerHTML = ''

    // Generate QR code as canvas
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, url, {
      width: 192,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    qrCodeContainer.value.appendChild(canvas)
    qrCodeDataUrl.value = canvas.toDataURL()

  } catch (error) {
    console.error('Error generating QR code:', error)
    // Fallback: show error message
    if (qrCodeContainer.value) {
      qrCodeContainer.value.innerHTML = `
        <div class="flex items-center justify-center w-full h-full text-gray-400">
          <div class="text-center">
            <div class="text-4xl mb-2">📱</div>
            <div class="text-sm">QR Code unavailable</div>
          </div>
        </div>
      `
    }
  }
}

const downloadQR = () => {
  if (!qrCodeDataUrl.value) return

  const link = document.createElement('a')
  link.download = `${props.placeName}-qr-code.png`
  link.href = qrCodeDataUrl.value
  link.click()
}

// const shareViaSMS = () => {
//   const url = props.shareUrl || window.location.href
//   const message = `Check out ${props.placeName}: ${url}`
//   window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank')
// }

const shareViaTelegram = () => {
  const url = props.shareUrl || window.location.href
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank')
}

const shareViaEmail = () => {
  const url = props.shareUrl || window.location.href
  const subject = `Check out ${props.placeName}`
  const body = `I thought you might be interested in ${props.placeName}. Check it out: ${url}`
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
}

const shareViaOther = () => {
  const url = props.shareUrl || window.location.href

  if (navigator.share) {
    navigator.share({
      title: props.placeName,
      text: `Check out ${props.placeName}`,
      url: url
    }).catch(console.error)
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      alert('Unable to copy link. Please copy manually: ' + url)
    })
  }
}

// Generate QR code when component becomes visible
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      generateQRCode()
    })
  }
})

onMounted(() => {
  if (props.isVisible) {
    generateQRCode()
  }
})
</script>
