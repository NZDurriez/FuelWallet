const voucherList = document.getElementById("voucherList");

function saveVoucher(voucher) {
  const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");

  // Prevent duplicates
  if (!vouchers.some(v => v.code === voucher.code)) {
    vouchers.push(voucher);
    localStorage.setItem("vouchers", JSON.stringify(vouchers));
    renderVouchers();
  }
}

function renderVouchers() {
  const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
  voucherList.innerHTML = "";

  vouchers.forEach(v => {
    const li = document.createElement("li");
    li.classList.add("voucher-card");
    li.innerHTML = `
      <strong>${v.store || "Unknown Store"}</strong><br>
      Code: ${v.code}<br>
      Expires: ${v.expiry || "N/A"}
    `;
    voucherList.appendChild(li);
  });
}

renderVouchers();
