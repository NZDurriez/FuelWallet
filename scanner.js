const video=document.getElementById("camera");
const statusText=document.getElementById("statusText");
let stream;

async function startCamera(){
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
  video.srcObject=stream;
  scanLoop();
}

startCamera();

// Scan loop
async function scanLoop(){
  const canvas=document.createElement("canvas");
  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;
  const ctx=canvas.getContext("2d");
  
  const scanInterval=setInterval(async()=>{
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    
    // ZXing barcode detection
    try{
      const code=ZXing.BrowserBarcodeReader().decodeFromImage(imageData);
      if(code){
        statusText.innerText="Barcode detected!";
        clearInterval(scanInterval);
        await saveVoucher(code.text,canvas.toDataURL("image/jpeg"));
      }
    }catch(e){}
  },500);
}

async function saveVoucher(barcodeValue,image){
  // OCR
  const { data:{text} }=await Tesseract.recognize(image,'eng',{logger:m=>console.log(m)});
  
  // Simple parsing
  let store=text.split("\n")[0]||"Unknown Store";
  let amountMatch=text.match(/\$\s?(\d+(\.\d{1,2})?)/);
  let dateMatch=text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
  
  const voucher={
    id:Date.now().toString(),
    store:store.trim(),
    amount:amountMatch?parseFloat(amountMatch[1]).toFixed(2):"0",
    expiry:dateMatch?new Date(dateMatch[1].replace(/-/g,'/')).toISOString().split("T")[0]:"Unknown",
    barcode:barcodeValue,
    photo:image
  };
  
  await db.save(voucher);
  stream.getTracks().forEach(t=>t.stop());
  window.location="index.html";
}