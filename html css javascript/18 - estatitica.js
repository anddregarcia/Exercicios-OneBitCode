var media = (...args) => {
    console.log(args);

    return args.reduce( (prev, curr) => {
        return prev + curr 
    }, 0) / args.length
}

console.log(media(10, 20));

var mediaPonderada = (...args) => {
    console.log(args);

    let somaProp = 0
    let somaPeso = 0

    args.forEach((x) => { somaProp += x.n * x.p })

    args.forEach((x) => { somaPeso += x.p })

    return somaProp / somaPeso
}

console.log(mediaPonderada({n:7, p:2}, {n:9, p:5}, {n:3, p:1}));

var mediana = (...args) => {
    console.log(args)

    let qttNumbers = args.length
    let result = 0

    if (qttNumbers % 2 > 0)
    {
        result = args[Math.trunc(qttNumbers / 2)]
    }
    else
    {
        result = media(args[(qttNumbers / 2) -1], args[qttNumbers / 2])
    }
    
    return `mediana: " + ${result}`;
}

console.log(mediana(15, 14, 8, 7, 3));
console.log(mediana(2, 4, 5, 7, 42, 99));

var moda = (...args) => {

}


const average = (...numbers) => {
    const sum = numbers.reduce((accum, num) => accum + num, 0)
    return sum / numbers.length
  }
  
  console.log(`Média Aritmética Simples: ${average(3, 6, 10, 9)}`)

  const weightedAverage = (...entries) => {
    const sum = entries.reduce((accum, { number, weight }) => accum + (number * (weight ?? 1)), 0)
    const weightSum = entries.reduce((accum, entry) => accum + (entry.weight ?? 1), 0)
    return sum / weightSum
  }
  
  console.log(`Média Ponderada: ${weightedAverage(
    { number: 9, weight: 3 },
    { number: 7 },
    { number: 10, weight: 1 },
  )}`)

  const median = (...numbers) => {
    const orderedNumbers = [...numbers].sort((a, b) => a - b)
    const middle = Math.floor(orderedNumbers.length / 2)
    if (orderedNumbers.length % 2 !== 0) {
      return orderedNumbers[middle]
    }
    const firstMedian = orderedNumbers[middle - 1]
    const secondMedian = orderedNumbers[middle]
    return average(firstMedian, secondMedian)
  }
  
  console.log(`Mediana: ${median(2, 5, 99, 4, 42, 7)}`)
  console.log(`Mediana: ${median(15, 14, 8, 7, 3)}`)

  console.log("mode")
  const mode = (...numbers) => {
    // [ [n, qtd], [n, qtd], [n, qtd] ]
    
    console.log(numbers)
    const quantities = numbers.map(num => [
      num,
      numbers.filter(n => num === n).length
    ])
    console.log(quantities)
    quantities.sort((a, b) => b[1] - a[1])
    console.log(quantities)
    return quantities[0][0]
  }
  
  console.log(`Moda: ${mode(1, 1, 99,99,99,99,99,99,99,99, 5, 4, 9, 7, 4, 3, 5, 2, 4, 0, 4)}`)