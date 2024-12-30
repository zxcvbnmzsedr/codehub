<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">账号密码</h3>
      <el-button type="primary" size="small" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新建账号密码
      </el-button>
    </div>

    <div class="space-y-4">
      <div v-for="cred in credentials" :key="cred.id" class="p-4 border rounded-lg">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium text-base">{{ cred.title }}</h4>
            <a @click.prevent="openLink(cred.url)" class="text-blue-600 hover:text-blue-800 text-sm">{{ cred.url }}</a>
          </div>
          <div class="space-x-2">
            <el-button type="primary" size="small" link @click="handleEdit(cred)">编辑</el-button>
            <el-button type="danger" size="small" link @click="handleDelete(cred)">删除</el-button>
          </div>
        </div>
        <div class="mt-4 space-y-4">
          <div v-for="(account, idx) in cred.accounts" :key="idx" class="bg-gray-50 p-3 rounded">
            <p class="font-medium">{{ account.role }}：</p>
            <div class="ml-4 space-y-2">
              <p class="flex items-center">
                账号：{{ account.username }}
                <el-button type="primary" link size="small" @click="copyToClipboard(account.username)">
                  复制
                </el-button>
              </p>
              <p class="flex items-center">
                密码：
                <span class="relative">
                  <span v-if="!visiblePasswords[`${cred.id}-${idx}`]">******</span>
                  <span v-else>{{ account.password }}</span>
                </span>
                <el-button type="primary" link size="small" @click="togglePassword(cred.id, idx)">
                  {{ visiblePasswords[`${cred.id}-${idx}`] ? "隐藏" : "显示" }}
                </el-button>
                <el-button type="primary" link size="small" @click="copyToClipboard(account.password)">
                  复制
                </el-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑账号密码' : '新建账号密码'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入URL地址" />
        </el-form-item>

        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-medium">账号列表</h4>
            <el-button type="primary" link @click="addAccount">
              <el-icon><Plus /></el-icon>
              添加账号
            </el-button>
          </div>

          <div v-for="(account, index) in form.accounts" :key="index" class="border p-4 rounded mb-4">
            <div class="flex justify-between items-center mb-2">
              <h5 class="font-medium">账号 {{ index + 1 }}</h5>
              <el-button type="danger" link @click="removeAccount(index)">删除</el-button>
            </div>
            <el-form-item :label="'角色'" :prop="'accounts.' + index + '.role'" :rules="accountRules.role">
              <el-input v-model="account.role" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item :label="'账号'" :prop="'accounts.' + index + '.username'" :rules="accountRules.username">
              <el-input v-model="account.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item :label="'密码'" :prop="'accounts.' + index + '.password'" :rules="accountRules.password">
              <el-input v-model="account.password" placeholder="请输入密码" type="password" />
            </el-form-item>
          </div>
        </div>
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
import type { Credential } from "@/types/electron"

const props = defineProps<{
  categoryId: string
}>()

const openLink = (url: string) => {
  window.electronAPI.openExternal(url)
}

const copyToClipboard = (text: string) => {
  window.electronAPI.copyToClipboard(text)
  ElMessage.success("复制成功")
}

const credentials = ref<Credential[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref("")
const visiblePasswords = ref<Record<string, boolean>>({})

const form = ref<Omit<Credential, "id">>({
  title: "",
  url: "",
  accounts: [],
  categoryId: props.categoryId
})

const accountRules = {
  role: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
}

const rules: FormRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  url: [{ required: true, message: "请输入URL地址", trigger: "blur" }]
}

const formRef = ref<FormInstance>()

watch(
  () => props.categoryId,
  () => {
    loadCredentials()
  }
)

onMounted(() => {
  loadCredentials()
})

const loadCredentials = () => {
  credentials.value = window.electronAPI.loadCredentials(props.categoryId)
}

const togglePassword = (credId: string, accountIndex: number) => {
  const key = `${credId}-${accountIndex}`
  visiblePasswords.value[key] = !visiblePasswords.value[key]
}

const showCreateDialog = () => {
  isEdit.value = false
  form.value = {
    title: "",
    url: "",
    accounts: [],
    categoryId: props.categoryId
  }
  dialogVisible.value = true
}

const addAccount = () => {
  form.value.accounts.push({
    role: "",
    username: "",
    password: ""
  })
}

const removeAccount = (index: number) => {
  form.value.accounts.splice(index, 1)
}

const handleEdit = (cred: Credential) => {
  isEdit.value = true
  currentId.value = cred.id
  form.value = {
    title: cred.title,
    url: cred.url,
    accounts: [...cred.accounts],
    categoryId: cred.categoryId
  }
  dialogVisible.value = true
}

const handleDelete = async (cred: Credential) => {
  try {
    await ElMessageBox.confirm("确定要删除该账号密码吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    window.electronAPI.deleteCredential(cred.id)
    loadCredentials()
    ElMessage.success("删除成功")
  } catch {
    // User cancelled deletion
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const credentialData = {
        ...form.value,
        id: isEdit.value ? currentId.value : Date.now().toString()
      }
      const updateCredentialData = JSON.parse(JSON.stringify(credentialData))
      if (isEdit.value) {
        window.electronAPI.updateCredential(updateCredentialData)
      } else {
        window.electronAPI.createCredential(updateCredentialData)
      }

      dialogVisible.value = false
      loadCredentials()
      ElMessage.success(isEdit.value ? "更新成功" : "创建成功")
    }
  })
}
</script>
