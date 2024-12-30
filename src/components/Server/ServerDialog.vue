<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑服务器' : '新建服务器'" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="地址" prop="host">
        <el-input v-model="form.host" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="form.port" placeholder="请输入端口" />
      </el-form-item>
      <el-form-item label="验证方式" prop="authType">
        <el-radio-group v-model="form.authType">
          <el-radio-button label="password">密码</el-radio-button>
          <el-radio-button label="key">秘钥</el-radio-button>
          <el-radio-button label="cert">登录凭证</el-radio-button>
          <el-radio-button label="ask">每次询问</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="登录用户" prop="username">
        <el-input v-model="form.username" placeholder="请输入登录用户" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入登录密码" show-password />
      </el-form-item>
      <el-form-item label="主机备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入主机备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-between items-center">
        <div>
          <el-button @click="handleTest">测试连接</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? "保存" : "创建" }}</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElLoading, ElMessage } from "element-plus"

interface ServerForm {
  categoryId: string
  name: string
  host: string
  port: string
  authType: "password" | "key" | "cert" | "ask"
  username: string
  password: string
  remark: string
}

interface Props {
  isEdit?: boolean
  initialData?: Partial<ServerForm>
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: () => ({})
})

const emit = defineEmits<{
  (e: "submit", data: ServerForm): void
}>()

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const form = ref<ServerForm>({
  categoryId: props.initialData.categoryId || "nas",
  name: props.initialData.name || "",
  host: props.initialData.host || "",
  port: props.initialData.port || "22",
  authType: props.initialData.authType || "password",
  username: props.initialData.username || "root",
  password: props.initialData.password || "",
  remark: props.initialData.remark || ""
})

// Add watch for initialData
watch(
  () => props.initialData,
  (newData) => {
    form.value = {
      categoryId: newData?.categoryId || "nas",
      name: newData?.name || "",
      host: newData?.host || "",
      port: newData?.port || "22",
      authType: newData?.authType || "password",
      username: newData?.username || "root",
      password: newData?.password || "",
      remark: newData?.remark || ""
    }
  },
  { deep: true }
)

const rules: FormRules = {
  categoryId: [{ required: true, message: "请选择分组", trigger: "change" }],
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  host: [{ required: true, message: "请输入地址", trigger: "blur" }],
  port: [{ required: true, message: "请输入端口", trigger: "blur" }],
  username: [{ required: true, message: "请输入登录用户", trigger: "blur" }],
  password: [{ required: true, message: "请输入登录密码", trigger: "blur" }]
}

const handleTest = async () => {
  // 验证必填字段
  if (
    !form.value.host ||
    !form.value.port ||
    !form.value.username ||
    (form.value.authType === "password" && !form.value.password)
  ) {
    ElMessage.warning("请填写必要的连接信息")
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: "正在测试连接...",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    const server = JSON.parse(JSON.stringify(form.value))
    const result = await window.electronAPI.testServerConnection(server)

    if (result.success) {
      ElMessage.success("连接成功")
    } else {
      ElMessage.error(`连接失败: ${result.message}`)
    }
  } catch (error) {
    ElMessage.error(`连接失败: ${error instanceof Error ? error.message : "未知错误"}`)
  } finally {
    loading.close()
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit("submit", form.value)
      dialogVisible.value = false
    }
  })
}

const open = () => {
  dialogVisible.value = true
  // Reset form validation
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

defineExpose({
  open
})
</script>
