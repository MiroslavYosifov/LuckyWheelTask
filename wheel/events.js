import { wheelControllers } from './controllers.js';

export const wheelEvents = function () {

    function addWheelButtonsEventListeners() {
        document.getElementById('ctx-spin').addEventListener('click', onStartBaseSpinning);
        document.getElementById('ctx-special-spin').addEventListener('click', onSpecialSpinning);
    }
    
    function removeWheelButtonsEventListeners() {
        document.getElementById('ctx-spin').removeEventListener('click', onStartBaseSpinning);
        document.getElementById('ctx-special-spin').removeEventListener('click', onSpecialSpinning);
    }

    addWheelButtonsEventListeners();

    
    async function onStartBaseSpinning(e) {
        
        removeWheelButtonsEventListeners();
        
        try {
            await wheelControllers.startBaseSpinning(); 
        } 
        catch (error) {
            console.log(error);
        }
        
        addWheelButtonsEventListeners();
    }

    async function onSpecialSpinning(e) {

        removeWheelButtonsEventListeners();

        try {
            await wheelControllers.startSpecialSpining(10);
        } 
        catch (error) {
            console.log(error);
        }

        addWheelButtonsEventListeners();
    }
};