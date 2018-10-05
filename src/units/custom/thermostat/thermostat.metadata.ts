import { BACnetThermostatUnitFunctions } from '../../../core/enums';
import { IThermostatMetadata } from '../../../core/interfaces';

export const ThermostatMetadata: IThermostatMetadata[] = [
    {
        alias: [ BACnetThermostatUnitFunctions.SetpointFeedback ],
        config: { min: 18, max: 26 },
    },
    {
        alias: [ BACnetThermostatUnitFunctions.SetpointModification ],
        config: { min: 18, max: 26 },
    },
    {
        alias: [ BACnetThermostatUnitFunctions.Temperature],
        config: { min: 0, max: 40, freq: 1000 },
    },
    {
        alias: [ BACnetThermostatUnitFunctions.Mode ],
        config: { stateText: [ 'COOL', 'HEAT' ] },
    }
];
