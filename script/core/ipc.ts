import { ipcMain } from "electron"
import { testServerConnection } from "./handlers/server"

export function registerIpcHandlers() {
  // Server handlers
  ipcMain.handle("testServerConnection", async (_, server) => {
    return testServerConnection(server)
  })

  // Add more handlers here as needed
}
