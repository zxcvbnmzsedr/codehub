import { dialog, ipcMain } from "electron"
import { readFile } from "fs/promises"
import { join } from "path"
import { homedir } from "os"
import { testServerConnection } from "./handlers/server"
import { registerSSHHandlers } from "./handlers/ssh"

export function registerIpcHandlers() {
  // Server handlers
  ipcMain.handle("testServerConnection", async (_, server) => {
    return testServerConnection(server)
  })

  // SSH Key handlers
  ipcMain.handle("loadDefaultSSHKey", async () => {
    try {
      const defaultKeyPath = join(homedir(), ".ssh", "id_rsa")
      return await readFile(defaultKeyPath, "utf-8")
    } catch (error) {
      console.error("无法读取默认SSH密钥文件", error)
      throw new Error("无法读取默认SSH密钥文件")
    }
  })

  ipcMain.handle("loadSSHKeyFromFile", async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "SSH Private Key", extensions: ["*"] }]
      })

      if (!result.canceled && result.filePaths.length > 0) {
        const keyContent = await readFile(result.filePaths[0], "utf-8")
        return keyContent
      }
      return ""
    } catch (error) {
      console.error("无法读取选择的密钥文件", error)
      throw new Error("无法读取选择的密钥文件")
    }
  })

  registerSSHHandlers(ipcMain)
}
