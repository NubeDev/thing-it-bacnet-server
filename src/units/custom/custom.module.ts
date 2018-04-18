import { AliasMap } from '../../core/alias/alias.map';
import { CustomUnit } from './custom.unit';

import { FunctionUnit } from './function/function.unit';

export const NativeModule: AliasMap<CustomUnit> = new AliasMap<any>([
    {
        alias: [ 'default', '0', 'func', 'function' ],
        value: FunctionUnit,
    },
]);
