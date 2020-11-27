const recipe = document.querySelector(".content-recipe1")


const ingredientsElement = document.querySelector("div.ingredients")
const ingredientsButton = document.querySelector("span#ingredients")

const preparationElement = document.querySelector("div.preparation")
const preparationButton = document.querySelector("span#preparation")

const informationElement = document.querySelector("div.information")
const informationButton = document.querySelector("span#information")


// for(let i = 0; i < cards.length; i++){
//   cards[i].addEventListener("click", function(){
//     window.location.href = `/recipes/` + recipe[i].dataset.id
//     console.log(recipe[i].dataset.id)
//   })
// }

if(recipe){

  ingredientsButton.addEventListener("click", () => changeStatus(ingredientsElement, ingredientsButton))

  preparationButton.addEventListener("click", () => changeStatus(preparationElement, preparationButton))
  
  informationButton.addEventListener("click", () => changeStatus(informationElement, informationButton))
  
  function changeStatus(element, button) {
    if(button.textContent === "ESCONDER"){
      button.textContent = "MOSTRAR"
      element.classList.add("invisible")
    } else {
      button.textContent = "ESCONDER"
      element.classList.remove("invisible")
    }
  }
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll(".menu a")

for(item of menuItems) {

  //! Corrigir a classe active quando está com o detalhe da receita aberto
  //
  if(currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")

  }
}



/** arquivo admin */

const PhotosUpload = {
  input: "",
  uploadLimit: 5,
  preview: document.querySelector('#photos-preview'),
  files: [],
  // 1º passo
  // Fazer a leitura dos arquivos enviados pelo input
  // Conferir a quantidade enviada com o limite informado
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimit(event)) return

    // 2º passo
    // Transforma a lista em um array
    // Faz a leitura de cada item do array executando uma funcao
    Array.from(fileList).forEach(file => {
      
      PhotosUpload.files.push(file)

      // Constructor do JS que permite ler arquivos
      const reader = new FileReader()

      reader.onload = () => {
        // Constructor que criar a tag <img>
        const image = new Image()
        image.src = String(reader.result)

        // Criar elemento icon
        const icon = document.createElement('i')
        icon.classList.add('material-icons')
        icon.textContent = 'delete'

        const div = PhotosUpload.getContainer(image, icon)

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo")
        photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos")
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files

  },
  getContainer(image, icon) {
    // Criar elemento div
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image)
    div.appendChild(icon)

    return div
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  }
}

const ImageGallery = {
  imagecontainer: document.querySelector('.container_image > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

    target.classList.add('active')

    ImageGallery.imagecontainer.src = target.src
  },

}