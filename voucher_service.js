const voucherList = document.getElementById("voucherList");

function saveVoucher(voucher) {
  const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
  vouchers.push(voucher);
  localStorage.setItem("vouchers", JSON.stringify(vouchers));
  renderVouchers();
}

function renderVouchers() {
  const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
  voucherList.innerHTML = "";
  vouchers.forEach((v, idx) => {
    const li = document.createElement("li");
    li.textContent = `${v.store}: ${v.code} (Expires: ${v.expiry || 'N/A'})`;
    voucherList.appendChild(li);
  });
}

function addManualVoucher() {
  const store = prompt("Enter store name:");
  const code = prompt("Enter voucher code:");
  const expiry = prompt("Enter expiry date (optional):");
  if (store && code) saveVoucher({ store, code, expiry });
}

document.getElementById("manualBtn").addEventListener("click", addManualVoucher);

renderVouchers();