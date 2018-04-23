import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import {
    IEDEUnit,
} from '../../../../core/interfaces';

import { MetainfoMiddleMetadata } from './metainfo.metadata';

import { MiddleUnit } from '../middle.unit';

import * as BACnetTypes from '../../../../core/bacnet/types';

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
            id: BACnetPropertyId.objectIdentifier,
            payload: new BACnetTypes.BACnetObjectId({
                type: edeUnit.objType,
                instance: edeUnit.objInst,
            }),
        });

        this.storage.setProperty({
            id: BACnetPropertyId.objectName,
            payload: new BACnetTypes.BACnetCharacterString(edeUnit.objName),
        });

        this.storage.setProperty({
            id: BACnetPropertyId.objectType,
            payload: new BACnetTypes.BACnetEnumerated(edeUnit.objType),
        });

        if (edeUnit.description) {
            this.storage.setProperty({
                id: BACnetPropertyId.description,
                payload: new BACnetTypes.BACnetCharacterString(edeUnit.description),
            });
        }
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
    }
}
