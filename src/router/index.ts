import { createRouter, createWebHashHistory } from "vue-router"
import MainView from "@/views/MainView/index.vue"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView
    }
  ]
})

export default router
