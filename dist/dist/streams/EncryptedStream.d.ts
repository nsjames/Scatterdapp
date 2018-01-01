export declare class EncryptedStream {
    eventName: string;
    key: string;
    event: Event;
    synced: boolean;
    constructor(_eventName: string, _randomized: string);
    listenWith(func: any): void;
    send(data: any, to: string): Promise<any>;
    sync(to: string, handshake: string): void;
    private dispatch(encryptedData, to);
    private getEvent(encryptedData, to);
    private getEventInit(encryptedData);
}
