<template>
  <div class="flex flex-col justify-center items-center h-screen m-2">
    <div>
      Dit is jouw kleur:
    </div>
    <div class="m-2">
      <p class="font-bold text-center">{{ computedHexNumber }}</p>
      <input class="text-center m-1 rounded" v-model="computedHexNumber" />
    </div>
    <button class="bg-gray-600 rounded p-1 border border-black text-white" @click="requestDevice()">
    Request Bluetooth Device
  </button>
  </div>
</template>

<script setup lang="ts">
import { useBluetooth } from '@vueuse/core'

const {
  isSupported,
  isConnected,
  device,
  requestDevice,
  server,
} = useBluetooth({
  acceptAllDevices: true,
})

interface MyComponentProps {
  hexNumber: string;
}

const props = defineProps<MyComponentProps>();
const hexNumber = ref(props.hexNumber);

const computedHexNumber = computed({
  get: () => hexNumber.value,
  set: (value) => {
    document.body.style.backgroundColor = value;
    hexNumber.value = value;
  },
});

if ('bluetooth' in navigator) {
    // Request Bluetooth device
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [0x181A] }], // Replace with your service UUID
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(0x181A); // Replace with your service UUID
        const characteristic = await service.getCharacteristic(0x0003); // Replace with your characteristic UUID

        // Set up event listener for characteristic value changes
        characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            // Handle the received value (button state)
            console.log('Received value:', value.getUint8(0));
        });

        // Enable notifications for characteristic value changes
        await characteristic.startNotifications();
    } catch (error) {
        console.error('Error:', error);
    }
} else {
    console.error('Web Bluetooth is not supported.');
}



</script>
