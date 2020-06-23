const cards = document.querySelectorAll(".card")
const modalElement = document.querySelector(".modal-overlay")

// for(let card of cards) {
//   card.addEventListener("click", function(){
//     // window.location.href = `/detalhe-receita/${cards}`
//     console.log(card.childElementCount)
//   })
// }

for(let i = 0; i < cards.length; i++){
  cards[i].addEventListener("click", function(){
    window.location.href = `/detalhe-receita/${i}`
  })
}