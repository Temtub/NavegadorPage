import { Imagen } from "../js/Imagen.js"

let historial = JSON.parse(localStorage.getItem("historial")) || []
const historialSize = 5
let historialList

let button = document.getElementById("button")
let image = document.getElementById("image")
let quote = document.getElementById("quote")
let form = document.getElementById("form")
let formText = document.getElementById("formText")
let imageCollector = document.getElementById("imageCollector")
let quoteImg = document.getElementById("quoteImg")

let imageSrc = ""
let quoteText = ""
let quoteColor = ""

let arrayImages = []

async function cargarCuota() {
    const quoteResponse = await fetch('https://api.quotable.io/random')
    const quoteData = await quoteResponse.json()
    quoteText = `${quoteData.content} - ${quoteData.author}`
}

async function cargarImagenes() {
    if (arrayImages.length > 1) {
        return
    }

    const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=landscape&per_page=800`, {
        headers: {
            "Authorization": 'Mf17YqB37QBAIr12LlJltaAKcaXxVCH1x8zaAFevFfWPhBokqtcRWYxw',
        }
    })

    const pexelsData = await pexelsResponse.json()

    pexelsData.photos.forEach(photo => {
        let img = new Imagen(photo.id, photo.src.landscape, photo.avg_color)
        arrayImages.push(img)
    })
}

async function cargarColor() {
    const contrastColor = calculateContrastColor(quoteColor)
    quote.style = `color: rgb(${contrastColor})`
}

const cargarImagenAleatoria = () => {
    let arrayImagesSize = arrayImages.length
    let randomImageChooser = Math.floor(Math.random() * arrayImagesSize)
    imageSrc = arrayImages[randomImageChooser].getSrc()
    quoteColor = arrayImages[randomImageChooser].getAvg_color()
}

const cargarInformacion = () => {
    cargarImagenAleatoria()
    cargarGaleria()
    quoteImg.style.setProperty('--background-image', `url(${imageSrc})`)
    image.style = `background-image: url(${imageSrc})`
    quote.textContent = quoteText
    imageCollector.style.setProperty('--border-color', `${quoteColor}`)
    quoteImg.style = `background-image: url(${imageSrc})`
    actualizarHistorialUI()
}

async function cargarDatos() {
    await cargarCuota()
    await cargarImagenes()
    await cargarColor()
    cargarInformacion()
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '')
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}

function calculateContrastColor(hexColor) {
    const rgbColor = hexToRgb(hexColor)
    const contrastColor = rgbColor.map(channel => 255 - channel)
    return contrastColor
}

const hacerBusqueda = (event) => {
    event.preventDefault()
    const searchText = formText.value
    if (searchText.trim() !== "") {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`
        window.location.href = searchUrl
    }
}

const cargarGaleria = () => {
    imageCollector.textContent = ""
    let fragment = document.createDocumentFragment()
    arrayImages.forEach(img => {
        let imag = document.createElement("img")
        imag.setAttribute("src", img.getSrc())
        imag.classList.add("imageCollector__img")
        fragment.append(imag)
    })
    imageCollector.append(fragment)
}

const cambiarFondo = (event) => {
    if (event.target.nodeName == "IMG") {
        imageSrc = event.target.src
        quoteImg.style = `background-image: url(${imageSrc})`
		image.style = `background-image: url(${imageSrc})` 		
    }
}

const guardarHistorialEnLocalStorage = () => {
    localStorage.setItem("historial", JSON.stringify(historial))
}

const actualizarHistorialUI = () => {
    while (historialList.firstChild) {
        historialList.removeChild(historialList.firstChild)
    }
    historial.forEach((entry, index) => {
        const listItem = document.createElement("li")
        listItem.textContent = `${index + 1}. ${entry.quote}`
        listItem.addEventListener("click", () => cargarDesdeHistorial(index))
        historialList.appendChild(listItem)
    })
}

const cargarDesdeHistorial = (index) => {
    const entry = historial[index]
    quote.textContent = entry.quote
    quoteImg.style.setProperty('--background-image', `url(${entry.image})`)
}

document.addEventListener("DOMContentLoaded", async () => {
    historialList = document.getElementById("historialList")
    actualizarHistorialUI()
    cargarDatos()
})

button.addEventListener("click", async () => {
    cargarDatos()
})

form.addEventListener("submit", hacerBusqueda)

imageCollector.addEventListener("click", cambiarFondo)
