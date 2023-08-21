setTimeout(()=>{
    if(db)
    {
        let allMediaCount=0;
        let emptyMsg=document.querySelector(".emptymsg");
        let dbVideoTransaction=db.transaction("Videos","readonly");
        let videoStore=dbVideoTransaction.objectStore("Videos");
        let videosRequest=videoStore.getAll();
        videosRequest.onsuccess = (e) => {
            let allVideos=videosRequest.result;
            allMediaCount+=allVideos.length;
            let galleryCont=document.querySelector(".gallery-cont");
            allVideos.forEach((video)=>{
                let mediaCont=document.createElement("div");
                mediaCont.setAttribute("class","media-cont");
                mediaCont.setAttribute("id",video.id);
                let url=URL.createObjectURL(video.clip);
                mediaCont.innerHTML=`
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="actions">
                <div class="download action">
                <span class="material-icons downloadbtn">download</span>
                </div>
                <div class="delete action">
                <span class="material-icons deletebtn">delete</span>
                </div>
                </div>`;
                galleryCont.appendChild(mediaCont);
                let downloadBtn=mediaCont.querySelector(".downloadbtn");
                let deleteBtn=mediaCont.querySelector(".deletebtn");
                downloadBtn.addEventListener("click",downloadMedia);
                deleteBtn.addEventListener("click",deleteMedia);          


            })
        
        }
 
        let dbImageTransaction=db.transaction("Images","readonly");
        let imageStore=dbImageTransaction.objectStore("Images");
        let imagesRequest=imageStore.getAll();
        imagesRequest.onsuccess = (e) => {
            let allImages=imagesRequest.result;
            allMediaCount+=allImages.length;
            let galleryCont=document.querySelector(".gallery-cont");
            allImages.forEach((image)=>{
                let mediaCont=document.createElement("div");
                mediaCont.setAttribute("class","media-cont");
                mediaCont.setAttribute("id",image.id);
                let url=image.url;
                mediaCont.innerHTML=`
                <div class="media">
                    <img src=${url}></img>
                </div>
                <div class="actions">
                <div class="download action">
                <span class="material-icons downloadbtn">download</span>
                </div>
                <div class="delete action">
                <span class="material-icons deletebtn">delete</span>
                </div>
                </div>`;
                galleryCont.appendChild(mediaCont);
                let downloadBtn=mediaCont.querySelector(".downloadbtn");
                let deleteBtn=mediaCont.querySelector(".deletebtn");
                downloadBtn.addEventListener("click",downloadMedia);
                deleteBtn.addEventListener("click",deleteMedia);

            })
        if(allMediaCount > 0)
        {
            emptyMsg.style.visibility="hidden";
        }
        else
        {
            emptyMsg.style.visibility="visible";
        }
        }
        }
},100)



function downloadMedia(e) {
    let id=e.target.parentElement.parentElement.parentElement.getAttribute("id");
    if(id.slice(0,3) === "vid")
    {
        let dbVideoTransaction=db.transaction("Videos","readonly");
        let videoStore=dbVideoTransaction.objectStore("Videos");
        let videoRequest=videoStore.get(id);
        videoRequest.onsuccess= (e)=>{
        let video=videoRequest.result;
        let videoURL=URL.createObjectURL(video.clip);
        let a=document.createElement("a");
        a.href=videoURL;
        a.download="Ur-Clip.mp4";
        a.click();
        }

    }
    else
    {
        let dbImageTransaction=db.transaction("Images","readonly");
        let imageStore=dbImageTransaction.objectStore("Images");
        let imageRequest=imageStore.get(id);
        imageRequest.onsuccess= (e)=>{
        let image=imageRequest.result;
        let imageURL=image.url;
        let a=document.createElement("a");
        a.href=imageURL;
        a.download="Image.jpg";
        a.click();
        }
    }

}
function deleteMedia(e) {
    // Removing in database
    let id=e.target.parentElement.parentElement.parentElement.getAttribute("id");
    if(id.slice(0,3) === "vid")
    {
        let dbVideoTransaction=db.transaction("Videos","readwrite");
        let videoStore=dbVideoTransaction.objectStore("Videos");
        videoStore.delete(id);
    }
    else
    {
        let dbImageTransaction=db.transaction("Images","readwrite");
        let imageStore=dbImageTransaction.objectStore("Images");
        imageStore.delete(id);
    }
    //Removing from UI
    e.target.parentElement.parentElement.parentElement.remove();
    let allMedia=document.querySelectorAll(".media-cont");
    let emptyMsg=document.querySelector(".emptymsg");
    if(allMedia.length === 0)
    {
        emptyMsg.style.visibility="visible";
    }
         
}
function updateMediaCount() {
    let galleryCont = document.querySelector(".gallery-cont");
    let allMedia = galleryCont.querySelectorAll(".media-cont");
    let count = document.querySelector(".count");
    count.innerText = allMedia.length;
    console.log("Updated Count");
}