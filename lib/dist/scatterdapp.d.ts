export declare const EOSMessageTypes: {
    SIGN_MSG: string;
    GET_PUBLIC_KEY: string;
};
export default class Scatterdapp {
    ext: string;
    private stream;
    constructor(handshake: string);
    getPublicKey(): Promise<{}>;
    sign(msg: string): Promise<{}>;
    subscribe(func: any): void;
}
