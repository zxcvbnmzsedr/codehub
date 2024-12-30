<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">服务器</h3>
      <el-button type="primary" size="small" @click="handleCreate">
        <el-icon>
          <Plus />
        </el-icon>
        新建服务器
      </el-button>
    </div>

    <el-table :data="servers" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="host" label="地址" />
      <el-table-column prop="port" label="端口" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleConnect(row)"> 连接</el-button>
          <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ServerDialog ref="dialogRef" :is-edit="isEdit" :initial-data="currentServer" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import ServerDialog from "./ServerDialog.vue"
import type { ServerForm } from "@/types/electron"

const props = defineProps<{
  categoryId: string
}>()

const servers = ref<ServerForm[]>([])
const isEdit = ref(false)
const currentServer = ref<
  Partial<
    ServerForm & {
      id?: string
      categoryId?: string
    }
  >
>({})
const dialogRef = ref()

watch(
  () => props.categoryId,
  () => {
    loadServers()
  }
)

onMounted(() => {
  loadServers()
})

const loadServers = () => {
  servers.value = window.electronAPI.loadServers(props.categoryId)
}

const handleCreate = () => {
  isEdit.value = false
  currentServer.value = {
    categoryId: props.categoryId
  }
  dialogRef.value?.open()
}

const handleEdit = (row: ServerForm) => {
  isEdit.value = true
  currentServer.value = { ...row }
  dialogRef.value?.open()
}

const handleDelete = async (row: ServerForm) => {
  try {
    await ElMessageBox.confirm("确定要删除该服务器吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    window.electronAPI.deleteServer(row.id, props.categoryId)
    loadServers()
    ElMessage.success("删除成功")
  } catch {
    // User cancelled deletion
  }
}

const handleConnect = (row: ServerForm) => {
  // TODO: Implement connection logic
  console.log("Connecting to server:", row)
  ElMessage.info("连接功能开发中")
}

const handleSubmit = (formData: Omit<ServerForm, "id">) => {
  const serverData = {
    ...formData,
    categoryId: props.categoryId,
    id: isEdit.value ? currentServer.value.id! : Date.now().toString()
  }
  if (isEdit.value) {
    window.electronAPI.updateServer(serverData)
  } else {
    window.electronAPI.createServer(serverData)
  }

  loadServers()
  ElMessage.success(isEdit.value ? "更新成功" : "创建成功")
}
</script>
