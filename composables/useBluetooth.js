export const useBluetooth = () => {
  const decodedData = ref('');

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
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
      );
      const characteristic = await service.getCharacteristic(
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      );

      characteristic.startNotifications();
      characteristic.addEventListener(
        'characteristicvaluechanged',
        handleCharacteristicValueChanged
      );

      // Return the characteristic for future use if needed
      return characteristic;
    } catch (error) {
      console.error('Error connecting to Bluetooth:', error);
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

  const getDataFromBluetooth = async (characteristic, data) => {
    try {
      const encoder = new TextEncoder('utf-8');
      const dataArrayBuffer = encoder.encode(data);
      await characteristic.writeValue(dataArrayBuffer);

      console.log(
        'Message sent successfully to Bluetooth characteristic:',
        data
      );
    } catch (error) {
      console.error('Error sending data to Bluetooth:', error);
    }
  };

  return { decodedData, connectBluetooth, getDataFromBluetooth };
};
