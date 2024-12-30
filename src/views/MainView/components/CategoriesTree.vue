<template>
  <div class="w-400px">
    <el-tree :data="directories" />
  </div>
</template>
<script setup lang="tsx">
import type { Ccategories } from "@/types/server"
import { onMounted } from "vue"

const directories = ref<Ccategories[]>([])

onMounted(() => {
  directories.value = window.electronAPI.loadCategories()
})
</script>
