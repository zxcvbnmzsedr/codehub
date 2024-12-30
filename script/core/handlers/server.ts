import type { ServerForm } from "@/types/electron"

export const testServerConnection = async (server: Omit<ServerForm, "id">) => {
  return new Promise<{ success: boolean; message: string }>((resolve) => {
    const config: any = {
      host: server.host,
      port: parseInt(server.port),
      username: server.username
    }

    // 根据认证类型设置认证信息
    if (server.authType) {
      switch (server.authType) {
        case "password":
          config.password = server.password
          break
        case "key":
          if (!server.privateKey) {
            resolve({ success: false, message: "未提供私钥" })
            return
          }
          config.privateKey = server.privateKey
          if (server.passphrase) {
            config.passphrase = server.passphrase
          }
          break
      }
    }

    // ... 其余代码保持不变
  })
}
