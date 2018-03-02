import * as _ from 'lodash';
import { NativeModule } from './native/native.module';

function mergedMaps (maps: any[]) {
    const dataMap = new Map();

    _.map(maps, (map) => {
        for (const [key, value] of map) {
            dataMap.set(key, value)
        }
    });

    return dataMap
}

export const UnitModule = mergedMaps([
    NativeModule
]);
