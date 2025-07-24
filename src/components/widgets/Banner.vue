<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Banner {
  id: number
  title: string
  image: string
  link_url: string
}

const banners = ref<Banner[]>([])
const currentIndex = ref(0)
const slider = ref<HTMLElement | null>(null)

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE

let interval: ReturnType<typeof setInterval> | null = null
let startX = 0
let deltaX = 0
let isDragging = false

const fetchData = async () => {
  try {
    const res = await fetch(BACKEND_BASE + '/banners/')
    const data = await res.json()
    const baseUrl = BACKEND_BASE

    interface BannerData {
      id: number
      title: string
      image_url: string
      link_url: string
    }

    banners.value = (data as BannerData[]).map((item) => ({
      id: item.id,
      title: item.title,
      image: baseUrl + '/' + item.image_url,
      link_url: item.link_url,
    }))
  } catch (error) {
    console.error('Error fetching banners:', error)
  }
}

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

const handleStart = (e: TouchEvent | MouseEvent) => {
  stopAutoSlide()
  isDragging = true
  startX = 'touches' in e ? e.touches[0].clientX : e.clientX
  deltaX = 0
}

const handleMove = (e: TouchEvent | MouseEvent) => {
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

const goToUrl = (url: string, event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  if (url) {
    window.open(url, '_blank')
  }
}

onMounted(() => {
  fetchData()
  startAutoSlide()
})

onUnmounted(() => stopAutoSlide())
</script>

<template>
  <section class="relative overflow-hidden rounded-2xl shadow-md w-full max-w-[890px] aspect-[16/9] bg-gray-200 mx-auto"
    @touchstart="handleStart" @touchmove="handleMove" @touchend="handleEnd" @mousedown="handleStart"
    @mousemove="handleMove" @mouseup="handleEnd" @mouseleave="handleEnd">
    <!-- Slide wrapper -->
    <div ref="slider" class="flex w-full h-full transition-transform duration-300 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <!-- Slides -->
      <div v-for="banner in banners" :key="banner.id"
        class="w-full flex-shrink-0 flex justify-center items-center relative">
        <img :src="banner.image" :alt="banner.title" class="w-full h-full object-cover" draggable="false" />

        <!-- Go to URL Button -->
        <button v-if="banner.link_url" @click="goToUrl(banner.link_url, $event)"
          class="absolute bottom-4 left-4 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 z-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="w-4 h-4">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          <span class="text-sm font-medium">Visit</span>
        </button>
      </div>
    </div>

    <!-- Arrows -->
    <button
      class="absolute top-1/2 -translate-y-1/2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-10"
      @click="prev">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="w-5 h-5">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      class="absolute top-1/2 -translate-y-1/2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-10"
      @click="next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="w-5 h-5">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Dots -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      <span v-for="(banner, i) in banners" :key="'dot-' + i" @click="currentIndex = i"
        class="w-3 h-3 rounded-full cursor-pointer transition-colors duration-300"
        :class="currentIndex === i ? 'bg-white' : 'bg-white/50'"></span>
    </div>
  </section>
</template>
