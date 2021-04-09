import { wheelEvents } from './events.js';
import { render } from './render.js';

import { data } from './data.js';

export const wheel = function () {

    render.renderWheel(data);
    render.tableSectorsStatisticks();
    wheelEvents();
};