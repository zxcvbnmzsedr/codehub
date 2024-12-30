import { createRouter, createWebHashHistory } from "vue-router"
import MainView from "../views/MainView/index.vue"
import TerminalView from "../views/Terminal/TerminalView.vue"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView
    },
    {
      path: "/terminal/:serverId",
      name: "terminal",
      component: TerminalView
    }
  ]
})

export default router
