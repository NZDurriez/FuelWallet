const form = document.getElementById('receipt-form');
const receiptsList = document.getElementById('receipts');

const scanBtn = document.getElementById('scan-barcode');
const video = document.getElementById('camera');

// Load receipts from localStorage
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];
renderReceipts();

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const store = document.getElementById('store').value;
  const date = document.getElementById('date').value;
  const amount = parseFloat(document.getElementById('amount').value).toFixed(2);
  const voucher = document.getElementById('voucher').value;

  const receipt = { store, date, amount, voucher };
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));

  form.reset();
  renderReceipts();
});

function renderReceipts() {
  receiptsList.innerHTML = '';
  receipts.forEach((r, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${r.store}</strong> - ${r.date} - $${r.amount} ${r.voucher ? '- Voucher: ' + r.voucher : ''} <button onclick="deleteReceipt(${index})">Delete</button>`;
    receiptsList.appendChild(li);
  });
}

function deleteReceipt(index) {
  receipts.splice(index, 1);
  localStorage.setItem('receipts', JSON.stringify(receipts));
  renderReceipts();
}

// ---------------- Barcode scanner ----------------
scanBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    video.setAttribute('playsinline', true); // iOS
    video.style.display = 'block';
    video.play();
    requestAnimationFrame(scanFrame);
  } catch (err) {
    alert('Camera access denied or not available.');
  }
});

function scanFrame() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      document.getElementById('voucher').value = code.data;
      stopCamera();
      alert('Voucher scanned successfully!');
    } else {
      requestAnimationFrame(scanFrame);
    }
  } else {
    requestAnimationFrame(scanFrame);
  }
}

function stopCamera() {
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    video.style.display = 'none';
  }
}

// ---------------- PWA Service Worker ----------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}