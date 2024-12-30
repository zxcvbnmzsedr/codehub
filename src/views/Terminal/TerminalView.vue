<template>
  <div class="terminal-container" ref="terminalRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

const route = useRoute()
const serverId = route.params.serverId as string
const terminalRef = ref<HTMLElement>()
let terminal: Terminal
let fitAddon: FitAddon

onMounted(() => {
  terminal = new Terminal({
    cursorBlink: true,
    theme: {
      background: "#1e1e1e"
    }
  })

  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)

  terminal.open(terminalRef.value!)
  fitAddon.fit()

  terminal.onData((data) => {
    window.electronAPI.writeSSH(serverId, data)
  })

  window.electronAPI.onSSHData((data: string) => {
    terminal.write(data)
  })

  window.addEventListener("resize", () => {
    fitAddon.fit()
  })
})

onBeforeUnmount(() => {
  window.electronAPI.disconnectSSH(serverId)
  terminal.dispose()
})
</script>

<style>
.terminal-container {
  width: 100%;
  height: 100vh;
  background: #1e1e1e;
  padding: 16px;
}
</style>
