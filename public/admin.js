const cards = document.querySelectorAll(".card.admin a")


for(let i = 0; i < cards.length; i++){
  cards[i].addEventListener("click", function(){
    window.location.href = `/admin/recipes/${i}`
  })
}