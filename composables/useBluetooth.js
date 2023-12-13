export const useBluetooth = () => {
  const bluetooth = () => {
    // Request access to Bluetooth devices
    navigator.bluetooth
      .requestDevice({
        filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }],
      })
      .then(device => {
        console.log('Device connected:', device.name);

        // Connect to the selected device
        return device.gatt.connect();
      })
      .then(server => {
        console.log('Connected to GATT server');

        // Get the specified service
        return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
      })
      .then(service => {
        console.log('Got service:', service.uuid);

        // Get the characteristic you want to write to
        return service.getCharacteristic(
          '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
        );
      })
      .then(characteristic => {
        console.log('Got characteristic:', characteristic.uuid);

        // Prepare data to be sent (convert your message to ArrayBuffer)
        const message = 'Hallo, Sander!';
        const encodedMessage = new TextEncoder().encode(message);

        // Write the value to the characteristic
        return characteristic.writeValue(encodedMessage);
      })
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  return { bluetooth };
};
