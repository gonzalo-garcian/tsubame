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
import { useTopologyStore } from "@/stores/useTopology";

let topology = useTopologyStore();

const currentCommand = ref("");
const terminalLines = ref([]);
const terminalBody = ref(null);
const commandInput = ref(null);

let commandRecord = [];
let commandRecordIndex = 0;

const DFS = new DepthFirstSearch();
const focusInput = () => {
  commandInput.value.focus();
};

const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === "l") {
    event.preventDefault();
    clearTerminalOutput();
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (commandRecordIndex > 0) {
      commandRecordIndex--;
      currentCommand.value = commandRecord[commandRecordIndex];
      console.log(commandRecord);
    }
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (commandRecordIndex < commandRecord.length) {
      commandRecordIndex++;
      currentCommand.value = commandRecord[commandRecordIndex];
      console.log(commandRecord);
    }
  }
};

const clearTerminalOutput = () => {
  terminalLines.value = [];
};

const executeCommand = () => {
  if (currentCommand.value.trim() !== "") {
    let commands = {
      ping: executePing,
    };

    let result;
    let mainCommand = currentCommand.value.match(/^\w+/)[0];
    let commandParams = currentCommand.value.split(" ").slice(1);
    if (commands[mainCommand]) {
      result = commands[mainCommand](commandParams);
    } else {
      result =
        "Eso no es un commando... ¿Necesitas ayuda? Usa el comando help para ver la lista de comandos";
    }
    terminalLines.value.push(currentCommand.value + "\n" + result);
    commandRecord.push(currentCommand.value);
    commandRecordIndex = commandRecord.length;
    currentCommand.value = "";
    nextTick().then(() => scrollTerminalToBottom());
  }
};

const executePing = (params) => {
  let source = "";
  let destination = "";

  function isFlag(param) {
    return param.includes("-");
  }

  for (let i = 0; i < params.length; i++) {
    if (params[i] === "-s" && !isFlag(params[i + 1])) {
      source = parseInt(params[i + 1]);
    } else if (params[i] === "-d" && !isFlag(params[i + 1])) {
      destination = parseInt(params[i + 1]);
    }
  }

  //Get randomly one interface with connection.
  let interfaceSource = topology.getNodeInstance(source).interfaces;
  interfaceSource = interfaceSource.filter((cInterface) => {
    return cInterface.network !== null;
  });
  console.log(interfaceSource);
  interfaceSource =
    interfaceSource[Math.floor(Math.random() * interfaceSource.length)];
  console.log(interfaceSource);

  let interfaceDestination = topology.getNodeInstance(destination).interfaces;
  interfaceDestination = interfaceDestination.filter((cInterface) => {
    return cInterface.network !== null;
  });
  console.log(interfaceDestination);
  interfaceDestination =
    interfaceDestination[
      Math.floor(Math.random() * interfaceDestination.length)
    ];
  console.log(interfaceDestination);

  let path = DFS.findPath(interfaceSource, interfaceDestination);

  let result = "";
  let TTL = 64;

  //Sent datagrams.
  for (let j = 0; j < path.length; j += 2) {
    result +=
      "IP | TTL = " +
      --TTL +
      " | ICMP (1) | IP_S = IP Host [" +
      path[0].father.id +
      "] Network [" +
      path[0].network.id +
      "] | IP_D = IP Host[" +
      path[path.length - 1].father.id +
      "] Network [" +
      path[path.length - 1].network.id +
      "] | Msg Type = Echo Request (8) | Code = Network unreachable (0) \n";
  }
  return result;
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
  padding: 10px;
  grid-area: terminal;
}

.terminal-header {
  font-size: 16px;
}

.terminal-body {
  height: 150px;
  overflow-y: auto;
  font-size: 14px;
}

.terminal-line {
  white-space: pre-wrap;
}

.terminal-prompt {
  color: #9370db;
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
