import { AliasMap } from '../../core/alias/alias.map';
import { BACnetUnitAbbr } from '../../core/enums';
import { CustomUnit } from './custom.unit';

import { FunctionUnit } from './function/function.unit';
import { NoopUnit } from './noop/noop.unit';

export const CustomModule: AliasMap<any> = new AliasMap<any>([
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'func', 'function' ],
        value: FunctionUnit,
    },
    {
        alias: [ 'noop' ],
        value: NoopUnit,
    },
]);
