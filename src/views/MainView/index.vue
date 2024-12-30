<template>
  <div class="flex h-full">
    <!-- 左侧目录树 -->
    <div class="border-r border-gray-200">
      <categories-tree @select="handleCategorySelect" />
    </div>

    <!-- 右侧内容区 -->
    <div class="flex-1 p-4 space-y-4 overflow-auto">
      <!-- 账号密码列表 -->
      <credential-list v-if="selectedCategoryId" :category-id="selectedCategoryId" />

      <!-- 服务器列表 -->
      <server-list v-if="selectedCategoryId" :category-id="selectedCategoryId" />

      <!-- 数据库列表 -->
      <database-list v-if="selectedCategoryId" :category-id="selectedCategoryId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CategoriesTree from "./components/CategoriesTree.vue"
import ServerList from "./components/ServerList.vue"
import DatabaseList from "./components/DatabaseList.vue"
import CredentialList from "./components/CredentialList.vue"
import type { Ccategories } from "@/types/server"

const selectedCategoryId = ref<string>("")

const handleCategorySelect = (category: Ccategories) => {
  selectedCategoryId.value = category.id
}
</script>

<style scoped>
.h-full {
  height: calc(100vh - 60px); /* 减去可能的顶部导航栏高度 */
}
</style>
