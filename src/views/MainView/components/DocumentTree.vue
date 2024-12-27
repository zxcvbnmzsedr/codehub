<template>
  <el-tree :data="directories" />
</template>
<script setup lang="tsx">
import type { Directory } from "@/types/server"

const directories = ref<Directory[]>([])
</script>
