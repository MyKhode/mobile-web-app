<!-- <script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const banners = ref([
  { image: 'https://source.unsplash.com/800x400/?travel,1' },
  { image: 'https://source.unsplash.com/800x400/?travel,2' },
  { image: 'https://source.unsplash.com/800x400/?travel,3' },
])

const currentIndex = ref(0)
const slider = ref(null)
let interval = null
let startX = 0
let deltaX = 0
let isDragging = false

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length
}

const startAutoSlide = () => {
  interval = setInterval(next, 4000)
}
const stopAutoSlide = () => {
  if (interval) clearInterval(interval)
}

const handleStart = (e) => {
  stopAutoSlide()
  isDragging = true
  startX = 'touches' in e ? e.touches[0].clientX : e.clientX
  deltaX = 0
}

const handleMove = (e) => {
  if (!isDragging || !slider.value) return
  const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
  deltaX = currentX - startX
  slider.value.style.transition = 'none'
  slider.value.style.transform = `translateX(calc(${-currentIndex.value * 100}% + ${deltaX}px))`
}

const handleEnd = () => {
  if (!isDragging || !slider.value) return
  isDragging = false
  slider.value.style.transition = 'transform 0.3s ease'
  if (deltaX > 50 && currentIndex.value > 0) {
    currentIndex.value--
  } else if (deltaX < -50 && currentIndex.value < banners.value.length - 1) {
    currentIndex.value++
  }
  slider.value.style.transform = `translateX(-${currentIndex.value * 100}%)`
  startAutoSlide()
}

onMounted(startAutoSlide)
onUnmounted(stopAutoSlide)
</script>

<template>
  <section
    class="relative overflow-hidden rounded-xl shadow-md w-full max-w-5xl aspect-[16/9] bg-gray-200 mx-auto"
    @touchstart="handleStart"
    @touchmove="handleMove"
    @touchend="handleEnd"
    @mousedown="handleStart"
    @mousemove="handleMove"
    @mouseup="handleEnd"
    @mouseleave="handleEnd"
  >
    <div
      ref="slider"
      class="bg-white border-lg cursor-pointer dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-3 w-full max-w-[180px] sm:max-w-[200px] mx-auto"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(banner, index) in banners" :key="index" class="w-full flex-shrink-0">
        <img :src="banner.image" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Dots -->
<!-- <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      <span
        v-for="(banner, i) in banners"
        :key="'dot-' + i"
        @click="currentIndex = i"
        class="w-3 h-3 rounded-full cursor-pointer"
        :class="currentIndex === i ? 'bg-white' : 'bg-white/50'"
      />
    </div>
  </section>
</template> -->
