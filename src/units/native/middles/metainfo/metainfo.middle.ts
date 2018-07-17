import * as _ from 'lodash';

import {
    // BACnetPropertyId,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import {
    IEDEUnit,
} from '../../../../core/interfaces';

import { MetainfoMiddleMetadata } from './metainfo.metadata';

import { MiddleUnit } from '../middle.unit';

// import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export class MetainfoMiddleUnit extends MiddleUnit {
    public readonly className: string = 'MetainfoMiddleUnit';

    /**
     * initMiddle - initializes the middle unit.
     *
     * @param  {IEDEUnit} edeUnit -  ede unit configuration
     * @return {void}
     */
    public initMiddle (edeUnit?: IEDEUnit): void {
        super.initMiddle(edeUnit);

        this.storage.addUnitStorage(MetainfoMiddleMetadata);

        // --- Set default state in metainfo properties
        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.objectIdentifier,
            payload: new BACNet.Types.BACnetObjectId({
                type: edeUnit.objType,
                instance: edeUnit.objInst,
            }),
        });

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.objectName,
            payload: new BACNet.Types.BACnetCharacterString(edeUnit.objName),
        });

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.objectType,
            payload: new BACNet.Types.BACnetEnumerated(edeUnit.objType),
        });

        if (edeUnit.description) {
            this.storage.setProperty({
                id: BACNet.Enums.PropertyId.description,
                payload: new BACNet.Types.BACnetCharacterString(edeUnit.description),
            });
        }
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
    }
}
