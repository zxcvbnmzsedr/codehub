import { contextBridge, ipcRenderer } from "electron"
import { join } from "path"
import { readFileSync, writeFileSync, existsSync } from "fs"

// 通用的文件操作函数
const getFilePath = (fileName: string) => {
  const userDataPath = ipcRenderer.sendSync("get-user-data-path")
  return join(userDataPath, fileName)
}

const readJsonFile = (filePath: string) => {
  try {
    if (!existsSync(filePath)) {
      return []
    }
    const data = readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error)
    return []
  }
}

const writeJsonFile = (filePath: string, data: any) => {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error)
    return false
  }
}

// 确保用户数据目录存在
contextBridge.exposeInMainWorld("electronAPI", {
  // Categories
  loadCategories: () => {
    const categoriesPath = getFilePath("categories.json")
    return readJsonFile(categoriesPath)
  },
  saveCategories: (categories: any) => {
    const categoriesPath = getFilePath("categories.json")
    return writeJsonFile(categoriesPath, categories)
  },

  // Servers
  loadServers: (categoryId: string) => {
    const serversPath = getFilePath("servers.json")
    const servers = readJsonFile(serversPath)
    return servers.filter((server: any) => server.categoryId === categoryId)
  },
  createServer: (server: any) => {
    const serversPath = getFilePath("servers.json")
    const servers = readJsonFile(serversPath)
    servers.push(server)
    return writeJsonFile(serversPath, servers)
  },
  updateServer: (server: any) => {
    const serversPath = getFilePath("servers.json")
    const servers = readJsonFile(serversPath)
    const index = servers.findIndex((s: any) => s.id === server.id)
    if (index !== -1) {
      servers[index] = server
      return writeJsonFile(serversPath, servers)
    }
    return false
  },
  deleteServer: (id: string) => {
    const serversPath = getFilePath("servers.json")
    const servers = readJsonFile(serversPath)
    const filteredServers = servers.filter((s: any) => s.id !== id)
    return writeJsonFile(serversPath, filteredServers)
  },

  // Databases
  loadDatabases: (categoryId: string) => {
    const databasesPath = getFilePath("databases.json")
    const databases = readJsonFile(databasesPath)
    return databases.filter((db: any) => db.categoryId === categoryId)
  },
  createDatabase: (database: any) => {
    const databasesPath = getFilePath("databases.json")
    const databases = readJsonFile(databasesPath)
    databases.push(database)
    return writeJsonFile(databasesPath, databases)
  },
  updateDatabase: (database: any) => {
    const databasesPath = getFilePath("databases.json")
    const databases = readJsonFile(databasesPath)
    const index = databases.findIndex((db: any) => db.id === database.id)
    if (index !== -1) {
      databases[index] = database
      return writeJsonFile(databasesPath, databases)
    }
    return false
  },
  deleteDatabase: (id: string) => {
    const databasesPath = getFilePath("databases.json")
    const databases = readJsonFile(databasesPath)
    const filteredDatabases = databases.filter((db: any) => db.id !== id)
    return writeJsonFile(databasesPath, filteredDatabases)
  },

  // Credentials
  loadCredentials: (categoryId: string) => {
    const credentialsPath = getFilePath("credentials.json")
    const credentials = readJsonFile(credentialsPath)
    return credentials.filter((cred: any) => cred.categoryId === categoryId)
  },
  createCredential: (credential: any) => {
    const credentialsPath = getFilePath("credentials.json")
    const credentials = readJsonFile(credentialsPath)
    credentials.push(credential)
    return writeJsonFile(credentialsPath, credentials)
  },
  updateCredential: (credential: any) => {
    const credentialsPath = getFilePath("credentials.json")
    const credentials = readJsonFile(credentialsPath)
    const index = credentials.findIndex((c: any) => c.id === credential.id)
    if (index !== -1) {
      credentials[index] = credential
      return writeJsonFile(credentialsPath, credentials)
    }
    return false
  },
  deleteCredential: (id: string) => {
    const credentialsPath = getFilePath("credentials.json")
    const credentials = readJsonFile(credentialsPath)
    const filteredCredentials = credentials.filter((c: any) => c.id !== id)
    return writeJsonFile(credentialsPath, filteredCredentials)
  }
})
