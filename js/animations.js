let edit = document.getElementById("edit")
let opener = document.getElementById("opener")

edit.addEventListener("click", ()=>{

    opener.classList.remove("dNone")

    if(opener.classList.contains("unshowLateral") ){
        
        opener.classList.remove("unshowLateral")
        opener.classList.add("showLateral")

        edit.classList.remove("unmoveEdit")
        edit.classList.add("moveEdit")
    }
    else{
        opener.classList.remove("showLateral")
        opener.classList.add("unshowLateral")

        edit.classList.remove("moveEdit")
        edit.classList.add("unmoveEdit")
    }
})

