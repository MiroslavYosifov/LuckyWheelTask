import { render } from './render.js';
import { isSetTimeoutExpire, generateRandomNonReapetingTurns, generateRandomNonRepeatingNumbers, calculateWinningSectorDegree } from './helpers.js';
import { data } from './data.js';

export const wheelControllers = (function () {

    const wheel = document.querySelector('.wheel');
    const spinningTime = 3000;
    const sectorsCount = data.length;

    let rotateDegree = 0;
    let allSpinningCount = 0;

    async function startBaseSpinning() {
        
        allSpinningCount++;

        return new Promise(async (response, reject) => {

            const section = render.specialSectorsListContainer(allSpinningCount);

            const winningSector = generateRandomSector(data);

            try {
                const isWinningSector = await spinningWheel(winningSector.degree);

                render.updateTableSectorsStatisticks(winningSector.sector);
                section.append(render.specialSector(winningSector));

                response(isWinningSector);
            } 
            catch (error) {
                reject(error);
            }
        
        })
    }

    function startSpecialSpining (turnsCount) {

        allSpinningCount++;

        return new Promise((response, reject) => {
            let turn = 1;
        
            const section = render.specialSectorsListContainer(allSpinningCount);

            const specialSectors = generateSpecialSectors();
            const { firstSpecialSector, secondSpecialSector } = { ...specialSectors };

            let availableSectorsData = data.filter(x => x != firstSpecialSector.sector && x != secondSpecialSector.sector);

            (async function spinning() {

                if(turn > turnsCount) {
                    response(true);
                    return;
                }

                const randomGeneratedSector = generateRandomSector(availableSectorsData);
                availableSectorsData = availableSectorsData.filter(x => x != randomGeneratedSector.sector); 

                const winningSector = getWinningSector(turn, randomGeneratedSector, firstSpecialSector, secondSpecialSector);

                try {
                    await spinningWheel(winningSector.degree);

                    render.updateTableSectorsStatisticks(winningSector.sector);
                    section.append(render.specialSector(winningSector));

                    setTimeout(spinning, 1000);
                    turn++;
                } 
                catch (error) {
                    reject(error)
                }
            })(); 
        })
    }

    // MAIN SPINNING

    async function spinningWheel(winningSectorDegree) {

        return new Promise(async (resposne, reject) => {

            let isTimeOver = false;
            let isFinalSpinning = false;

            let setSpinningInterval = setInterval(async function() {

                if(isTimeOver && isFinalSpinning && rotateDegree === winningSectorDegree) {
                    clearInterval(setSpinningInterval);
                    resposne(true);
                }      

                rotateDegree = spinningWheelAnimation(rotateDegree, wheel);
                if(isTimeOver && rotateDegree === 0) isFinalSpinning = true;

            }, 1);

            try {
                isTimeOver = await isSetTimeoutExpire(spinningTime);
            } 
            catch (error) {
                console.log(error);
            }
        });
    }

    function spinningWheelAnimation (rotateDegree, wheel) {

        wheel.style.transform = `translate(-50%, -50%) rotate(${rotateDegree}deg)`;
        rotateDegree += 1;

        if(rotateDegree === 360) rotateDegree = 0;

        return rotateDegree;
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

    function generateRandomSector(sectorsData) {

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

    function generateSpecialSectors() {

        const [firstRandomSector, secondRandomSector] = generateRandomNonRepeatingNumbers(2, data);

        const randomIndexFirstNumber = generateRandomNonReapetingTurns(2, []);
        const randomIndexSecondNumber = generateRandomNonReapetingTurns(3, randomIndexFirstNumber);
        
        const firstSpecialSector = { 
            sector: firstRandomSector, 
            degree: calculateWinningSectorDegree(firstRandomSector, sectorsCount), 
            turns: randomIndexFirstNumber ,
            index: 1,
            name: "First Special Sector",
        };

        const secondSpecialSector = { 
            sector: secondRandomSector, 
            degree: calculateWinningSectorDegree(secondRandomSector, sectorsCount), 
            turns: randomIndexSecondNumber ,
            index: 2,
            name: "Second Special Sector",
        };

        return {
            firstSpecialSector,
            secondSpecialSector
        }
    }
    
    return {
        startBaseSpinning,
        startSpecialSpining,
    }

})();

