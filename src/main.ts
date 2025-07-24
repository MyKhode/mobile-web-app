import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vue3GoogleLogin from 'vue3-google-login'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Iconify
import { Icon } from '@iconify/vue'

// Setup Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

// Setup Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and configure Vue app
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.use(vue3GoogleLogin, {
  clientId: '487719311220-964ukvlms7qhcjm00oa3r21gms2q3icn.apps.googleusercontent.com', // Replace with actual client ID
})

// Register Iconify component globally
app.component('Icon', Icon)

app.mount('#app')
