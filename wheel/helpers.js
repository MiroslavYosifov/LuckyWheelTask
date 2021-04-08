export function getElementPosition(el) {
    const top = window.scrollY + el.getBoundingClientRect().top // Y
    const bottom = (top + el.offsetHeight);

    const left = window.scrollX + el.getBoundingClientRect().left // X
    const right = (left + el.offsetWidth);
    
    const centerY = (top + el.offsetHeight / 2);
    const centerX = (left + el.offsetWidth / 2);

    return { 
        top,
        bottom,
        left,
        right,
        centerY,
        centerX,
    };
}

export async function isSetTimeoutExpire(time) {
    return new Promise((res, rej) => {

        if(typeof time != 'number') rej('Input data is not a number');
        
        setTimeout(function(){
            res(true);
        }, time);
    });
}

export function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function generateWinningSectorDegree(winningSector, countOfSectors) {
    let degree = (360 - (Math.round(winningSector * (360 / 16) - (360 / 16))));
    if(degree === 360) degree = 0;

    return degree;
}

export function generateRandomNonRepeatingNumbers(countOfNumbers, array) {

    let randoms = JSON.parse(JSON.stringify(array));
    let generatedRandomNumbers = [];
    let counter = 0;

    while(counter < countOfNumbers) {
        counter++;
        let randomIndex = Math.floor(Math.random() * randoms.length);
        let randomNumber = randoms[randomIndex];
        randoms.splice(randomIndex, 1);
        generatedRandomNumbers.push(randomNumber);
    }

    return generatedRandomNumbers;
}

export function generateRandomNonReapetingTurns (turnsCount, reservedSectors) {

    const dataTurns = [];
    const currentReservedSectors = [];

    while(dataTurns.length < turnsCount) {

        let randomTurn = getRandomArbitrary(1, 10);

        if(!dataTurns.includes(randomTurn) && !reservedSectors.includes(randomTurn) && !currentReservedSectors.includes(randomTurn)) {
            dataTurns.push(randomTurn);
            currentReservedSectors.push(randomTurn)
            currentReservedSectors.push(randomTurn + 1);
            currentReservedSectors.push(randomTurn - 1);
        }
    }

    return dataTurns;
}