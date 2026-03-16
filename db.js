const db={};

let database;
const request=indexedDB.open("FuelWallet",1);

request.onupgradeneeded=e=>{
  database=e.target.result;
  database.createObjectStore("vouchers",{keyPath:"id"});
};

request.onsuccess=e=>{
  database=e.target.result;
};

db.save=voucher=>{
  return new Promise(resolve=>{
    const tx=database.transaction("vouchers","readwrite");
    tx.objectStore("vouchers").put(voucher);
    tx.oncomplete=()=>resolve();
  });
};

db.getAll=()=>{
  return new Promise(resolve=>{
    const tx=database.transaction("vouchers","readonly");
    const req=tx.objectStore("vouchers").getAll();
    req.onsuccess=()=>resolve(req.result);
  });
};

db.delete=id=>{
  return new Promise(resolve=>{
    const tx=database.transaction("vouchers","readwrite");
    tx.objectStore("vouchers").delete(id);
    tx.oncomplete=()=>resolve();
  });
};
