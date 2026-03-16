import { BrowserMultiFormatReader, NotFoundException } from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/esm/index.min.js';
import { saveVoucher } from './voucher_service.js';

const scanBtn = document.getElementById("scanBtn");
const videoElement = document.getElementById("video");

scanBtn.addEventListener("click", async () => {
  try {
    const codeReader = new BrowserMultiFormatReader();
    const devices = await codeReader.listVideoInputDevices();
    if (!devices.length) throw new Error("No camera found");

    const deviceId = devices[0].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
      if (result) {
        codeReader.reset(); // stop scanning
        alert(`Voucher scanned: ${result.text}`);
        saveVoucher({ store: "Unknown", code: result.text });
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
      }
    });

  } catch (err) {
    alert("Unable to access camera. Make sure you allow camera access.");
    console.error(err);
  }
});
