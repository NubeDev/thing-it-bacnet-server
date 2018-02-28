import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../core/enums';

import { BinaryValueMetadata } from './binary-value.metadata';

export class BinaryValueUnit {
    private metadata: any;

    constructor (bnModule: any) {
        this.metadata = _.cloneDeep(BinaryValueMetadata);
        this.setProps(bnModule.config);
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

    public getBACnetObjects () {
        return _.cloneDeep(this.metadata);
    }
}
