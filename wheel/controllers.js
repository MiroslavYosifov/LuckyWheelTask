import { render } from './render.js';
import { isSetTimeoutExpire, getRandomArbitrary, generateRandomNonReapetingTurns, generateRandomNonRepeatingNumbers, generateWinningSectorDegree } from './helpers.js';
import { data } from './data.js';

export const wheelControllers = (function () {

    const wheel = document.querySelector('.wheel');

    const spinningTime = 3000;
    const sectorsCount = data.length;
    
    let rotateDegree = 0;
    let spinningCount = 0;
    let isTimeOver = false;
    let isFinalSpinning = false;
    
    async function startBaseSpinning() {

        return new Promise(async (response, reject) => {

            isTimeOver = false;
            isFinalSpinning = false;

            const winningSector = getRandomArbitrary(1, sectorsCount);
            let finishDegree = generateWinningSectorDegree(winningSector, sectorsCount);

            let spinning = setInterval(function() {

                if(isTimeOver && isFinalSpinning && finishDegree === rotateDegree) {
                    spinningCount++;
                    render.updateTableSectorsStatisticks(winningSector)
                    render.addWheelStatisticks(`${spinningCount}: ${winningSector}`);

                    clearInterval(spinning);
                    response(true);
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
        })
    }

    function startSpecialSpining (turnsCount) {

        return new Promise((response, reject) => {
            let turn = 1;
            spinningCount++;

            const section = render.specialSectorsListContainer(spinningCount);

            const specialSectors = generateSpecialSectors();
            const { firstSpecialSector, secondSpecialSector } = { ...specialSectors };
            const nonReservedSectorsData = data.filter(x => x != firstSpecialSector.sector && x != secondSpecialSector.sector);

            (async function spinning() {

                if(turn > turnsCount) {
                    response(true);
                    return;
                } 

                const [nonSpecialSector] = generateRandomNonRepeatingNumbers(1, nonReservedSectorsData);
                const nonSpecialSectorDegree = { 
                    index: 3,
                    name: "None",
                    sector: nonSpecialSector, 
                    degree: generateWinningSectorDegree(nonSpecialSector, sectorsCount) 
                };

                isTimeOver = false;
                isFinalSpinning = false;

                let setSpinningInterval = setInterval(function() {

                    if(isTimeOver && isFinalSpinning && getWinningSector(rotateDegree, turn, nonSpecialSectorDegree, firstSpecialSector, secondSpecialSector)) {

                        const winningSector = getWinningSector(rotateDegree, turn, nonSpecialSectorDegree, firstSpecialSector, secondSpecialSector);
                        render.updateTableSectorsStatisticks(winningSector.sector);
                        section.append(render.specialSector(winningSector));

                        turn++;
                        clearInterval(setSpinningInterval);
                        setTimeout(spinning, 1000);
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
            })(); 
        })
    }

    function spinningWheelAnimation (rotateDegree, wheel) {

        wheel.style.transform = `translate(-50%, -50%) rotate(${rotateDegree}deg)`;
        rotateDegree += 1;
        if(rotateDegree === 360) rotateDegree = 0;

        return rotateDegree;
    }

    function getWinningSector(rotateDegree, turn, nonSpecialSectorDegree, firstSpecialSector, secondSpecialSector) {

        const isMatchingFirstSector = rotateDegree === firstSpecialSector.degree && firstSpecialSector.turns.includes(turn);
        const isMathcingSecondSector = rotateDegree === secondSpecialSector.degree && secondSpecialSector.turns.includes(turn);
        const isMathcingNonSpecialSector = rotateDegree === nonSpecialSectorDegree.degree && !secondSpecialSector.turns.includes(turn) && !firstSpecialSector.turns.includes(turn);
        
        switch (true) {
            case isMatchingFirstSector:
                return firstSpecialSector;
            case isMathcingSecondSector:
                return secondSpecialSector;
            case isMathcingNonSpecialSector:
                return nonSpecialSectorDegree;
            default:
                return false;
        }
    }

    function generateSpecialSectors() {

        const [firstRandomSector, secondRandomSector] = generateRandomNonRepeatingNumbers(2, data);

        const randomIndexFirstNumber = generateRandomNonReapetingTurns(2, []);
        const randomIndexSecondNumber = generateRandomNonReapetingTurns(3, randomIndexFirstNumber);
        
        const firstSpecialSector = { 
            index: 1,
            name: "First Special Sector",
            sector: firstRandomSector, 
            degree: generateWinningSectorDegree(firstRandomSector, sectorsCount), 
            turns: randomIndexFirstNumber 
        };

        const secondSpecialSector = { 
            index: 2,
            name: "Second Special Sector",
            sector: secondRandomSector, 
            degree: generateWinningSectorDegree(secondRandomSector, sectorsCount), 
            turns: randomIndexSecondNumber 
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

