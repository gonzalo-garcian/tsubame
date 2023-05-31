<script setup>
defineProps(["data"]);
</script>

<template>
  <table>
    <tbody>
      <tr>
        <td colspan="3" class="frame">FRAME</td>
        <td colspan="4" class="datagram">DATAGRAM</td>
        <td colspan="2" class="data">DATA</td>
      </tr>
      <tr>
        <td class="attribute">MAC SOURCE</td>
        <td class="attribute">MAC DESTINATION</td>
        <td class="attribute">PROTOCOL</td>
        <td class="attribute">IP SOURCE</td>
        <td class="attribute">IP DESTINATION</td>
        <td class="attribute">TTL</td>
        <td class="attribute">PROTOCOL</td>
        <td class="attribute">MSG TYPE</td>
        <td class="attribute">CODE</td>
      </tr>
      <tr>
        <td>{{ data.MAC_S }}</td>
        <td>{{ data.MAC_D }}</td>
        <td>{{ data.PROTOCOL_N }}</td>
        <td>{{ data.IP_S }}</td>
        <td>{{ data.IP_D }}</td>
        <td>{{ data.TTL }}</td>
        <td>{{ data.PROTOCOL_IP }}</td>
        <td>{{ data.MSG_TYPE }}</td>
        <td>{{ data.CODE }}</td>
      </tr>
    </tbody>
  </table>
  <br />
</template>

<style scoped>
.frame {
  text-align: center;
  background: #4cad4c;
}

.datagram {
  background: #c51d34;
}
.data {
  background: #8892c6;
}

.attribute {
  background: #9ca3af;
}

table,
td,
th {
  text-align: center;
  border: 1px solid #595959;
  border-collapse: collapse;
  color: white;
}
td,
th {
  padding: 3px;
  width: 170px;
  height: 25px;
}
</style>
