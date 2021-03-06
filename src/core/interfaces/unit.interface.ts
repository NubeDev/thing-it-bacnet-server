import * as BACNet from 'tid-bacnet-logic';
/**
 * EDE
 */

export interface IEDEUnit {
    keyname: string;
    deviceInst: number;
    objName: string;
    objType: number;
    objInst: number;
    description: string;
    defPresentValue: number;
    minPresentValue: number;
    maxPresentValue: number;
    commandable: string;
    supportCOV: string;
    hiLimit: number;
    liLimit: number;
    stateTextRef: number;
    unitCode: number;
    vendorAddr: string;
    // Custom cells
    custUnitType: string;
    custUnitId: number;
    custUnitFn: string;
    custUnitMax: number;
    custUnitMin: number;
    custUnitFreq: number;
}

/**
 * Custom Units
 */
export namespace Units {
    export namespace Custom {
        export interface Metadata {
            alias: string|string[];
            config: Config;
        }

        export interface Function <T> {
            unit: T;
            config: Config;
        }

        export interface Config {
            // Min value
            min?: number;
            // Max value
            max?: number;
            // Frequency
            freq?: number;
            stateText?: string[];
        }
    }

    /**
     * Functional Unit
     */
    export namespace Functional {
        export interface Metadata {
            alias: string|string[];
            config: Config;
        }

        export interface Function <T> {
            unit: T;
            config: Config;
        }

        export interface Config {
            // Min value
            min: number;
            // Max value
            max: number;
            // Frequency
            freq: number;
        }
    }

    export namespace Thermostat {
        export interface Metadata {
            alias: string|string[];
            config: Setpoint.Config|Temperature.Config|Mode.Config;
        }

        export namespace Setpoint {
            export interface Config {
                min: number;
                max: number;
            }

            export interface Function <T> {
                unit: T;
                config: Config;
            }
        }

        export namespace Temperature {
            export interface Config extends Units.Functional.Config {
                min: number;
                max: number;
                freq: number;
            }

            export interface Function <T> {
                unit: T;
                config: Config;
            }
        }

        export namespace Mode {
            export interface Config {
                stateText: string[];
            }

            export interface Function <T> {
                unit: T;
                config: Config;
            }
        }
    }

    export namespace Light {
        export interface Metadata {
            alias: string|string[];
            config: Level.Feedback.Config|Level.Modification.Config|State.Config;
        }

        export namespace Level {
            export namespace Feedback {
                export interface Config {
                    min: number;
                    max: number;
                }

                export interface Function <T> {
                    unit: T;
                    config: Config;
                }
            }

            export namespace Modification {
                export interface Config {
                    min: number;
                    max: number;
                }

                export interface Function <T> {
                    unit: T;
                    config: Config;
                }
            }
        }

        export namespace State {
            export interface Config {
                stateText: string[];
            }

            export interface Function <T> {
                unit: T;
                config: Config;
            }
        }
    }

    export namespace Jalousie {

        export interface State {
            position: number;
            rotation: number;
        }

        export interface Metadata {
            alias: string|string[];
            config: Position.Modification.Config|Position.Feedback.Config|Rotation.Feedback.Config|Rotation.Modification.Config|Action.Config;
        }

        export namespace Position {
            export namespace Modification {
                export interface Config {
                    max: number;
                    min: number;
                    freq: number;
                }

                export interface Function<T> {
                    unit: T;
                    config: Config;
                }
            }

            export namespace Feedback {
                export interface Config {

                }

                export interface Function<T> {
                    unit: T;
                    config: Config;
                }
            }
        }

        export namespace Rotation {
            export namespace Modification {
                export interface Config extends Position.Modification.Config {

                }

                export interface Function<T> {
                    unit: T;
                    config: Config;
                }
            }

            export namespace Feedback {
                export interface Config {

                }

                export interface Function<T> {
                    unit: T;
                    config: Config;
                }
            }
        }

        export namespace Action {
            export interface Config {
                stateText: string[];
            }

            export interface Function<T> {
                unit: T;
                config: Config;
            }
        }
    }
}


/**
 * Unit Storage
 */

export interface UnitStorageProperty {
    id: BACNet.Enums.PropertyId;
    payload: BACNet.Types.BACnetTypeBase | BACNet.Types.BACnetTypeBase[];
    writable?: boolean;
    priority?: number;
}

/**
 * State texts
 */

export interface IStateTextsUnit {
    referenceNumber: number;
    inactiveText?: string;
    activeText?: string;
    stateTextsArray: string[];
}
