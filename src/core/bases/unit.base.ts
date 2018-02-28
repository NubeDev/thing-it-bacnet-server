import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../enums';

export class UnitBase {
    public metadata: any;

    constructor () {
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
}
