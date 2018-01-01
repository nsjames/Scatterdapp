import {EncryptedStream} from "./streams/EncryptedStream";

const EOSMessageTypes = {
	SIGN_MSG:'SIGN_MSG',
	GET_PUBLIC_KEY:'GET_PUBLIC_KEY'
};


export default class Scatterdapp {
	ext:string;
	private stream:EncryptedStream;

	constructor(handshake:string){
		this.ext = "scatter";
		this.stream = new EncryptedStream("injected", handshake);
		this.stream.sync(this.ext, handshake)
	}

	public getPublicKey(){
		return new Promise((resolve:any, reject:any) => {
			this.stream.send({type:EOSMessageTypes.GET_PUBLIC_KEY}, this.ext);
			resolve(true);
		});
	}

	public sign(msg:string){
		return new Promise((resolve, reject) => {
			this.stream.send({type:EOSMessageTypes.SIGN_MSG, msg}, this.ext);
			resolve(true);
		});

	}

	public subscribe(func:any){
		this.stream.listenWith(func);
	}
}