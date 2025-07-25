<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { defineEmits } from 'vue'

const emit = defineEmits(['favorite-changed', 'card-clicked'])
const router = useRouter()
const auth = useAuthStore()

const failedImages = ref(new Set<string>())


const props = defineProps<{
  data: {
    id: string | number
    name: string
    category?: string
    distance?: string
    image: string
    view_count?: number
  }
}>()

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE

const isFavorited = ref(false)
const currentViewCount = ref(props.data.view_count || 0)
const isUpdatingView = ref(false)

const checkFavorite = async () => {
  if (!auth.user?.id) return
  try {
    const res = await axios.get(BACKEND_BASE + `/favorites/user/${auth.user.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    isFavorited.value = res.data.some(
      (fav: { place_id: number | string }) => String(fav.place_id) === String(props.data.id),
    )
  } catch (error) {
    console.error('Failed to check favorite:', error)
  }
}

const toggleFavorite = async () => {
  if (!auth.user?.id) {
    const ok = confirm('Please log in first to perform this action.')
    if (ok) router.push('/login')
    return
  }

  const form = new URLSearchParams()
  form.append('user_id', String(auth.user.id))
  form.append('place_id', String(props.data.id))

  try {
    if (isFavorited.value) {
      await axios.delete(BACKEND_BASE + '/favorites/', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: form,
      })
      isFavorited.value = false
    } else {
      await axios.post(BACKEND_BASE + '/favorites/', form, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      isFavorited.value = true
    }
    emit('favorite-changed')
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    alert('Something went wrong. Please try again.')
  }
}

const incrementViewCount = async () => {
  if (isUpdatingView.value) return // Prevent multiple rapid clicks

  try {
    isUpdatingView.value = true
    const response = await axios.post(
      `${BACKEND_BASE}/places/view/${props.data.id}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.data.new_view_count) {
      currentViewCount.value = response.data.new_view_count
    }

    console.log('View count updated:', response.data)
  } catch (error) {
    console.error('Failed to update view count:', error)
    // Don't show error to user as this is a background operation
  } finally {
    isUpdatingView.value = false
  }
}

const handleCardClick = async () => {

    // Navigate to place detail page
  router.push(`/place/${props.data.id}`)
  // Increment view count when card is clicked
  await incrementViewCount()

  // Emit event to parent component
  emit('card-clicked', {
    id: props.data.id,
    name: props.data.name,
    newViewCount: currentViewCount.value
  })
}
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const imageKey = `place-${props.data.id}`

  // If this image has already failed once, don't try again
  if (failedImages.value.has(imageKey)) {
    // Set a final fallback placeholder - rectangular image placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZjNmNGY2Ii8+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0MCw2MCkiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjhMMjQgMjRMMjAgMjhMMTYgMjRMMTIgMjhWMTZaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMjAiIHI9IjIiIGZpbGw9IiM5Y2EzYWYiLz4KPC9nPgo8dGV4dCB4PSIxNjAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K'
    img.alt = `${props.data.name} - Image not available`
    return
  }

  // Mark this image as failed
  failedImages.value.add(imageKey)

  // Set the rectangular placeholder immediately
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjZjNmNGY2Ii8+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0MCw2MCkiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjhMMjQgMjRMMjAgMjhMMTYgMjRMMTIgMjhWMTZaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMjAiIHI9IjIiIGZpbGw9IiM5Y2EzYWYiLz4KPC9nPgo8dGV4dCB4PSIxNjAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K'

  // Update alt text to be more descriptive
  img.alt = `${props.data.name} - Image not available`
}
const formatViewCount = (count: number) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

onMounted(() => {
  checkFavorite()
})
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full overflow-hidden cursor-pointer flex flex-col group"
    @click="handleCardClick"
  >
    <!-- Image Section -->
    <div class="relative h-[150px] sm:h-[160px]">
      <img :src="data.image" :alt="data.name" @error="handleImageError($event)" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />

      <!-- Favorite Button -->
      <div
        class="absolute top-2 right-2 p-1 rounded-full"
        @click.stop.prevent="toggleFavorite"
      >
        <Icon
          :icon="isFavorited ? 'fluent-color:heart-48' : 'material-symbols:heart-plus-rounded'"
          width="24"
          :class="isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
          class="transition-colors duration-200"
        />
      </div>

      <!-- View Count Badge -->
      <div class="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
        <Icon icon="mdi:eye" width="12" />
        <span>{{ formatViewCount(currentViewCount) }}</span>
      </div>

      <!-- Loading indicator for view update -->
      <div
        v-if="isUpdatingView"
        class="absolute inset-0 bg-black/20 flex items-center justify-center"
      >
        <Icon icon="mdi:loading" width="24" class="text-white animate-spin" />
      </div>
    </div>

    <!-- Text Content -->
    <div class="px-3 py-2 flex flex-col gap-2 flex-grow justify-between">
      <div class=" text-sm text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">
        {{ data.name }}
      </div>
      <div class="flex justify-between items-center">
        <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md truncate max-w-[70%]">
          {{ data.category || 'Unknown' }}
        </div>
        <div class="flex items-center text-xs text-gray-600 whitespace-nowrap">
          <Icon icon="mdi:map-marker" width="14" class="mr-1" />
          {{ data.distance || 'N/A' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>
