export enum BACNET_CONFIRMED_SERVICE {
    SubscribeCOV = 0x05,
    ReadProperty = 0x0c,
    WriteProperty = 0x0f,
}

export enum BACNET_SERVICE_TYPES {
    ConfirmedReqPDU = 0x00,
    UnconfirmedReqPDU = 0x01,
    SimpleACKPDU = 0x02,
    ComplexACKPDU = 0x03,
}
