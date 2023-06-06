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
        <br />
        <component
          v-for="(data, index) in result.dataList"
          :key="index"
          :is="result.type"
          :data="data"
        />
      </div>
      <div class="terminal-input-container">
        <span class="terminal-prompt" v-if="!isExecCommand"
          >user@terminal:~$</span
        >
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
import ErrorLogItem from "@/components/sandbox/terminal/results/ErrorLogItem.vue";

let topology = useTopologyStore();

const currentCommand = ref("");
const terminalBody = ref(null);
const commandInput = ref(null);
const results = ref([]);
const isExecCommand = ref(false);

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
  results.value = [];
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
      isExecCommand.value = true;
      commands[mainCommand](commandParams);
    } else {
      results.value.push({
        command: currentCommand.value,
        type: ErrorLogItem,
        dataList: [
          {
            ERROR_LOG: "Command not found",
          },
        ],
      });
    }
    commandRecord.push(currentCommand.value);
    commandRecordIndex = commandRecord.length;
    currentCommand.value = "";
    nextTick().then(() => scrollTerminalToBottom());
  }
};

const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const executeHelp = () => {
  results.value.push({
    command: currentCommand.value,
    type: ErrorLogItem,
    dataList: [
      {
        ERROR_LOG:
          "ping: Envía un datagrama ICMP de un nodo A a un nodo B\n-s: desde que nodo se envía  " +
          "\n-d: a que nodo se quiere enviar" +
          "\n-delay: número en milisegundos que la trama tarda en aparecer",
      },
    ],
  });
  isExecCommand.value = false;
};
const executePing = async (params) => {
  let source = "";
  let destination = "";
  let delay = 0;

  results.value.push({
    command: currentCommand.value,
    type: PingItem,
    dataList: [],
  });

  function isFlag(param) {
    return param.includes("-");
  }

  for (let i = 0; i < params.length; i++) {
    if (params[i] === "-s" && !isFlag(params[i + 1])) {
      source = params[i + 1];
    } else if (params[i] === "-d" && !isFlag(params[i + 1])) {
      destination = params[i + 1];
    } else if (params[i] === "-delay" && !isFlag(params[i + 1])) {
      delay = parseInt(params[i + 1]);
    }
  }

  console.log("NODO_S -> " + source);
  console.log(topology.getNodeInstanceByStringId(source));

  console.log("NODO_D -> " + destination);
  console.log(topology.getNodeInstanceByStringId(destination));

  try {
    //Get randomly one interface with connection.
    let interfaceSource = topology.getNodeInstanceByStringId(source).interfaces;
    interfaceSource = interfaceSource.filter((cInterface) => {
      return cInterface.network !== null;
    });
    console.log(interfaceSource);
    interfaceSource =
      interfaceSource[Math.floor(Math.random() * interfaceSource.length)];
    console.log(interfaceSource);

    let interfaceDestination =
      topology.getNodeInstanceByStringId(destination).interfaces;
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

    let REQ_TTL = 64;
    let RES_TTL = 64;

    //Sent datagrams.
    for (let j = 0; j < path.length; j += 2) {
      let res = {
        MAC_S: path[j].father.stringId + "_ETH-" + path[j].direction,
        MAC_D: path[j + 1].father.stringId + "_ETH-" + path[j + 1].direction,
        PROTOCOL_N: "IP",
        IP_S: path[0].father.stringId + "_ETH-" + path[0].direction,
        IP_D:
          path[path.length - 1].father.stringId +
          "_ETH-" +
          path[path.length - 1].direction,
        TTL: --REQ_TTL,
        PROTOCOL_IP: "ICMP (1)",
        MSG_TYPE: "Echo Request (8)",
        CODE: "Network unreachable (0)",
      };

      await sleep(delay);
      results.value[results.value.length - 1].dataList.push(res);
      nextTick().then(() => scrollTerminalToBottom());
    }

    for (let j = path.length - 1; j > 0; j -= 2) {
      let res = {
        MAC_S: path[j].father.stringId + "_ETH-" + path[j].direction,
        MAC_D: path[j - 1].father.stringId + "_ETH-" + path[j - 1].direction,
        PROTOCOL_N: "IP",
        IP_S:
          path[path.length - 1].father.stringId +
          "_ETH-" +
          path[path.length - 1].direction,
        IP_D: path[0].father.stringId + "_ETH-" + path[0].direction,
        TTL: --RES_TTL,
        PROTOCOL_IP: "ICMP (1)",
        MSG_TYPE: "Echo Reply (0)",
        CODE: "Network unreachable (0)",
      };

      await sleep(delay);
      results.value[results.value.length - 1].dataList.push(res);
      nextTick().then(() => scrollTerminalToBottom());
    }
  } catch (e) {
    results.value.pop();
    results.value.push({
      command: currentCommand.value,
      type: ErrorLogItem,
      dataList: [
        {
          ERROR_LOG:
            "To use ping properly, make sure you're using a valid node and valid flags\nExample: ping -s H1 -d H2 -delay 2000\nFurther details--> " +
            e +
            "\n You need to take into account the fact that the command ping uses a random eth (source and destination) from the host node selected, so \n" +
            "in some cases the command could fail because there is no path between the selected interfaces.",
        },
      ],
    });
  }
  isExecCommand.value = false;
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
