
const input = document.getElementById("input")
const resultInput = document.getElementById("result")

function calculate() {
    resultInput.value = "ERROR"
    resultInput.classList.add("error")
    const result = eval(input.value)
    resultInput.value = result
    resultInput.classList.remove("error")
  
    const button = document.getElementById("copyToClipboard")
  
    button.innerText = "Copy"
    button.classList.remove("success")
  }

export { calculate }