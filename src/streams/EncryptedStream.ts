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
			msg = (this.synced) ? AES.decrypt(msg, this.key) : msg;
			func(msg);
		});
	}

	send(data:any, to:string):Promise<any>{
		const addSender = () => { data.from = this.eventName; };
		const encryptIfSynced = () => { data = (this.synced) ? AES.encrypt(data, this.key) : data; };

		return new Promise((resolve:any, reject:any) => {
			if(typeof data !== 'object') { reject(); return; }
			addSender();
			encryptIfSynced();
			this.dispatch(data, to);
			resolve(true);
		})
	}

	sync(to:string, handshake:string){
		this.send({type:'sync', handshake}, to).then((res:any) => {
			this.synced = true;
		});

	}

	private dispatch(encryptedData:any, to:string){ document.dispatchEvent(this.getEvent(encryptedData, to)); }
	private getEvent(encryptedData:any, to:string){ return new CustomEvent(to, this.getEventInit(encryptedData)) }
	private getEventInit(encryptedData:any){ return {detail:encryptedData}; }


}

