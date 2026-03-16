const scanBtn = document.getElementById("scanBtn");
const videoElement = document.getElementById("video");

scanBtn.addEventListener("click", async () => {
  const codeReader = new ZXing.BrowserMultiFormatReader();
  try {
    const videoInputDevices = await codeReader.listVideoInputDevices();
    if (!videoInputDevices.length) throw new Error("No camera found");
    const deviceId = videoInputDevices[0].deviceId;

    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
      if (result) {
        codeReader.reset(); // stop scanning
        saveVoucher({ store: "Unknown", code: result.text });
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
      }
    });
  } catch (e) {
    alert("Cannot access camera. Make sure you allow camera access and are on HTTPS.");
    console.error(e);
  }
});
