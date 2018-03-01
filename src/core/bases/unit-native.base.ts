import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../enums';

import {
    IBACnetObject,
    IBACnetObjectProperty,
} from '../interfaces';

export class UnitNativeBase {
    // Unit metadata
    public metadata: IBACnetObject;
    // Unit properties subject
    public sjData: Subject<IBACnetObjectProperty>;

    constructor () {
        this.sjData = new Subject();
    }

    public setProps (config: any) {
        if (_.isNil(config)) {
            return;
        }

        const metadataProps = _.cloneDeep(this.metadata.props);
        _.map(metadataProps, (prop: any) => {
            const propName = BACnetPropIds[prop.id];
            const propValueFromConfig = config[propName];

            prop.values = _.isNil(propValueFromConfig)
                ? prop.values : propValueFromConfig;
        });
        this.metadata.props = metadataProps;
    }

    /**
     * setUnitProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {any} values - property value
     * @return {void}
     */
    public setUnitProperty (propId: BACnetPropIds, values: any): void {
        const prop = _.find(this.metadata.props, [ 'id', propId ]);
        prop.values = values;

        // Emit change of unit
        const propClone = _.cloneDeep(prop);
        this.sjData.next(propClone);
    }

    /**
     * getUnitProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {any}
     */
    public getUnitProperty (propId: BACnetPropIds): any {
        const prop = _.find(this.metadata.props, [ 'id', propId ]);
        return _.cloneDeep(prop);
    }

    /**
     * subscribeProp - subscribes to the changes of specific property.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeProp (propId: BACnetPropIds): Observable<IBACnetObjectProperty> {
        return this.sjData
            .filter((prop) => prop.id === propId);
    }
}
