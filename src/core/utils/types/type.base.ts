
import { BACnetReaderUtil } from '../bacnet-reader.util';
import { BACnetWriterUtil } from '../bacnet-writer.util';
import { IBACnetTag } from '../../interfaces';

export abstract class BACnetTypeBase {
    public readonly className: string = 'BACnetTypeBase';
    protected tag: IBACnetTag;

    abstract readValue (reader: BACnetReaderUtil, changeOffset?: boolean): void;
    abstract writeValue (writer: BACnetWriterUtil): void;
    abstract getValue (): any;

    public getTag (): IBACnetTag {
        return this.tag;
    }
}
