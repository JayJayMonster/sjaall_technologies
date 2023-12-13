<template>
  <div class="flex flex-col justify-center items-center h-screen m-2">
    <div class="font-bold text-4xl mb-16">
      <h1>SJAALL TECHNOLOGIES</h1>
    </div>
    <div>
      Dit is jouw kleur:
    </div>
    <div class="m-2">
      <p class="font-bold text-center">{{ computedHexNumber }}</p>
      <input class=" text-center border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-500" v-model="computedHexNumber" />
    </div>
    <button @click="bluetooth" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Connect to Bluetooth device</button>
  </div>
</template>

<script setup>
const hexNumber = ref('');

const computedHexNumber = computed({
  get: () => hexNumber.value,
  set: (value) => {
    document.body.style.backgroundColor = value;
    hexNumber.value = value;
  },
});

const { bluetooth } = useBluetooth();
</script>
