let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-cont");
let captureBtnCont=document.querySelector(".capture-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let captureBtn=document.querySelector(".capture-btn");
let isRecording=false;


let constraints={
    video:true,
    audio:true
}
let recorder;
let chunks=[]; //To store chunks of video clips
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>
    {
        let blob=new Blob(chunks,{type:"video/mp4"});
        //Adding to Database
        if(db)
        {
            let videoID=shortid();
            let dbTransaction=db.transaction("Videos","readwrite");
            let videoStore=dbTransaction.objectStore("Videos");
            let video={
                id: `vid-${videoID}`,
                clip: blob
            }
            videoStore.add(video);
        }
        // let videoURL=window.URL.createObjectURL(blob);
        // let a=document.createElement("a");
        // a.href=videoURL;
        // a.download="Ur-Clip.mp4";
        // a.click();
    })
})
recordBtnCont.addEventListener("click",(e)=>
{
    if(!recorder) return;
    isRecording=!isRecording;
    if(isRecording)
    {
        recordBtn.classList.add("scale-record");
        recorder.start();
        startTimer();
    }
    else
    {
        recordBtn.classList.remove("scale-record");
        recorder.stop();
        stopTimer();
    }
})
captureBtnCont.addEventListener("click",(e)=>
{
    captureBtn.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    tool.fillStyle=filterColor;
    tool.fillRect(0,0,canvas.width,canvas.height);
    let imageURL=canvas.toDataURL();
    if(db)
        {
            let imageID=shortid();
            let dbTransaction=db.transaction("Images","readwrite");
            let imageStore=dbTransaction.objectStore("Images");
            let image={
                id: `img-${imageID}`,
                url: imageURL
            }
            imageStore.add(image);
        }
    // let a=document.createElement("a");
    // a.href=imageURL;
    // a.download="Image.jpg";
    // a.click();
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 1000);
})
let timerCont=document.querySelector(".timer-cont");
let timer=document.querySelector(".timer");
let timerID;
let counter=1;
function startTimer(){
    timerCont.classList.add("pop");
    function displayTimer()
    {
        let totalSeconds=counter
        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;
        let minutes=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;
        let seconds=totalSeconds;
        hours=(hours<10) ? `0${hours}` : hours;
        minutes=(minutes<10) ? `0${minutes}` : minutes;
        seconds=(seconds<10) ? `0${seconds}` : seconds;
        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
        
    }
    timerID=setInterval(displayTimer,1000);
    
}
function stopTimer(){
    timerCont.classList.remove("pop");
    clearInterval(timerID);
    timer.innerText="00:00:00";
    counter=1;
}
let filterColor="transparent";
let filterLayer=document.querySelector(".filter-layer")
let allFilters=document.querySelectorAll(".filter");
allFilters.forEach((filterEl)=>{
    filterEl.addEventListener("click",(e)=>{
         filterColor=getComputedStyle(filterEl).getPropertyValue("background-color");
         filterLayer.style.backgroundColor=filterColor;
    })
})