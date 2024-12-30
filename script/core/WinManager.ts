import { BrowserWindow } from "electron"
import { join } from "path"

class WinManager {
  private windows: Map<string, BrowserWindow> = new Map()

  createTerminalWindow(serverId: string) {
    // 检查是否已存在该服务器的终端窗口
    if (this.windows.has(serverId)) {
      const win = this.windows.get(serverId)
      win?.focus()
      return win
    }

    // 创建新窗口
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: join(__dirname, "preload.js")
      }
    })

    // 加载终端页面
    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/terminal/${serverId}`)
    } else {
      win.loadFile("dist/index.html", {
        hash: `/terminal/${serverId}`
      })
    }

    // 存储窗口引用
    this.windows.set(serverId, win)

    // 窗口关闭时清理引用
    win.on("closed", () => {
      this.windows.delete(serverId)
    })

    return win
  }

  getWindow(serverId: string) {
    return this.windows.get(serverId)
  }

  closeWindow(serverId: string) {
    const win = this.windows.get(serverId)
    win?.close()
    this.windows.delete(serverId)
  }
}

export const winManager = new WinManager()
