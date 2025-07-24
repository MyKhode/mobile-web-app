import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

import HomePage from '@/components/Tabs/HomePage.vue'
import DetailPage from '@/components/Tabs/DetailPage.vue'
// import SearchPage from '@/components/Tabs/SearchPage.vue'
// import SettingPage from '@/components/Tabs/SettingPage.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'place/:id', name: 'Detail', component: DetailPage },
      // { path: 'search', name: 'Search', component: SearchPage },
      // { path: 'account', name: 'Account', component: SettingPage },
      // { path: 'recommendation', name: 'Recommendation', component: HomePage },
      { path: ':pathMatch(.*)*', name: 'NotFound', component: NotFound }, // moved inside layout
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
