// useBluetoothService.js
import { ref, watchEffect } from 'vue';

export async function useBluetooth() {
  const isBluetoothAvailable = ref('bluetooth' in navigator);
  const bluetoothDevice = ref(null);
  const gattServer = ref(null);
  const customServiceUuid = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  const customCharacteristicUuid = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

  async function connectToDevice() {
    try {
      // Request a Bluetooth device
      bluetoothDevice.value = await navigator.bluetooth.requestDevice({
        filters: [{ services: [customServiceUuid] }],
      });

      // Connect to the GATT server
      gattServer.value = await bluetoothDevice.value.gatt.connect();

      // Get the custom service
      const service = await gattServer.value.getPrimaryService(
        customServiceUuid
      );

      // Get the custom characteristic
      const characteristic = await service.getCharacteristic(
        customCharacteristicUuid
      );

      // Now you can use the 'characteristic' for read, write, or notify operations
      // For example, reading the value:
      const value = await characteristic.readValue();
      console.log('Read value:', new TextDecoder().decode(value));

      // Or writing a value:
      const data = new TextEncoder().encode('testing thingie');
      await characteristic.writeValue(data);

      // Or subscribing to notifications:
      characteristic.addEventListener('characteristicvaluechanged', event => {
        const value = event.target.value;
        console.log('Notification value:', new TextDecoder().decode(value));
      });
      await characteristic.startNotifications();
    } catch (error) {
      console.error('Bluetooth connection error:', error);
    }
  }

  return {
    isBluetoothAvailable,
    connectToDevice,
  };
}
