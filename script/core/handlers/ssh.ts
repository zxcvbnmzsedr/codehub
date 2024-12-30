import * as pty from "node-pty"
import { IpcMainInvokeEvent } from "electron"
import type { ServerForm } from "../../../src/types/electron"
import { winManager } from "../WinManager"

const sshProcesses = new Map<string, pty.IPty>()

export const connectSSH = async (_event: IpcMainInvokeEvent, server: ServerForm) => {
  // 如果已存在连接，先断开
  if (sshProcesses.has(server.id)) {
    sshProcesses.get(server.id)?.kill()
    sshProcesses.delete(server.id)
  }

  const shell = process.platform === "win32" ? "powershell.exe" : "bash"

  const sshProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env as { [key: string]: string }
  })

  // 创建新窗口
  const win = winManager.createTerminalWindow(server.id)

  // 监听终端输出并发送到窗口
  sshProcess.onData((data) => {
    win?.webContents.send("ssh-data", data)
  })

  sshProcesses.set(server.id, sshProcess)

  const sshCommand = `ssh ${server.username}@${server.host} -p ${server.port}`
  sshProcess.write(`${sshCommand}\r`)

  return true
}

export const writeSSH = (_event: IpcMainInvokeEvent, serverId: string, data: string) => {
  const sshProcess = sshProcesses.get(serverId)
  sshProcess?.write(data)
}

export const disconnectSSH = (_event: IpcMainInvokeEvent, serverId: string) => {
  const sshProcess = sshProcesses.get(serverId)
  if (sshProcess) {
    sshProcess.kill()
    sshProcesses.delete(serverId)
  }
  winManager.closeWindow(serverId)
}

export const registerSSHHandlers = (ipcMain: Electron.IpcMain) => {
  ipcMain.handle("connect-ssh", connectSSH)
  ipcMain.handle("disconnect-ssh", disconnectSSH)
  ipcMain.on("write-ssh", writeSSH)
}
