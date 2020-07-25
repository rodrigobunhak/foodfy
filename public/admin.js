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