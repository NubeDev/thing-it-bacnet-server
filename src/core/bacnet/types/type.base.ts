
import { BACnetReaderUtil, BACnetWriterUtil } from '../utils';

import { IBACnetTag } from '../interfaces';

export abstract class BACnetTypeBase {
    public readonly className: string = 'BACnetTypeBase';
    protected tag: IBACnetTag;
    protected data: any;

    abstract readValue (reader: BACnetReaderUtil, changeOffset?: boolean): void;
    abstract writeValue (writer: BACnetWriterUtil): void;

    abstract getValue (): any;
    abstract setValue (newValute: any): void;
    abstract get value (): any;
    abstract set value (newValute: any);

    public getTag (): IBACnetTag {
        return this.tag;
    }
}
