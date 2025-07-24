<script setup lang="ts">
import TopBar from '@/components/widgets/TopBar.vue'
import NavigationMenu from '@/components/widgets/NavigationMenu.vue'
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <TopBar />

        <main class="flex-1 w-full lg:max-w-4xl mx-auto px-4 py-2">
            <RouterView />
        </main>

        <NavigationMenu />
    </div>
</template>
