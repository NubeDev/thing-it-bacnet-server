
export enum BACnetBinaryPV {
    Inactive = 0,
    Active = 1,
}

export enum BACnetPolarity {
    Normal = 0,
    Reverse = 1,
}

export enum BACnetEventState {
    Normal = 0,
    Fault = 1,
    Offnormal = 2,
    HighLimit = 3,
    LowLimit = 4,
    LifeSafetyAlarm = 5,
}
