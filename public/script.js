const cards = document.querySelectorAll(".card")
// const buttonsOnOff = document.querySelectorAll("span")
const ingredientsElement = document.querySelector("div.ingredients")
const ingredientsButton = document.querySelector("span#ingredients")

const preparationElement = document.querySelector("div.preparation")
const preparationButton = document.querySelector("span#preparation")

const informationElement = document.querySelector("div.information")
const informationButton = document.querySelector("span#information")


for(let i = 0; i < cards.length; i++){
  cards[i].addEventListener("click", function(){
    window.location.href = `/detalhe-receita/${i}`
  })
}

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
