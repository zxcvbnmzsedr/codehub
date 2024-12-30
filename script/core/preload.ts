import { contextBridge, ipcRenderer, shell, clipboard } from "electron"
import { join } from "path"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"

// 通用的文件操作函数
const getFilePath = (fileName: string) => {
  const userDataPath = ipcRenderer.sendSync("get-user-data-path")
  return join(userDataPath, fileName)
}
const checkCategoryFolder = (categoryId: string) => {
  const categoryPath = getFilePath(join("config", categoryId))
  console.log("categoryPath", categoryPath)
  if (!existsSync(categoryPath)) {
    mkdirSync(categoryPath, { recursive: true })
  }
  return categoryPath
}

const readJsonFile = (filePath: string) => {
  console.log("filePath", filePath)
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
const CATEGORY_FILE = "categories.json"
const SERVER_FILE = "servers.json"
const DATABASE_FILE = "databases.json"
const CREDENTIAL_FILE = "credentials.json"

// 确保用户数据目录存在
contextBridge.exposeInMainWorld("electronAPI", {
  // 复制到剪贴板
  copyToClipboard: (text: string) => {
    clipboard.writeText(text)
  },

  // 打开外部链接
  openExternal: (url: string) => {
    shell.openExternal(url)
  },

  // Categories
  loadCategories: () => {
    const categoriesPath = getFilePath(CATEGORY_FILE)
    return readJsonFile(categoriesPath)
  },
  saveCategories: (categories: any) => {
    const categoriesPath = getFilePath(CATEGORY_FILE)
    return writeJsonFile(categoriesPath, categories)
  },

  // Servers
  loadServers: (categoryId: string) => {
    const serversPath = checkCategoryFolder(categoryId)
    return readJsonFile(join(serversPath, SERVER_FILE))
  },
  createServer: (server: any) => {
    const serversPath = checkCategoryFolder(server.categoryId)
    const servers = readJsonFile(join(serversPath, SERVER_FILE))
    servers.push(server)
    return writeJsonFile(join(serversPath, SERVER_FILE), servers)
  },
  updateServer: (server: any) => {
    const serversPath = checkCategoryFolder(server.categoryId)
    const servers = readJsonFile(join(serversPath, SERVER_FILE))
    const index = servers.findIndex((s: any) => s.id === server.id)
    if (index !== -1) {
      servers[index] = server
      return writeJsonFile(join(serversPath, SERVER_FILE), servers)
    }
    return false
  },
  deleteServer: (id: string, categoryId: string) => {
    const serversPath = checkCategoryFolder(categoryId)
    const servers = readJsonFile(join(serversPath, SERVER_FILE))
    const filteredServers = servers.filter((s: any) => s.id !== id)
    return writeJsonFile(join(serversPath, SERVER_FILE), filteredServers)
  },

  // Databases
  loadDatabases: (categoryId: string) => {
    const databasesPath = checkCategoryFolder(categoryId)
    return readJsonFile(join(databasesPath, DATABASE_FILE))
  },
  createDatabase: (database: any) => {
    const databasesPath = checkCategoryFolder(database.categoryId)
    const databases = readJsonFile(join(databasesPath, DATABASE_FILE))
    databases.push(database)
    return writeJsonFile(join(databasesPath, DATABASE_FILE), databases)
  },
  updateDatabase: (database: any) => {
    const databasesPath = checkCategoryFolder(database.categoryId)
    const databases = readJsonFile(join(databasesPath, DATABASE_FILE))
    const index = databases.findIndex((db: any) => db.id === database.id)
    if (index !== -1) {
      databases[index] = database
      return writeJsonFile(join(databasesPath, DATABASE_FILE), databases)
    }
    return false
  },
  deleteDatabase: (id: string, categoryId: string) => {
    const databasesPath = checkCategoryFolder(categoryId)
    const databases = readJsonFile(join(databasesPath, DATABASE_FILE))
    const filteredDatabases = databases.filter((db: any) => db.id !== id)
    return writeJsonFile(join(databasesPath, DATABASE_FILE), filteredDatabases)
  },

  // Credentials
  loadCredentials: (categoryId: string) => {
    const credentialsPath = checkCategoryFolder(categoryId)
    return readJsonFile(join(credentialsPath, CREDENTIAL_FILE))
  },
  createCredential: (credential: any) => {
    const credentialsPath = checkCategoryFolder(credential.categoryId)
    const credentials = readJsonFile(join(credentialsPath, CREDENTIAL_FILE))
    credentials.push(credential)
    return writeJsonFile(join(credentialsPath, CREDENTIAL_FILE), credentials)
  },
  updateCredential: (credential: any) => {
    const credentialsPath = checkCategoryFolder(credential.categoryId)
    const credentials = readJsonFile(join(credentialsPath, CREDENTIAL_FILE))
    const index = credentials.findIndex((c: any) => c.id === credential.id)
    if (index !== -1) {
      credentials[index] = credential
      return writeJsonFile(join(credentialsPath, CREDENTIAL_FILE), credentials)
    }
    return false
  },
  deleteCredential: (id: string, categoryId: string) => {
    const credentialsPath = checkCategoryFolder(categoryId)
    const credentials = readJsonFile(join(credentialsPath, CREDENTIAL_FILE))
    const filteredCredentials = credentials.filter((c: any) => c.id !== id)
    return writeJsonFile(join(credentialsPath, CREDENTIAL_FILE), filteredCredentials)
  }
})
