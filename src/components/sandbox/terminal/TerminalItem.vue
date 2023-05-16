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
import { DepthFirstSearch } from "@/composables/DepthFirstSearch";
import { Network } from "@/composables/Network";
import { Interface } from "@/composables/Interface";
import { NetworkNode } from "@/composables/NetworkNode";

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
    let n1 = new Network();
    let h1 = new NetworkNode("host");
    let ni1 = new Interface(n1, h1);
    h1.addInterface(ni1);
    n1.addNodeInterface(ni1);
    let r2 = new NetworkNode("router");
    let r2i1 = new Interface(n1, r2);
    r2.addInterface(r2i1);
    n1.addNodeInterface(r2i1);
    let r1 = new NetworkNode("router");
    let ri1 = new Interface(n1, r1);
    r1.addInterface(ri1);
    n1.addNodeInterface(ri1);
    let n2 = new Network();
    let ri2 = new Interface(n2, r1);
    r1.addInterface(ri2);
    n2.addNodeInterface(ri2);
    let h2 = new NetworkNode("host");
    let hi2 = new Interface(n2, h2);
    h2.addInterface(hi2);
    n2.addNodeInterface(hi2);

    terminalLines.value.push(currentCommand.value + "\n");

    console.log(DFS.findPath(ni1, hi2));
    currentCommand.value = "";
    nextTick().then(() => scrollTerminalToBottom());
    /*setTimeout(() => {
      scrollTerminalToBottom();
    }, 0);*/
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
