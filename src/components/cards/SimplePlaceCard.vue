<script setup lang="ts">
import { defineProps } from 'vue'
import PlaceCard from '@/components/cards/PlaceCard.vue'

interface Destination {
  id: string
  name: string
  image: string
  category?: string
  distance?: string
  description?: string
}

defineProps<{
  places: Destination[]
  loading?: boolean
}>()


</script>

<template>
  <section>
    <div class="relative max-w-screen-xl mx-auto pt-5">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Loading Skeletons -->
        <template v-if="loading">
          <div
            v-for="n in 8"
            :key="n"
            class="animate-pulse w-full rounded-md bg-white shadow-sm p-2 space-y-2"
          >
            <div class="h-[160px] bg-gray-300 rounded-md dark:bg-gray-700 flex items-center justify-center">
              <svg
                class="w-10 h-10 text-gray-200 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path
                  d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2
                     2h16a2 2 0 0 0 2-2V2a2 2 0 0
                     0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0
                     3 1.5 1.5 0 0 1 0-3Zm4.376
                     10.481A1 1 0 0 1 16 15H4a1 1 0 0
                     1-.895-1.447l3.5-7A1 1 0 0 1
                     7.468 6a.965.965 0 0 1 .9.5l2.775
                     4.757 1.546-1.887a1 1 0 0 1
                     1.618.1l2.541 4a1 1 0 0 1
                     .028 1.011Z"
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
        </template>

        <!-- Actual Place Cards -->
        <router-link
          v-else
          v-for="place in places"
          :key="place.id"
          :to="`/place/${place.id}`"
          class="block"
        >
          <PlaceCard
            :data="{
              id: place.id,
              name: place.name,
              image: place.image,
              category: place.category,
              distance: place.distance
            }"
          />
        </router-link>
      </div>
    </div>
  </section>
  <div class="h-[100px]"></div>
</template>
