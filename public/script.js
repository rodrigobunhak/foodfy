const cards = document.querySelectorAll("section.cards")
const modalElement = document.querySelector(".modal-overlay")

for(let card of cards) {
  card.addEventListener("click", function(){
    modalElement.classList.add("active")
  })
}

const closeButton = document.querySelector(".close-modal")

closeButton.addEventListener("click", function(){
  modalElement.classList.remove("active")
})
