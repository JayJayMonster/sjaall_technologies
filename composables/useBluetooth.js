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

  const bluetooth = () => {
    navigator.bluetooth
      .requestDevice({
        filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }],
      })
      .then(device => device.gatt.connect())
      .then(server =>
        server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
      )
      .then(service =>
        service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e')
      )
      .then(characteristic => characteristic.startNotifications())
      .then(characteristic => {
        characteristic.addEventListener('characteristicvaluechanged', event => {
          const receivedData = event.target.value;
          const decoder = new TextDecoder('utf-8');
          const localDecodedData = decoder.decode(receivedData); // Rename the local variable

          // Use the parseRGBValues function to get valid RGB values
          const { validRed, validGreen, validBlue } =
            parseRGBValues(localDecodedData);

          // Update the decodedData ref with the formatted RGB string
          decodedData.value = `rgb(${validRed}, ${validGreen}, ${validBlue})`;
        });

        // Get the second characteristic to send data to
        return characteristic.service.getCharacteristic(
          '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
        );
      })
      .then(secondCharacteristic => {
        // Function to send data
        function sendData(data) {
          const encoder = new TextEncoder('utf-8');
          const dataArrayBuffer = encoder.encode(data);
          return secondCharacteristic.writeValue(dataArrayBuffer);
        }

        // Sending "scan\r\n" to the device using the second characteristic
        return sendData('scan\r\n');
      })
      .then(() => {
        console.log(
          'Message sent successfully to second characteristic: scan\\r\\n'
        );
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return { decodedData, bluetooth };
};
