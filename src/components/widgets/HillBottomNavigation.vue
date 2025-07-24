<template>
  <div class="hill-btn-container-foreground" :style="cssVariables">
    <div
      v-for="(button, index) in localOptions"
      :key="`hill-btn-${index}`"
      class="hill-btn-container"
      @click="handleButtonClick(button, index)"
    >
      <div class="hill-btn-item">
        <div
          :class="[
            'hill-btn-icon',
            { 'hill-btn-icon-active': button.selected },
            { 'hill-btn-icon-deselect': button.deselect },
          ]"
          :style="{ '--icon-color': button.color || '#000' }"
        >
          <slot name="icon" :props="button">
            <i :class="`${button.icon}`" />
          </slot>
          <div v-if="(button.badge || 0) > 0" class="hill-btn-badge" />
        </div>
      </div>
    </div>

    <div id="hill" class="hill">
      <div class="hill-left"></div>
      <div class="hill-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

import type { HillOption } from '@/types'

type Props = {
  modelValue: number | null
  options: HillOption[]
  color?: string
  backgroundColor?: string
  badgeColor?: string
}
const props = withDefaults(defineProps<Props>(), {
  color: '#8B5CF6',
  backgroundColor: '#FFFFFF',
  badgeColor: '#FBC02D',
})

const emit = defineEmits(['update:modelValue'])

const localOptions = ref<HillOption[]>(
  props.options.map((o) => ({ ...o, selected: false, deselect: false })),
)
const currSelected = ref<number>(-1)
const prevSelected = ref<number>(-1)

const cssVariables = computed(() => ({
  '--color': props.color,
  '--background-color': props.backgroundColor,
  '--badge-color': props.badgeColor,
}))

// Initialize selected state based on modelValue
function initializeSelection() {
  if (props.modelValue == null) return

  const index = localOptions.value.findIndex((btn) => btn.id === props.modelValue)
  if (index !== -1) {
    localOptions.value.forEach((btn, i) => {
      btn.selected = i === index
      btn.deselect = false
    })
    currSelected.value = index
    prevSelected.value = index

    nextTick(() => {
      moveHill()
    })
  }
}

watch(
  () => props.modelValue,
  (id) => {
    if (id == null) return
    const index = localOptions.value.findIndex((btn) => btn.id === id)
    if (index !== -1 && index !== currSelected.value) {
      handleButtonClick(localOptions.value[index], index, false) // Don't emit back
    }
  },
  { immediate: true }
)

// Watch for options changes
watch(
  () => props.options,
  (newOptions) => {
    localOptions.value = newOptions.map((o) => ({ ...o, selected: false, deselect: false }))
    initializeSelection()
  },
  { deep: true }
)

function handleButtonClick(button: HillOption, index: number, shouldEmit: boolean = true) {
  // Always emit update for user clicks, even if it's the same button
  // This allows navigation from sub-routes back to main routes
  if (shouldEmit) {
    console.log('[HillBottomNavigation] Button clicked:', button.id, 'index:', index)
    emit('update:modelValue', button.id)
  }

  // Only update visual state if it's a different button
  if (index === currSelected.value) {
    console.log('[HillBottomNavigation] Same button clicked, emitting but not updating visual state')
    return
  }

  // Update visual state
  localOptions.value.forEach((btn, i) => {
    btn.selected = i === index
    btn.deselect = i === prevSelected.value && i !== index
  })

  prevSelected.value = currSelected.value
  currSelected.value = index
  moveHill()
}

function moveHill() {
  nextTick(() => {
    const container = document.querySelector('.hill-btn-container') as HTMLElement
    const hill = document.getElementById('hill') as HTMLElement
    if (container && hill && currSelected.value >= 0) {
      const width = container.clientWidth
      hill.style.left = `${width / 2 - 13 + currSelected.value * width}px`
    }
  })
}

onMounted(() => {
  initializeSelection()
  window.addEventListener('resize', moveHill)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveHill)
})
</script>

<style scoped>
.hill-btn-container-foreground {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 64px;
  background: var(--background-color);
  display: flex;
  align-items: flex-end;
  z-index: 9999;
  box-shadow: 0 0 5px #eee;
}

.hill-btn-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: all 0.3s;
  box-sizing: border-box;
  cursor: pointer;
}

.hill-btn-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hill-btn-icon {
  position: relative;
}

.hill-btn-icon-active {
  color: var(--icon-color);
}

.hill-btn-icon-deselect {
  animation: hill-button-deselect 0.1s ease-out forwards;
}

.hill-btn-badge {
  position: absolute;
  top: -1px;
  right: -4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--badge-color);
}

.hill {
  position: absolute;
  bottom: -1rem;
  background-color: var(--color);
  width: 1.5rem;
  height: 2rem;
  border-radius: 9999px;
  transition: all 0.3s;
}

.hill-left,
.hill-right {
  position: absolute;
  bottom: 50%;
  width: 1.25rem;
  height: 1.25rem;
  background: var(--background-color);
  box-shadow: 0 10px 0 var(--color);
}

.hill-left {
  left: -1rem;
  border-bottom-right-radius: 1.5rem;
}

.hill-right {
  right: -1rem;
  border-bottom-left-radius: 1.5rem;
}

@keyframes hill-button-selected {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-5px) scale(1.1);
  }
}

@keyframes hill-button-deselect {
  0% {
    transform: translateY(-5px) scale(1.1);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
