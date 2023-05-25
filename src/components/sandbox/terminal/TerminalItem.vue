<template>
  <div class="terminal" @click="focusInput" @keydown="handleKeyDown">
    <div class="terminal-header">Network terminal</div>
    <div class="terminal-body" ref="terminalBody">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="terminal-line"
      >
        <span class="terminal-prompt">user@terminal:~$</span>
        <span class="terminal-command">{{ result.command }}</span>
        <component
          v-for="(data, index) in result.dataList"
          :key="index"
          :is="result.type"
          :data="data"
        />
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
import PingItem from "@/components/sandbox/terminal/results/PingItem.vue";

let topology = useTopologyStore();

const currentCommand = ref("");
const terminalBody = ref(null);
const commandInput = ref(null);
let results = [];

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
  results = [];
};

const executeCommand = () => {
  if (currentCommand.value.trim() !== "") {
    let commands = {
      ping: executePing,
      help: executeHelp,
    };

    let mainCommand = currentCommand.value.match(/^\w+/)[0];
    let commandParams = currentCommand.value.split(" ").slice(1);
    if (commands[mainCommand]) {
      commands[mainCommand](commandParams);
    }
    commandRecord.push(currentCommand.value);
    commandRecordIndex = commandRecord.length;
    currentCommand.value = "";
    nextTick().then(() => scrollTerminalToBottom());
  }
};

const executeHelp = (params) => {
  return "ping: Envía un datagrama ICMP de un nodo A a un nodo B\n-s: desde que nodo se envía  \n-d: a que nodo se quiere enviar";
};
const executePing = (params) => {
  let source = "";
  let destination = "";

  results.push({
    command: currentCommand.value,
    type: PingItem,
    dataList: [],
  });

  results[results.length - 1].dataList.push({
    name: "ping",
  });

  /*
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
      "MAC_S = MAC Host [" +
      path[j].father.id +
      "] Eth [" +
      path[j].direction +
      "] | MAC_D = MAC Host[" +
      path[j + 1].father.id +
      "] Eth [" +
      path[j + 1].direction +
      "] | IP | TTL = " +
      --TTL +
      " | ICMP (1) | IP_S = IP Host [" +
      path[0].father.id +
      "] Eth [" +
      path[0].direction +
      "] | IP_D = IP Host[" +
      path[path.length - 1].father.id +
      "] Eth [" +
      path[path.length - 1].direction +
      "] | Msg Type = Echo Request (8) | Code = Network unreachable (0) \n";
  }

  result += "REPLY \n";

  for (let j = path.length - 1; j > 0; j -= 2) {
    result +=
      "MAC_S = MAC Host [" +
      path[j].father.id +
      "] Eth [" +
      path[j].direction +
      "] | MAC_D = MAC Host[" +
      path[j - 1].father.id +
      "] Eth [" +
      path[j - 1].direction +
      "] | IP | TTL = " +
      --TTL +
      " | ICMP (1) | IP_S = IP Host [" +
      path[path.length - 1].father.id +
      "] Eth [" +
      path[path.length - 1].direction +
      "] | IP_D = IP Host[" +
      path[0].father.id +
      "] Eth [" +
      path[0].direction +
      "] | Msg Type = Echo Request (8) | Code = Network unreachable (0) \n";
  }
  return result;

   */
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
  height: 300px;
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
  height: 250px;
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
  width: 50%;
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
