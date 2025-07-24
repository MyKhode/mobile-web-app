<template>
  <div
    class="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
  >
    <div class="flex justify-center">
      <HillBottomNavigation
        class="!w-[100vw] max-w-[885px] mx-auto"
        :options="options"
        :model-value="selected"
        @update:modelValue="handleNavClick"
        color="#8B5CF6"
        background-color="#FFFFFF"
        badge-color="#FBC02D"
      >
        <template #icon="{ props }">
          <Icon :icon="props.icon!" width="24" />
        </template>
      </HillBottomNavigation>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HillBottomNavigation from './HillBottomNavigation.vue'

const router = useRouter()
const route = useRoute()

const selected = ref<number | null>(null)

const options = [
  { id: 1, icon: 'tabler:home-filled', color: '#5639af' },
  { id: 2, icon: 'material-symbols:thumb-up-rounded', color: '#e2a93a' },
  { id: 3, icon: 'mdi:magnify', color: '#ac4793' },
  { id: 4, icon: 'iconamoon:profile-fill', color: '#4493a7' },
]

const routeMap: Record<number, string> = {
  1: '/',
  2: '/recommendation?page=1',
  3: '/search',
  4: '/account',
}

/**
 * Scroll to top of page with smooth behavior
 */
function scrollToTop() {
  try {
    // Try smooth scrolling first (better UX)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  } catch {
    // Fallback for older browsers
    window.scrollTo(0, 0)
  }

  console.log('📜 Scrolled to top of page')
}

/**
 * Alternative scroll to top for instant navigation
 */
function scrollToTopInstant() {
  window.scrollTo(0, 0)
  console.log('📜 Instantly scrolled to top')
}

function getTabIdFromPath(path: string): number | null {
  // Check for exact matches first
  const exactMatch = Object.entries(routeMap).find(([, routePath]) => path === routePath)
  if (exactMatch) {
    return Number(exactMatch[0])
  }

  // For sub-routes, determine which main section they belong to
  // Routes like /place/7, /place/123 should highlight the home tab
  if (path.startsWith('/place/') || path.startsWith('/location/') || path === '/') {
    return 1 // Home tab
  }

  if (path.startsWith('/recommendation')) {
    return 2 // Recommendation tab
  }

  if (path.startsWith('/search')) {
    return 3 // Search tab
  }

  if (path.startsWith('/account')) {
    return 4 // Account tab
  }

  // Default to home tab for unknown routes
  return 1
}

// Initialize selected tab based on current route
function initializeSelectedTab() {
  const tabId = getTabIdFromPath(route.path)
  selected.value = tabId
  console.log('[initializeSelectedTab] path:', route.path, 'selected:', tabId)
}

// Initialize on component mount
onMounted(() => {
  initializeSelectedTab()
})

// Watch route changes and scroll to top
watch(
  () => route.path,
  (newPath, oldPath) => {
    const tabId = getTabIdFromPath(newPath)

    if (selected.value !== tabId) {
      selected.value = tabId
      console.log('[watch:path] newPath:', newPath, 'selected:', tabId)
    }

    // Scroll to top on any route change (including programmatic navigation)
    if (newPath !== oldPath) {
      nextTick(() => {
        scrollToTop()
      })
    }
  }
)

function handleNavClick(id: number) {
  const targetPath = routeMap[id]

  if (!targetPath) {
    console.log('[handleNavClick] No route found for id:', id)
    return
  }

  // Scroll to top immediately when tab is clicked for instant feedback
  scrollToTopInstant()

  // Always navigate to the target path, regardless of current route
  // This fixes the issue where clicking home from /place/7 doesn't work
  console.log('[handleNavClick] Navigating from:', route.path, 'to:', targetPath)

  router.push(targetPath).then(() => {
    // Ensure scroll to top after navigation completes
    nextTick(() => {
      scrollToTopInstant()
    })
  }).catch((error) => {
    console.error('Navigation error:', error)
  })
}
</script>
