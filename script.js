console.log("js begins")
let currentSong = new Audio();
let songs;
let currFolder;

// time function for songs on playbar
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for(let index = 0; index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]) 
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=" "
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20" , " ")}</div>
                            <div>Abhi</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="ply.svg" alt="">
                        </div> </li>`;
    }
    //attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    
} 

const playMusic = (track, pause = false)=>{
// let audio = new Audio("/songs/"+track)
currentSong.src = `/${currFolder}/`+track
if(!pause){
    currentSong.play()
    play.src="pause.svg"
}
document.querySelector(".songinfo").innerHTML = decodeURI(track)
document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){
// get the list of all songs
     await getsongs("songs/ncs")
    playMusic(songs[0],true)
// show all the song in playlist    
    
    //attach an event listner to play next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })
    //add event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    //add event listner to privious and next button
    previous.addEventListener("click",()=>{
        console.log("pre clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })
    next.addEventListener("click",()=>{
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)>length){
            playMusic(songs[index+1])
        }
    })
    // load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
    document.addEventListener('DOMContentLoaded', (event) => {
        const searchImage = document.getElementById('srh');
        searchImage.addEventListener('click', () => {
            alert('Image clicked!');
            console.log("aa")
        });
    });

}
main()