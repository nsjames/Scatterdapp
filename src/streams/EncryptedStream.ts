import {AES} from '../cryptography/AES';

export class EncryptedStream {
	eventName:string;
	key:string;
	event:Event;
	synced:boolean;

	constructor(_eventName:string, _randomized:string){
		this.eventName = _eventName;
		this.key = _randomized.toString();
		this.event = new Event(_eventName);
		this.synced = false;
	}

	listenWith(func:any){
		document.addEventListener(this.eventName, (e:any) => {
			let msg = e.detail;
			msg = (this.synced || typeof msg === 'string') ? AES.decrypt(msg, this.key) : msg;
			func(msg);
		});
	}

	send(data:any, to:string):void {
		const addSender = () => { data.from = this.eventName; };
		const encryptIfSynced = () => { data = (this.synced) ? AES.encrypt(data, this.key) : data; };

		if(typeof data !== 'object') return;
		addSender();
		encryptIfSynced();
		this.dispatch(data, to);
	}

	sync(to:string, handshake:string){
		this.send({type:'sync', handshake}, to);
	}

	commitSync(scatter){
		this.synced = true;
		(<any>window).scatter = scatter;
		document.dispatchEvent(new CustomEvent("scatterLoaded", {detail:{type:'loaded'}}));
	}

	private dispatch(encryptedData:any, to:string){ document.dispatchEvent(this.getEvent(encryptedData, to)); }
	private getEvent(encryptedData:any, to:string){ return new CustomEvent(to, this.getEventInit(encryptedData)) }
	private getEventInit(encryptedData:any){ return {detail:encryptedData}; }


}

