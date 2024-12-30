<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">数据库</h3>
      <el-button type="primary" size="small" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新建数据库
      </el-button>
    </div>

    <el-table :data="databases" style="width: 100%">
      <el-table-column prop="name" label="目录" />
      <el-table-column prop="openMethod" label="打开方式" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑数据库' : '新建数据库'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="目录" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据库目录" />
        </el-form-item>
        <el-form-item label="打开方式" prop="openMethod">
          <el-select v-model="form.openMethod" placeholder="请选择打开方式" class="w-full">
            <el-option label="VSCode" value="vscode" />
            <el-option label="WebStorm" value="webstorm" />
            <el-option label="IDEA" value="idea" />
          </el-select>
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

interface Database {
  id: string
  name: string
  openMethod: string
  categoryId: string
}

const props = defineProps<{
  categoryId: string
}>()

const databases = ref<Database[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref("")

const form = ref({
  name: "",
  openMethod: ""
})

const rules: FormRules = {
  name: [{ required: true, message: "请输入数据库目录", trigger: "blur" }],
  openMethod: [{ required: true, message: "请选择打开方式", trigger: "change" }]
}

const formRef = ref<FormInstance>()

onMounted(() => {
  loadDatabases()
})

const loadDatabases = () => {
  databases.value = window.electronAPI.loadDatabases(props.categoryId)
}

const showCreateDialog = () => {
  isEdit.value = false
  form.value = {
    name: "",
    openMethod: ""
  }
  dialogVisible.value = true
}

const handleEdit = (row: Database) => {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    name: row.name,
    openMethod: row.openMethod
  }
  dialogVisible.value = true
}

const handleDelete = async (row: Database) => {
  try {
    await ElMessageBox.confirm("确定要删除该数据库吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    window.electronAPI.deleteDatabase(row.id)
    loadDatabases()
    ElMessage.success("删除成功")
  } catch {
    // User cancelled deletion
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const databaseData = {
        ...form.value,
        categoryId: props.categoryId,
        id: isEdit.value ? currentId.value : Date.now().toString()
      }

      if (isEdit.value) {
        window.electronAPI.updateDatabase(databaseData)
      } else {
        window.electronAPI.createDatabase(databaseData)
      }

      dialogVisible.value = false
      loadDatabases()
      ElMessage.success(isEdit.value ? "更新成功" : "创建成功")
    }
  })
}
</script>
