export function modalText(text){
    let tmp = document.querySelector('.bonus__modal')
    tmp.innerHTML=text
        tmp.style.opacity=1
        setTimeout(()=>{
            tmp.style.opacity=0
        },1200)
}