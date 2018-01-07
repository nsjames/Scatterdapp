import { Network, ScatterError } from "scattermodels";
export interface IScatterdapp {
    setNetwork(network: Network): void;
    requestIdentity(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    signWithAnyAccount(transaction: any): Promise<string | ScatterError>;
    provider(signargs: any): any;
}
export default class Scatterdapp implements IScatterdapp {
    private endpoint;
    private stream;
    private resolvers;
    private network;
    constructor(handshake: string);
    private initializeEncryptedStream(handshake);
    setNetwork(network: Network): void;
    provider: (signargs: any) => Promise<any>;
    private send(type, payload);
    requestIdentity(): Promise<string | ScatterError>;
    proveIdentity(publicKey: string): Promise<boolean | ScatterError>;
    signWithAnyAccount(transaction: any): Promise<string | ScatterError>;
    private subscribe();
}
