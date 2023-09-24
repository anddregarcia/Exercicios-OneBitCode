const form = document.getElementById("dev_form")
const addNewTech = document.getElementById("add_technology")

let index = 0

let arrayDev = []
addNewTech.addEventListener("click", 
(e) => {
        
    const techList = document.getElementById("technologies_list")

    const newDiv = document.createElement("div")
    newDiv.id = "div_" + index

    const delLine = document.createElement("input")
    delLine.type = "button"
    delLine.id = "btn_del_" + index
    delLine.value = "-"
    delLine.addEventListener("click", () => {
        newDiv.remove()
    })
    newDiv.appendChild(delLine)

    const newLabel = document.createElement("label")
    newLabel.id = "label_tech_" + index
    newLabel.setAttribute("for", "input_tech_" + index)
    newLabel.innerText = "Tecnologia: "
    newDiv.appendChild(newLabel)
    
    const newInput = document.createElement("input")
    newInput.id = "input_tech_" + index
    newInput.name = "input_tech_" + index
    newDiv.appendChild(newInput)

    const newRadioGroup02 = document.createElement("input")
    newRadioGroup02.id = "radio_xp02" + index
    newRadioGroup02.type = "radio"
    newRadioGroup02.name = "radio_xp" + index
    newRadioGroup02.value = "0-2 anos"
    newRadioGroup02.innerText = "0-2 anos"
    newDiv.appendChild(newRadioGroup02)

    const newLabel02 = document.createElement("label")
    newLabel02.id = "label_xp02_" + index
    newLabel02.setAttribute("for", "radio_xp02" + index)
    newLabel02.innerText = " 0-2"
    newDiv.appendChild(newLabel02)

    const newRadioGroup34 = document.createElement("input")
    newRadioGroup34.id = "radio_xp34" + index    
    newRadioGroup34.type = "radio"
    newRadioGroup34.name = "radio_xp" + index
    newRadioGroup34.value = "3-4 anos"
    newDiv.appendChild(newRadioGroup34)

    const newLabel34 = document.createElement("label")
    newLabel34.id = "label_xp34_" + index
    newLabel34.setAttribute("for", "radio_xp34" + index)
    newLabel34.innerText = " 3-4"
    newDiv.appendChild(newLabel34)

    const newRadioGroup5 = document.createElement("input")
    newRadioGroup5.id = "radio_xp5" + index
    newRadioGroup5.type = "radio"
    newRadioGroup5.name = "radio_xp" + index
    newRadioGroup5.value = "5+ anos"
    newDiv.appendChild(newRadioGroup5)

    const newLabel5 = document.createElement("label")
    newLabel5.id = "label_xp5_" + index
    newLabel5.setAttribute("for", "radio_xp5" + index)
    newLabel5.innerText = " 5+"
    newDiv.appendChild(newLabel5)
    
    techList.appendChild(newDiv)

    index++
})  

form.addEventListener("submit", 
(e) => {
    e.preventDefault()

    const devName = document.getElementById("dev_name").value

    for (let i = 0; i < index; i++) 
    {
        if (document.getElementById("input_tech_" + i))
        {
            const tech = document.getElementById("input_tech_" + i).value
            const exp = document.querySelector("input[name='radio_xp" + i + "']:checked").value
            
            arrayDev.push({
                devName,
                tech,
                exp
            })
         
            const divRow = document.getElementById("div_" + i)
            divRow.remove()
        }
    }
    index = 0
    document.getElementById("dev_name").value = ""

    console.log(arrayDev)
})