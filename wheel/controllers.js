import { render } from './render.js';
import { isSetTimeoutExpire, generateRandomNonReapetingTurns, generateRandomNonRepeatingNumbers, calculateWinningSectorDegree } from './helpers.js';
import { data } from './data.js';

export const wheelControllers = (function () {

    const sectorsCount = data.length;
    let allSpinningCount = 0;
    let startDegree = 0;
    
    async function startBaseSpinning() {
        
        allSpinningCount++;

        return new Promise(async (response, reject) => {

            const section = render.specialSectorsListContainer(allSpinningCount);
            const winningSector = generateRandomSector(data, sectorsCount);

            try {
                
                startDegree = await spinningWheel(winningSector.degree, startDegree);
                
                render.updateTableSectorsStatisticks(winningSector.sector);
                section.append(render.specialSector(winningSector));

                response(true);
            } 
            catch (error) {
                reject(error);
            }
        })
    }

    function startSpecialSpining (turnsCount) {
        
        let turn = 1;
        allSpinningCount++;

        return new Promise((response, reject) => {
            
            const section = render.specialSectorsListContainer(allSpinningCount);
            const specialSectors = generateSpecialSectors(data);
            const { firstSpecialSector, secondSpecialSector } = { ...specialSectors };

            let availableSectorsData = data.filter(x => x != firstSpecialSector.sector && x != secondSpecialSector.sector);

            (async function repeatTurn() {

                if(turn > turnsCount) {
                    response(true);
                    return;
                }

                const randomGeneratedSector = generateRandomSector(availableSectorsData, sectorsCount);
                availableSectorsData = availableSectorsData.filter(x => x != randomGeneratedSector.sector); 

                const winningSector = getWinningSector(turn, randomGeneratedSector, firstSpecialSector, secondSpecialSector);

                try {

                    startDegree = await spinningWheel(winningSector.degree, startDegree);

                    render.updateTableSectorsStatisticks(winningSector.sector);
                    section.append(render.specialSector(winningSector));

                    setTimeout(repeatTurn, 1000);
                    turn++;
                } 
                catch (error) {
                    reject(error)
                }
            })(); 
        })
    }

    return {
        startBaseSpinning,
        startSpecialSpining,
    }

})();

async function spinningWheel(winningSectorDegree, startDegree) {

    const wheel = document.querySelector('.wheel');
    const spinningTime = 3000;
    let rotateDegree = startDegree;

    return new Promise(async (resposne, reject) => {

        let isTimeOver = false;
        let isFinalSpinning = false;

        let setSpinningInterval = setInterval(async function() {

            if(rotateDegree === 360) rotateDegree = 0;

            if(isTimeOver && rotateDegree === 0) isFinalSpinning = true;

            if(isTimeOver && isFinalSpinning && rotateDegree === winningSectorDegree) {
                clearInterval(setSpinningInterval);
                resposne(rotateDegree);
            }

            rotateDegree += 1;
            wheel.style.transform = `translate(-50%, -50%) rotate(${rotateDegree}deg)`;

        }, 1);

        try {
            isTimeOver = await isSetTimeoutExpire(spinningTime);
        } 
        catch (error) {
            console.log(error);
        }
    });
}

function getWinningSector(turn, randomGeneratedSector, firstSpecialSector, secondSpecialSector) {

    const isMatchingFirstSector = firstSpecialSector.turns.includes(turn);
    const isMathcingSecondSector = secondSpecialSector.turns.includes(turn);
    const isMathcingNonSpecialSector = !secondSpecialSector.turns.includes(turn) && !firstSpecialSector.turns.includes(turn);
    
    switch (true) {
        case isMatchingFirstSector:
            return firstSpecialSector;
        case isMathcingSecondSector:
            return secondSpecialSector;
        case isMathcingNonSpecialSector:
            return randomGeneratedSector;
        default:
            return false;
    }
}

function generateRandomSector(sectorsData, sectorsCount) {

    const [ randomSector ] = generateRandomNonRepeatingNumbers(1, sectorsData);
    const nonSpecialSectorDegree = calculateWinningSectorDegree(randomSector, sectorsCount);

    const randomGeneratedSector = { 
        sector: randomSector, 
        degree: nonSpecialSectorDegree, 
        index: 3, 
        name: "None"
    };

    return randomGeneratedSector;
}

function generateSpecialSectors(data) {

    const [firstRandomSector, secondRandomSector] = generateRandomNonRepeatingNumbers(2, data);

    const randomTurnsFirstNumber = generateRandomNonReapetingTurns(2, []);
    const randomTurnsSecondNumber = generateRandomNonReapetingTurns(3, randomTurnsFirstNumber);
    
    const firstSpecialSector = { 
        sector: firstRandomSector, 
        degree: calculateWinningSectorDegree(firstRandomSector, data.length), 
        turns: randomTurnsFirstNumber ,
        index: 1,
        name: "First Special Sector",
    };

    const secondSpecialSector = { 
        sector: secondRandomSector, 
        degree: calculateWinningSectorDegree(secondRandomSector, data.length), 
        turns: randomTurnsSecondNumber ,
        index: 2,
        name: "Second Special Sector",
    };

    return {
        firstSpecialSector,
        secondSpecialSector
    }
}

