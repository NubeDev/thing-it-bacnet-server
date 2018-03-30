
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

export enum BACnetReliability {
    NoFaultDetected = 0,
    NoSensor = 1,
    OverRange = 2,
    UnderRange = 3,
    OpenLoop = 4,
    ShortedLoop = 5,
    NoOutput = 6,
    UnreliableOther = 7,
    ProcessError = 8,
    MultiStateFault = 9,
    ConfigurationError = 10,
    CommunicationFailure = 12,
    MemberFault = 13,
    MonitoredObjectFault = 14,
    Tripped = 15,
    LampFailure = 16,
    ActivationFailure = 17,
    RenewDhcpFailure = 18,
    RenewFdRegistrationFailure = 19,
    RestartAutoNegotiationFailure = 20,
    RestartFailure = 21,
    ProprietaryCommandFailure = 22,
    FaultsListed = 23,
    referencedObjectFault = 24,
}
