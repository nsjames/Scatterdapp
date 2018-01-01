import { Network, ScatterError } from "scattermodels";
export interface IScatterdapp {
    setNetwork(network: Network): void;
    requestPermissions(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    requestSignature(transaction: any): Promise<string | ScatterError>;
    getBalance(publicKey: string): Promise<number | ScatterError>;
}
export default class Scatterdapp implements IScatterdapp {
    private endpoint;
    private stream;
    private resolvers;
    private network;
    constructor(handshake: string);
    private initializeEncryptedStream(handshake);
    setNetwork(network: Network): void;
    private generateResolverId(size?);
    private send(type, payload);
    requestPermissions(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    requestSignature(transaction: any): Promise<string | ScatterError>;
    getBalance(publicKey?: string): Promise<number | ScatterError>;
    private subscribe();
}
