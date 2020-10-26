const cards = document.querySelectorAll(".card.admin a")


for(let i = 0; i < cards.length; i++){
  cards[i].addEventListener("click", function(){
    window.location.href = `/admin/recipes/${i}`
  })
}


function addIngredient() {
  const ingredients = document.querySelector(".ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false

  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

function addPasso() {
  const passos = document.querySelector(".passos");
  const fieldContainer = document.querySelectorAll(".passo");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false

  newField.children[0].value = "";
  passos.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);

document
  .querySelector(".add-passo")
  .addEventListener("click", addPasso);



const PhotosUpload = {
  uploadLimit: 5,
  
  // 1º passo
  // Fazer a leitura dos arquivos enviados pelo input
  // Conferir a quantidade enviada com o limite informado
  handleFileInput(event) {
    const { files: fileList } = event.target
    const { uploadLimit } = PhotosUpload

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return
    }

    // 2º passo
    // Transforma a lista em um array
    // Faz a leitura de cada item do array executando uma funcao
    Array.from(fileList).forEach(file => {
      
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

        // Criar elemento div
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = () => alert('remover photo')

        div.appendChild(image)
        div.appendChild(icon)

        document.querySelector('#photos-preview').appendChild(div)
      }

      reader.readAsDataURL(file)
    })
  }
}