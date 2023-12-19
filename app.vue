<template>
  <div class="flex flex-col justify-center items-center h-screen m-2">
    <div class="font-bold text-4xl mb-16">
      <h1 class="text-center">SJAALL TECHNOLOGIES</h1>
    </div>
    <div>
      Dit is jouw kleur:
    </div>
    <div class="m-2">
      <p class="font-bold text-center">{{ decodedData }}</p>
    </div>
    <button @click="bluetooth" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4">Connect to Bluetooth device</button>
    <!-- <button @click="getDataFromBluetooth" class="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">Get Data</button> -->
  </div>
</template>

<script setup>
const { bluetooth, decodedData } = useBluetooth();

// Create a ref to store the decoded data
const decodedDataRef = ref('');

// // Watch for changes in decodedData and update the ref accordingly
watchEffect(() => {
  decodedDataRef.value = decodedData.value;
});

// // Create a computed property for setting the background color
const computedBackgroundColor = computed({
      get: () => decodedDataRef.value,
      set: (value) => {
        // Check if we are in a browser environment
        if (typeof window !== 'undefined') {
          document.body.style.backgroundColor = value;
        }
        decodedDataRef.value = value;
      },
    });


//   // Watch for changes in decodedData and trigger the computed property to update
  watchEffect(() => {
      computedBackgroundColor.value = decodedDataRef.value;
    });

</script>
