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
  vouchers.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `${v.store}: ${v.code} (Expires: ${v.expiry || 'N/A'})`;
    voucherList.appendChild(li);
  });
}

renderVouchers();
