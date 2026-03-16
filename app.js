const wallet=document.getElementById("wallet");
const scanBtn=document.getElementById("scanBtn");

scanBtn.onclick=()=>{ window.location="scanner.html"; };

async function loadVouchers(){
  wallet.innerHTML="";
  const vouchers=await db.getAll();
  
  vouchers.sort((a,b)=> new Date(a.expiry)-new Date(b.expiry));
  
  vouchers.forEach(v=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <div class="cardTitle">${v.store}</div>
      <div class="cardAmount">$${v.amount} Fuel Voucher</div>
      <div>Expires: ${v.expiry}</div>
      <div class="cardBarcode">
        ${v.barcode || ""}
      </div>
      <button onclick="showBarcode('${v.id}')">Show Barcode</button>
      <button onclick="deleteVoucher('${v.id}')">Delete</button>
    `;
    wallet.appendChild(card);
  });
}

async function deleteVoucher(id){
  await db.delete(id);
  loadVouchers();
}

function showBarcode(id){
  db.getAll().then(vouchers=>{
    const v=vouchers.find(x=>x.id===id);
    if(!v) return;
    const w=window.open("","Barcode","width=400,height=300");
    w.document.write(`
      <div style="text-align:center;font-size:20px;margin-top:10px">
        $${v.amount} Fuel Voucher<br>
        ${v.store}<br>
        Expires ${v.expiry}<br><br>
        <svg id="barcode"></svg>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
      <script>
        JsBarcode("#barcode","${v.barcode}",{format:"CODE128",width:2,height:50,displayValue:true});
      <\/script>
    `);
  });
}

loadVouchers();
