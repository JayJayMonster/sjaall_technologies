<template>
  <div class="flex flex-col justify-center items-center h-screen m-2">
    <img src="~/assets/images/notext.png" alt="logo" class="h-32 mb-8">
    <div class="font-bold text-4xl mb-4">
      <div>
          <h1 class="text-center">SJAALL TECHNOLOGIES</h1>
        <hr class="bg-[#92278F] h-0.5 mx-auto sm:mx-8">
      </div>
    </div>
    <div>
      This is your colour:
    </div>
    <div class="m-2">
      <p class="font-bold text-center">{{ decodedData }}</p>
    </div>
    <div class="flex items-stretch flex-col">
      <button @click="connectBluetooth" 
              :class="{ 'bg-[#808080]': isConnected, 'bg-[#92278F]': !isConnected, 'hover:bg-[#662D91]': !isConnected }" 
              :disabled="isConnected"
              class="text-[#FFFFFF] font-bold py-2 px-4 rounded mb-4">
        {{ isConnected ? 'Device connected' : 'Connect to Bluetooth device' }}
      </button>   
      <button @click="getDataFromBluetooth" class="bg-[#92278F] hover:bg-[#662D91] text-[#FFFFFF] font-bold py-2 px-4 mb-4 rounded">Scan colour</button>
      <button v-if="isConnected" @click="disconnectBluetooth" class="bg-[#92278F] hover:bg-[#662D91] text-[#FFFFFF] font-bold py-2 px-4 rounded">Disconnect device</button>
    </div>
  </div>
</template>

<script setup>
const { connectBluetooth, decodedData, isConnected, getDataFromBluetooth, disconnectBluetooth } = useBluetooth();

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
