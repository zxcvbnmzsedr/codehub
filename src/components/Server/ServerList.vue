<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">服务器</h3>
      <el-button type="primary" size="small" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新建服务器
      </el-button>
    </div>

    <el-table :data="servers" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="host" label="地址" />
      <el-table-column prop="port" label="端口" />
      <el-table-column label="连接方式" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleConnect(row)"> 设置连接方式 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑服务器' : '新建服务器'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务器名称" />
        </el-form-item>
        <el-form-item label="地址" prop="host">
          <el-input v-model="form.host" placeholder="请输入服务器地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import type { FormInstance, FormRules } from "element-plus"

interface Server {
  id: string
  name: string
  host: string
  port: string | number
  categoryId: string
}

const props = defineProps<{
  categoryId: string
}>()

const servers = ref<Server[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref("")

const form = ref({
  name: "",
  host: "",
  port: ""
})

const rules: FormRules = {
  name: [{ required: true, message: "请输入服务器名称", trigger: "blur" }],
  host: [{ required: true, message: "请输入服务器地址", trigger: "blur" }],
  port: [{ required: true, message: "请输入端口号", trigger: "blur" }]
}

const formRef = ref<FormInstance>()

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

const showCreateDialog = () => {
  isEdit.value = false
  form.value = {
    name: "",
    host: "",
    port: ""
  }
  dialogVisible.value = true
}

const handleEdit = (row: Server) => {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    name: row.name,
    host: row.host,
    port: row.port.toString()
  }
  dialogVisible.value = true
}

const handleDelete = async (row: Server) => {
  try {
    await ElMessageBox.confirm("确定要删除该服务器吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    window.electronAPI.deleteServer(row.id)
    loadServers()
    ElMessage.success("删除成功")
  } catch {
    // User cancelled deletion
  }
}

const handleConnect = (row: Server) => {
  // TODO: Implement connection logic
  console.log("Connecting to server:", row)
  ElMessage.info("连接功能开发中")
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const serverData = {
        ...form.value,
        categoryId: props.categoryId,
        id: isEdit.value ? currentId.value : Date.now().toString()
      }

      if (isEdit.value) {
        window.electronAPI.updateServer(serverData)
      } else {
        window.electronAPI.createServer(serverData)
      }

      dialogVisible.value = false
      loadServers()
      ElMessage.success(isEdit.value ? "更新成功" : "创建成功")
    }
  })
}
</script>
