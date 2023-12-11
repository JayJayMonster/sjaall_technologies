<template>
  <div class="flex flex-col justify-center items-center h-screen m-2">
    <div>
      Dit is jouw kleur:
    </div>
    <div class="m-2">
      <p class="font-bold text-center">{{ computedHexNumber }}</p>
      <input class="text-center m-1 rounded" v-model="computedHexNumber" />
    </div>
    <p v-if="bluetoothInfo.isBluetoothAvailable">Bluetooth is available</p>
    <p v-else>Bluetooth is not available</p>
    <button @click="bluetoothInfo.connectToDevice" :disabled="!bluetoothInfo.isBluetoothAvailable">Connect to Device</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBluetooth } from '~/composables/useBluetooth';

const hexNumber = ref('');
const bluetoothInfo = useBluetooth();

const computedHexNumber = computed({
  get: () => hexNumber.value,
  set: (value) => {
    document.body.style.backgroundColor = value;
    hexNumber.value = value;
  },
});
</script>
