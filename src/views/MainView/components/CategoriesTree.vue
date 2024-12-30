<template>
  <div class="w-150px">
    <div class="mb-2 pl-5px pt-5px">
      <el-button type="primary" size="small" @click="showCreateDirDialog">
        <el-icon><Plus /></el-icon>
        新建目录
      </el-button>
    </div>

    <el-tree
      :data="directories"
      node-key="id"
      :expand-on-click-node="false"
      ref="treeRef"
      :empty-text="'暂无目录'"
      highlight-current
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <div class="flex items-center justify-between w-full pr-2">
          <span>{{ data.name }}</span>
          <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <!-- <el-icon class="cursor-pointer text-primary mx-1" @click.stop="showCreateDirDialog(undefined, data)">
              <Plus />
            </el-icon> -->
            <el-icon class="cursor-pointer text-danger mx-1" @click.stop="handleDeleteDir(data)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </el-tree>

    <el-dialog v-model="dialogVisible" title="新建目录" width="30%">
      <el-form>
        <el-form-item label="目录名称">
          <el-input v-model="newDirName" placeholder="请输入目录名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCreateDir">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import type { Ccategories } from "@/types/server"
import { onMounted, ref } from "vue"
import { ElMessageBox } from "element-plus"
import { Plus, Delete } from "@element-plus/icons-vue"
import { v4 as uuidv4 } from "uuid"

const emit = defineEmits<{
  (e: "select", category: Ccategories): void
}>()

const directories = ref<Ccategories[]>([])
const treeRef = ref()
const dialogVisible = ref(false)
const newDirName = ref("")
const currentNode = ref<Ccategories | null>(null)

onMounted(() => {
  directories.value = window.electronAPI.loadCategories()
})

const handleNodeClick = (data: Ccategories) => {
  emit("select", data)
}

const showCreateDirDialog = (event?: MouseEvent, node?: Ccategories): void => {
  currentNode.value = node || null
  dialogVisible.value = true
}

const confirmCreateDir = () => {
  if (!newDirName.value.trim()) {
    ElMessageBox.alert("目录名称不能为空", "提示")
    return
  }

  const newDir: Ccategories = {
    id: uuidv4(),
    name: newDirName.value,
    children: []
  }

  if (currentNode.value) {
    currentNode.value.children = currentNode.value.children || []
    currentNode.value.children.push(newDir)
  } else {
    directories.value.push(newDir)
  }

  // Create a clean data structure for saving
  const cleanData = JSON.parse(JSON.stringify(directories.value))
  window.electronAPI.saveCategories(cleanData)
  dialogVisible.value = false
  newDirName.value = ""
}

const handleDeleteDir = async (node: Ccategories) => {
  try {
    await ElMessageBox.confirm("确定要删除该目录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })

    const deleteNode = (items: Ccategories[]) => {
      const index = items.findIndex((item) => item.id === node.id)
      if (index > -1) {
        items.splice(index, 1)
        return true
      }
      for (const item of items) {
        if (item.children && deleteNode(item.children)) {
          return true
        }
      }
      return false
    }

    if (deleteNode(directories.value)) {
      const cleanData = JSON.parse(JSON.stringify(directories.value))
      window.electronAPI.saveCategories(cleanData)
    }
  } catch {
    // User cancelled deletion
  }
}
</script>

<style scoped>
.el-tree-node:hover .opacity-0 {
  opacity: 1;
}

.text-primary {
  color: var(--el-color-primary);
}

.text-danger {
  color: var(--el-color-danger);
}

.cursor-pointer {
  cursor: pointer;
}

.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
</style>
