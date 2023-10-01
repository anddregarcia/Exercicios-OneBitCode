import { calculate } from "./calculate.js"
import { switcher } from "./switcher.js"
import { copyToClipboard, keyTratment, clear} from "./events.js"

document.querySelectorAll(".charKey").forEach(function (charKeyBtn) {
  charKeyBtn.addEventListener("click", function () {
    const value = charKeyBtn.dataset.value
    input.value += value
  })
})

document.getElementById("clear").addEventListener("click", clear)
document.getElementById("input").addEventListener("keydown", keyTratment)
document.getElementById("equal").addEventListener("click", calculate)
document.getElementById("copyToClipboard").addEventListener("click", copyToClipboard)
document.getElementById("themeSwitcher").addEventListener("click", switcher)