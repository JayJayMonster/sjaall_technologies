export const useBluetooth = () => {
  const decodedData = ref('');
  let bluetoothDevice; // Variable to store the Bluetooth device
  let writeCharacteristic; // Variable to store the write characteristic
  let readCharacteristic; // Variable to store the read characteristic
   // Create a ref to track connection status
   const isConnected = ref(false);

  const parseRGBValues = rgbString => {
    const [red, green, blue] = rgbString.split(',').map(Number);

    // Validate and ensure that the values are within the valid range (0-255)
    const validRed = isNaN(red) ? 0 : Math.min(255, Math.max(0, red));
    const validGreen = isNaN(green) ? 0 : Math.min(255, Math.max(0, green));
    const validBlue = isNaN(blue) ? 0 : Math.min(255, Math.max(0, blue));

    return { validRed, validGreen, validBlue };
  };

  const connectBluetooth = async () => {
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }],
      });
      isConnected.value = true; // Set connection status to true
      const server = await bluetoothDevice.gatt.connect();
      const service = await server.getPrimaryService(
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
      );
      writeCharacteristic = await service.getCharacteristic(
        '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
      );
      readCharacteristic = await service.getCharacteristic(
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      );

      readCharacteristic.startNotifications();
      readCharacteristic.addEventListener(
        'characteristicvaluechanged',
        handleCharacteristicValueChanged
      );

      console.log('Bluetooth connected successfully');
    } catch (error) {
      isConnected.value = false; // Set connection status to false in case of an error
      console.error('Error connecting to Bluetooth: ', error);
    }
  };

  const getDataFromBluetooth = () => {
    if (writeCharacteristic) {
      // Sending a 'scan\r\n' command to receive data
      const command = 'scan\r\n';
      const encoder = new TextEncoder('utf-8');
      const dataArrayBuffer = encoder.encode(command);
      writeCharacteristic.writeValue(dataArrayBuffer);
    } else {
      console.error(
        'Bluetooth write characteristic not initialized. Please connect first.'
      );
    }
  };

  const handleCharacteristicValueChanged = event => {
    const receivedData = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const localDecodedData = decoder.decode(receivedData);

    // Use the parseRGBValues function to get valid RGB values
    const { validRed, validGreen, validBlue } =
      parseRGBValues(localDecodedData);

    // Update the decodedData ref with the formatted RGB string
    decodedData.value = `rgb(${validRed}, ${validGreen}, ${validBlue})`;
  };

  const disconnectBluetooth = async () => {
    try {
      await bluetoothDevice.gatt.disconnect();
      isConnected.value = false; // Set connection status to false upon disconnection
      decodedData.value = `rgb(255, 255, 255)`;
      console.log('Bluetooth disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Bluetooth: ', error);
    }
  };

  return {
    decodedData,
    isConnected, // expose connection status
    connectBluetooth,
    getDataFromBluetooth,
    disconnectBluetooth,
  };
};
