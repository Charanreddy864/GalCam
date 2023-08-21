let db;
let openRequest=indexedDB.open("My-Gallery");
openRequest.addEventListener("success", (e) => {
    db = openRequest.result;
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    db=openRequest.result;  
    //Creating object stores
    db.createObjectStore("Images",{keyPath: "id"});
    db.createObjectStore("Videos",{keyPath: "id"});

})