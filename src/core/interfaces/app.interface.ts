
/*
 * Configuration
 */

/* Application Config */
export interface IAppConfig {
    server: IServerConfig;
    ede: IEDEConfig;
    bacnet: IBACnetConfig;
}

/* BACnet config */
export interface IBACnetConfig {
    edeFilePath: string;
}

/* Server config */
export interface IServerConfig {
    port: number;
    outputSequence: ISequenceConfig;
}

/* Sequence Manager Config */
export interface ISequenceConfig {
    thread: number;
    delay: number;
}

/* EDE config */
export interface IEDEConfig {
    header: IEDEHeaderOptions;
}

export interface IEDEHeaderOptions {
    projectName: string;
    versionOfRefFile: number;
    authorOfLastChange: string;
    versionOfLayout: number;
}


/**
 * Managers
 */

/* Sequence Manager */
export interface ISequenceFlow {
    id: string;
    object: any;
    method: any;
    params: any[];
}
