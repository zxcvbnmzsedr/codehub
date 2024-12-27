// core
import App from "@/App.vue"
import { createApp } from "vue"
import router from "@/router"
// load
import { loadPlugins } from "@/plugins"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import { createPinia } from "pinia"

const pinia = createPinia()

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
app.use(pinia).use(router)
router.isReady().then(() => app.mount("#app"))
