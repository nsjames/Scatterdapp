export declare const ScatterMessageTypes: {
    REQUEST_PERMISSIONS: string;
    PROVE_IDENTITY: string;
    REQUEST_TRANSACTION: string;
    GET_BALANCE: string;
};
export declare class ScatterError {
}
export declare class ScatterMessage {
    type: string;
    payload: any;
    resolverId: string;
    constructor(type: string, payload: any, resolverId: string);
    static fromJson(json: any): any;
    respond(payload: any): ScatterMessage;
}
export interface IScatterdapp {
    requestPermissions(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    requestTransaction(transaction: any): Promise<string | ScatterError>;
    getBalance(publicKey: string): Promise<number | ScatterError>;
}
export default class Scatterdapp implements IScatterdapp {
    private endpoint;
    private stream;
    private resolvers;
    constructor(handshake: string);
    private initializeEncryptedStream(handshake);
    private generateResolverId(size?);
    private send(type, payload);
    requestPermissions(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    requestTransaction(transaction: any): Promise<string | ScatterError>;
    getBalance(publicKey?: string): Promise<number | ScatterError>;
    private subscribe();
}
