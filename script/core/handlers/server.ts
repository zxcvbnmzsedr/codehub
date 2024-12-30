import { NodeSSH } from "node-ssh"
import type { ServerForm } from "@/types/electron"

export async function testServerConnection(
  server: Omit<ServerForm, "id">
): Promise<{ success: boolean; message: string }> {
  const ssh = new NodeSSH()
  console.log("testServerConnection", server)

  try {
    // 根据不同的验证方式设置连接配置
    const config: any = {
      host: server.host,
      port: parseInt(server.port),
      username: server.username,
      // 设置较短的超时时间，避免等待太久
      timeout: 5000
    }

    // 根据认证方式设置不同的认证配置
    switch (server.authType) {
      case "password":
        config.password = server.password
        break
      case "key":
        // TODO: 处理密钥认证
        throw new Error("密钥认证方式暂未实现")
      case "cert":
        // TODO: 处理证书认证
        throw new Error("证书认证方式暂未实现")
      case "ask":
        throw new Error("每次询问认证方式暂未实现")
      default:
        throw new Error("不支持的认证方式")
    }

    // 尝试连接
    await ssh.connect(config)

    // 执行一个简单的命令来测试连接
    const result = await ssh.execCommand("echo 'Connection test successful'")

    // 关闭连接
    ssh.dispose()

    if (result.code === 0) {
      return { success: true, message: "连接成功" }
    } else {
      return { success: false, message: `命令执行失败: ${result.stderr}` }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "未知错误"
    }
  }
}
