import { contextBridge, ipcRenderer } from "electron"
import { join } from "path"
import { readFileSync, writeFileSync, existsSync } from "fs"

contextBridge.exposeInMainWorld("electronAPI", {
  loadCategories: () => {
    try {
      const userDataPath = ipcRenderer.sendSync("get-user-data-path")
      const categoriesPath = join(userDataPath, "category.json")
      // 检查文件是否存在
      console.log("categoriesPath", categoriesPath)
      if (!existsSync(categoriesPath)) {
        return []
      }
      const data = readFileSync(categoriesPath, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
      return []
    }
  },
  saveCategories: (categories: any) => {
    try {
      const userDataPath = ipcRenderer.sendSync("get-user-data-path")
      const categoriesPath = join(userDataPath, "category.json")
      console.log("保存categoriesPath", categoriesPath, categories)
      writeFileSync(categoriesPath, JSON.stringify(categories, null, 2))
      return true
    } catch (error) {
      console.error("Failed to save categories:", error)
      return false
    }
  }
})
