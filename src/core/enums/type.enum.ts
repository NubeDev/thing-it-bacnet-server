export enum BACNET_PROP_TYPES {
    boolean = 1,
    unsignedInt = 2,
    real = 4,
    characterString = 7,
    bitString = 8,
    enumerated = 9,
    objectIdentifier = 12,
}

export function getTypeSize (type: BACNET_PROP_TYPES): number {
    switch (type) {
        case BACNET_PROP_TYPES.unsignedInt:
        case BACNET_PROP_TYPES.enumerated:
        case BACNET_PROP_TYPES.bitString:
            return 1;
        case BACNET_PROP_TYPES.real:
            return 4;
    }
}

export function getStringEncode (charSet: number): string {
    switch (charSet) {
        case 0:
        default:
            return 'utf8';
    }
}
