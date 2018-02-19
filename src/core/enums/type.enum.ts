export enum BACNET_PROP_TYPES {
    unsignedInt = 2,
    real = 4,
    bitString = 8,
    enumerated = 9,
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
