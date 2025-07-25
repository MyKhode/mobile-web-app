// Component 1 - Categories Grid (first document)
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Fetch categories from API
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  label_name: string
  icon: string
  place_count: number
}

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE || 'https://backendikhode.tinh25.com'

const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Track failed images to prevent infinite loops
const failedImages = ref(new Set<string>())


const fetchCategories = async () => {
  try {
    loading.value = true
    const { data, error: supabaseError } = await supabase
      .from('categories')
      .select('id, label, image_url')

    if (supabaseError) throw supabaseError

    categories.value = (data ?? []).map((item) => ({
      id: item.id,
      label_name: item.label,
      icon: item.image_url,
      place_count: 0, // fallback since DB has no place_count
    }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch categories'
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

// Handle image error with loop prevention
const handleImageError = (event: Event, categoryId: number) => {
  const img = event.target as HTMLImageElement
  const imageKey = `category-${categoryId}`

  // If this image has already failed once, don't try again
  if (failedImages.value.has(imageKey)) {
    // Remove the image and show a fallback icon instead
    img.style.display = 'none'
    return
  }

  // Mark this image as failed and try placeholder
  failedImages.value.add(imageKey)

  // Try to use a data URI as fallback (guaranteed to work)
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMEM5IDMwIDkgMjEgOSAyMUM5IDEyIDEyIDkgMjAgOUMyOCA5IDMxIDEyIDMxIDIxQzMxIDIxIDMxIDMwIDIwIDMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
}

// Display only first 7 categories
const displayedCategories = computed(() => categories.value.slice(0, 7))
const hasMoreCategories = computed(() => categories.value.length > 7)

// Handle category click - navigate to category page
const handleCategoryClick = (categoryId: number) => {
  router.push(`/places/category/${categoryId}`)
}

onMounted(() => {
  fetchCategories()
})

const handleViewMore = () => {
  router.push('/places/categories')
}

const handleViewAll = () => {
  router.push('/places/categories')
}
</script>

<template>
  <section class="w-full space-y-4 mt-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg  text-gray-800 dark:text-white mb-5">កម្រងប្រភេទរឿងភាគ</h2>
      <button class="text-sm text-blue-600 dark:text-blue-400 hover:underline" @click="handleViewAll"
        :disabled="loading">
        View All
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 gap-2">
      <div v-for="n in 9" :key="n" class="flex flex-col items-center">
        <div class="w-full aspect-square rounded-xl bg-gray-200 animate-pulse"></div>
        <div class="mt-2 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500 dark:text-red-400">{{ error }}</p>
      <button @click="fetchCategories" class="mt-2 text-sm text-blue-600 hover:underline">
        Try again
      </button>
    </div>

    <!-- Categories grid -->
    <div v-else class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 gap-2">
      <!-- Category cards -->
      <div v-for="item in displayedCategories" :key="item.id" class="flex flex-col items-center cursor-pointer"
        @click="handleCategoryClick(parseInt(item.id))">
        <!-- Card Box -->
        <div
          class="w-[70px] h-[70px] bg-white aspect-square flex items-center justify-center rounded-lg bg-slate-100 shadow-md transition duration-500 hover:bg-slate-200 hover:shadow-lg relative">
          <img :src="`${item.icon}`" :alt="`${item.label_name} icon`"
            class="w-full h-full px-1 py-1 object-cover rounded" @error="handleImageError($event, parseInt(item.id))" />
          <!-- Fallback icon when image fails -->
          <div v-if="failedImages.has(`category-${item.id}`)"
            class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded absolute">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Label below the box -->
        <span class="mt-2 text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
          {{ item.label_name }}
        </span>
      </div>

      <!-- View More card (shown as 8th item if there are more categories) -->
      <div v-if="hasMoreCategories" class="flex flex-col items-center cursor-pointer" @click="handleViewMore">
        <!-- View More Card Box -->
        <div
          class="w-full aspect-square flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-dashed border-blue-300 shadow-md transition duration-500 hover:bg-gradient-to-br hover:from-blue-200 hover:to-blue-300 hover:border-blue-400">
          <!-- Plus icon or "More" text -->
          <div class="flex flex-col items-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-xs text-blue-600 font-medium mt-1">More</span>
          </div>
        </div>

        <!-- Label below the box -->
        <span class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400 font-medium">
          View More
        </span>
      </div>
    </div>
    <div class="h-20 w-full bg-black"></div>
  </section>
</template>
