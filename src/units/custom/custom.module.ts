import { AliasMap } from '../../core/alias/alias.map';
import { BACnetUnitAbbr } from '../../core/enums';
import { CustomUnit } from './custom.unit';

import { FunctionUnit } from './function/function.unit';

export const CustomModule: AliasMap<any> = new AliasMap<any>([
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'func', 'function' ],
        value: FunctionUnit,
    },
]);
