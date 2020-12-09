const recipe = document.querySelector("#recipe")

const ingredientsElement = document.querySelector("#ingredients")
const ingredientsButton = document.querySelector("#button-ingredients")

const preparationElement = document.querySelector("#preparation")
const preparationButton = document.querySelector("#button-preparation")

const informationElement = document.querySelector("#information")
const informationButton = document.querySelector("#button-information")

if(recipe){

  ingredientsButton.addEventListener("click", () => changeStatus(ingredientsElement, ingredientsButton))

  preparationButton.addEventListener("click", () => changeStatus(preparationElement, preparationButton))
  
  informationButton.addEventListener("click", () => changeStatus(informationElement, informationButton))
  
  function changeStatus(element, button) {
    if(button.textContent === "esconder"){
      button.textContent = "mostrar"
      element.classList.add("invisible")
    } else {
      button.textContent = "esconder"
      element.classList.remove("invisible")
    }
  }
}

// set bold to selected item 
const currentPage = location.pathname
const navItems = document.querySelectorAll("#navigation a")

for(item of navItems) {

  if(currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")

    break
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

    // console.log(PhotosUpload.input.files)
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
    div.classList.add('new-file')

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image)
    div.appendChild(icon)

    return div
  },
  removePhoto(event) {

    const photoDiv = event.target.parentNode
      // console.log(photoDiv)
      // return true


    const photosArray = Array.from(PhotosUpload.preview.querySelectorAll('.new-file'))
      // console.log(photosArray)
      // return true


    const index = photosArray.indexOf(photoDiv)
      // console.log(index)
      // return true    

    console.log(PhotosUpload.files)
    

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
  imagecontainer: document.querySelector('.main-image > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

    target.classList.add('active')

    ImageGallery.imagecontainer.src = target.src
  },

}



function addIngredient(event) {
  const container = event.target.parentNode.querySelector("#ingredients")
  const fields = event.target.parentNode.querySelectorAll("#ingredient");
  const newField = fields[fields.length - 1].cloneNode(true);
  
  if (newField.value == "") return false

  newField.value = ""

  console.log(container)

  container.appendChild(newField);

  return true
  
}

function addPreparation(event) {
  const container = event.target.parentNode.querySelector("#preparations")
  const fields = event.target.parentNode.querySelectorAll("#preparation");
  const newField = fields[fields.length - 1].cloneNode(true);
  
  if (newField.value == "") return false

  newField.value = ""

  console.log(container)

  container.appendChild(newField);

  return true
  
}