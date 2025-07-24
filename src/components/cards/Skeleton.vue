<script setup lang="ts">
defineOptions({ name: 'SkeletonCard' })
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

defineProps<{
  count?: number
}>()
</script>

<template>
  <Swiper
    :slides-per-view="'auto'"
    :space-between="5"
    :modules="[Pagination]"
    class="w-full"
  >
    <SwiperSlide
      v-for="n in count || 6"
      :key="n"
      class="!w-[150px] sm:!w-[200px] md:!w-[220px] lg:!w-[240px] flex flex-col"
    >
      <div
        role="status"
        class="animate-pulse w-full rounded-md bg-white shadow-sm p-2 space-y-2"
      >
        <!-- Image -->
        <div
          class="h-[160px] bg-gray-300 rounded-md dark:bg-gray-700 flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-gray-200 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
        </div>

        <div class="py-3">
          <div class="h-4 bg-gray-200 ml-4 rounded-full dark:bg-gray-700 w-4/6"></div>
          <div class="flex justify-between pt-2 items-start gap-2 px-4">
            <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-2/8"></div>
            <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-2/8"></div>
          </div>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>
