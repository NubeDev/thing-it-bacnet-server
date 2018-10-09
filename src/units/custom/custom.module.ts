import { AliasMap } from '../../core/alias/alias.map';
import { BACnetUnitAbbr } from '../../core/enums';
import { CustomUnit } from './custom.unit';

import { FunctionalUnit } from './function/functional.unit';
import { ThermostatUnit } from './thermostat/thermostat.unit';
import { NoopUnit } from './noop/noop.unit';

export const CustomModule: AliasMap<any> = new AliasMap<any>([
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'noop' ],
        value: NoopUnit,
    },
    {
        alias: [ '1', 'fn', 'func', 'function' ],
        value: FunctionalUnit,
    },
    {
        alias: [ '2', 'th', 'thermo', 'thermostat' ],
        value: ThermostatUnit,
    }
]);
