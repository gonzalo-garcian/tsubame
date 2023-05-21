<template>
  <div class="terminal" @click="focusInput" @keydown="handleKeyDown">
    <div class="terminal-header">Network terminal</div>
    <div class="terminal-body" ref="terminalBody">
      <div
        v-for="(line, index) in terminalLines"
        :key="index"
        class="terminal-line"
      >
        <span class="terminal-prompt">user@terminal:~$</span>
        <span class="terminal-command">{{ line }}</span>
      </div>
      <div class="terminal-input-container">
        <span class="terminal-prompt">user@terminal:~$</span>
        <input
          class="terminal-input"
          type="text"
          v-model="currentCommand"
          @keydown.enter="executeCommand"
          ref="commandInput"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { DepthFirstSearch } from "@/models/DepthFirstSearch";
import { Network } from "@/models/Network";
import { Interface } from "@/models/Interface";
import { NetworkNode } from "@/models/NetworkNode";

const currentCommand = ref("");
const terminalLines = ref([]);
const terminalBody = ref(null);
const commandInput = ref(null);

const DFS = new DepthFirstSearch();
const focusInput = () => {
  commandInput.value.focus();
};

const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === "l") {
    event.preventDefault();
    clearTerminalOutput();
  }
};

const clearTerminalOutput = () => {
  terminalLines.value = [];
};

const executeCommand = () => {
  if (currentCommand.value.trim() !== "") {
    terminalLines.value.push(currentCommand.value + "\n");
    currentCommand.value = "";
    nextTick().then(() => scrollTerminalToBottom());
  }
};

const scrollTerminalToBottom = () => {
  terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
};

onMounted(() => {
  scrollTerminalToBottom();
});
</script>

<style scoped>
.terminal {
  height: 200px;
  background-color: #303030;
  color: white;
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
  grid-area: terminal;
}

.terminal-body {
  height: 150px;
  overflow-y: auto;
}

.terminal-line {
  white-space: pre-wrap;
}

.terminal-prompt {
  color: limegreen;
  margin-right: 5px;
}

.terminal-command {
  color: #fff;
}

.terminal-input {
  background-color: transparent;
  border: none;
  outline: none;
  color: #fff;
  caret-shape: block;
}

/* Custom scroll bar styles */
.terminal-body::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

.terminal-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
}

.terminal-body::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Hide the up and down buttons on the scroll bar */
.terminal-body::-webkit-scrollbar-button {
  display: none;
}
</style>
