
import { BACnetReaderUtil } from '../bacnet-reader.util';
import { BACnetWriterUtil } from '../bacnet-writer.util';
import { IBACnetTag } from '../../interfaces';

export abstract class BACnetTypeBase {
    protected tag: IBACnetTag;

    abstract readValue (reader: BACnetReaderUtil, changeOffset?: boolean): void;
    abstract writeValue (writer: BACnetWriterUtil): void;

    public getTag (): IBACnetTag {
        return this.tag;
    };
}
