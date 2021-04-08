import { data } from './data.js';

export const render = (function () {

    const wheel = document.querySelector('.wheel');
    const statistics = document.getElementById('ctx-statistic');
    const sectorsStatistics = document.getElementById('ctx-sectors-stats');

    function renderWheel (data) {
        const sectorsCount = data.length;

        const wheelPerimeterInPixels = Math.ceil(Number(wheel.offsetWidth) * 3.142);
        const sliceWidthInPixels = Math.ceil(wheelPerimeterInPixels / sectorsCount);
        const sliceWidthInPercents = Math.ceil((sliceWidthInPixels / Number(wheel.offsetWidth)) * 100);
        const rotateDeg = 360 / sectorsCount;
    
        for (let index = 0; index < sectorsCount; index++) {

            let div = document.createElement('div');
            div.classList.add(`wheel__slice`, `wheel__slice--${index + 1}`)
            div.style.width = `${sliceWidthInPercents}%`;
            div.style.transform = `translateX(-50%) rotate(${rotateDeg * index}deg)`;

            let span = document.createElement('span');
            span.textContent = `${index + 1}`;
            span.classList.add(`wheel__slice--points`);

            div.append(span);
            wheel.append(div);
        }
    }

    function tableSectorsStatisticks () {
 
        for (let index = 0; index <= data.length; index++) {

            const section = document.createElement('section');
            section.style.display = "flex";

            const pSector = document.createElement('p');
            pSector.textContent = index;

            const pCount = document.createElement('p');
            pCount.textContent = 0;

            if(index === 0) {
                pSector.textContent = "SECTORS";
                pCount.textContent = "COUNT";
            }
            
            section.append(pSector);
            section.append(pCount);
            sectorsStatistics.append(section);
        }
    }

    function updateTableSectorsStatisticks(sector) {
        const currentResult = sectorsStatistics.childNodes[sector + 1].childNodes[1].textContent;
        sectorsStatistics.childNodes[sector + 1].childNodes[1].textContent = Number(currentResult) + 1;
    }

    function addWheelStatisticks (sector) {
        const p = document.createElement('p');
        p.textContent = sector
        p.style.padding = "0.2rem 1rem";
        p.style.background = "rgb(100, 100, 100)";
        statistics.append(p);
    }

    function specialSectorsListContainer(spinningCount) {

        const section = document.createElement('section');

        section.style.display = "flex";
        section.style.alignItems = "center";
        section.style.padding = "0.6rem 0";

        const p = document.createElement('p');
        p.style.fontSize = "16px";
        p.textContent = `${spinningCount}:`;
        resultSectorsStyles(p);
        section.append(p)
        statistics.append(section);

        return section;
    }

    function specialSector (winningSectorInfo) {
        
        const p = document.createElement('p');
        p.style.fontSize = "16px";
        p.textContent = `${winningSectorInfo.sector}`;
        resultSectorsStyles(p);
       
        switch (winningSectorInfo.index) {
            case 1:
                p.style.background = "chocolate";
                break;
            case 2:
                p.style.background = "green";
                break;
            case 3:
                p.style.background = "gray";
                break;
            default:
                return false;
        }
        return p;
    }

    function resultSectorsStyles(p) {
        p.style.display = "flex";
        p.style.alignItems = "center";
        p.style.justifyContent = "center";
        p.style.height = "3rem";
        p.style.width = "3rem";
        p.style.borderRadius = "4px";
        p.style.marginLeft = "4px";
    }

    return {
        renderWheel,
        addWheelStatisticks,
        specialSectorsListContainer,
        specialSector,
        tableSectorsStatisticks,
        updateTableSectorsStatisticks
    }
})();



