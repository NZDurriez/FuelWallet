import { BrowserMultiFormatReader } from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/esm/index.min.js';

const scanBtn = document.getElementById("scanBtn");

scanBtn.addEventListener("click", async () => {
  try {
    const codeReader = new BrowserMultiFormatReader();
    const videoInput = await codeReader.listVideoInputDevices();
    if (!videoInput.length) throw new Error("No camera found");
    
    const selectedDeviceId = videoInput[0].deviceId;

    const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'body');
    if (result) {
      const store = prompt("Enter store name for scanned voucher:");
      const expiry = prompt("Enter expiry date (optional):");
      saveVoucher({ store, code: result.text, expiry });
    }
  } catch (err) {
    alert("Barcode scan failed, please add manually.");
    addManualVoucher();
  }
});
