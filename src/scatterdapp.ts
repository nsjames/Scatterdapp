import {EncryptedStream} from "./streams/EncryptedStream";

export const ScatterMessageTypes = {
	REQUEST_PERMISSIONS:'rq_perm',
	PROVE_IDENTITY:'prv_ident',
	REQUEST_TRANSACTION:'rq_trx',
	GET_BALANCE:'get_bal'
};

export class ScatterError {}


export class ScatterMessage {
	type:string;
	payload:any;
	resolverId:string;

	constructor(type:string, payload:any, resolverId:string){
		this.type = type;
		this.payload = payload;
		this.resolverId = resolverId;
	}

	public static fromJson(json:any){ return Object.assign(new ScatterMessage("",{},""), json); }
	public respond(payload:any){ return new ScatterMessage(this.type, payload, this.resolverId); }
}

export interface IScatterdapp {
	// User specific
	requestPermissions():Promise<string|ScatterError>;
	proveIdentity(publicKey:string):Promise<boolean|ScatterError>;
	requestTransaction(transaction:any):Promise<string|ScatterError>;
	getBalance(publicKey:string):Promise<number|ScatterError>

	// EOS Generic
	// getInfo()
	// getBlock()
	// getAccount()
	// getAccountsFromPublicKey()
	// getControlledAccounts()
	// getContract()
	// getTableRows()
	// getTransaction()
	// getTransactions()
}

class DanglingResolver {
	id:string; resolve:any; reject:any;
	constructor(id, resolve, reject){ this.id = id; this.resolve = resolve; this.reject = reject; }
}

const endpoint = 'scatter';
export default class Scatterdapp implements IScatterdapp {
	private endpoint:string;
	private stream:EncryptedStream;
	private resolvers:Array<DanglingResolver>;

	constructor(handshake:string){
		this.resolvers = [];
		this.initializeEncryptedStream(handshake);
	}

	private initializeEncryptedStream(handshake:string){
		this.stream = new EncryptedStream("injected", handshake);
		this.subscribe();
		this.stream.sync(endpoint, handshake);
	}

	// Todo: merge with Scatter extension's copy, and move to a shared library
	private generateResolverId(size:number = 24){
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(let i=0; i<size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	/***
	 * Converts a message into a promise
	 * @param type
	 * @param payload
	 * @returns {Promise<T>}
	 */
	private send(type, payload):Promise<any> {
		return new Promise((resolve, reject) => {
			let id = this.generateResolverId();
			let message = new ScatterMessage(type, payload, id);
			this.resolvers.push(new DanglingResolver(id, resolve, reject))
			this.stream.send(message, endpoint);
		})
	}


	/***
	 *	Requests permissions from the domain to a wallet of the user's choosing.
	 *  If the user denies the request it will return `false`, else a Public Key. */
	public requestPermissions():Promise<string|ScatterError> {
		return this.send(ScatterMessageTypes.REQUEST_PERMISSIONS, null)
	}

	/***
	 * Sends a message to be encrypted with a known Public Key's Private Key.
	 * @param publicKey - The public key to verify against */
	public proveIdentity(publicKey:string):Promise<boolean|ScatterError> {
		return new Promise((res:any, rej:any) => {
			res(true)
		})
	}

	/***
	 * Signs a transaction
	 * @param transaction - The transaction to sign */
	public requestTransaction(transaction:any):Promise<string|ScatterError> {
		return new Promise((res:any, rej:any) => {
			res(true)
		})
	}

	/***
	 * Signs a transaction
	 * @param publicKey - Provide a Public Key for a balance of it,
	 * 					  or omit the key for a total balance of all
	 * 					  authorized wallets. */
	public getBalance(publicKey:string = ''):Promise<number|ScatterError> {
		return new Promise((res:any, rej:any) => {
			res(true)
		})
	}

	/***
	 * Messages do not come back on the same thread.
	 * To accomplish a future promise structure this method
	 * catches all incoming messages and dispenses
	 * them to the open promises. */
	private subscribe():void {
		this.stream.listenWith((msg) => {
			if(msg.type === 'sync'){ this.stream.commitSync(this); return false; }
			let toSlice = -1;
			for(let i=0; i < this.resolvers.length; i++) {
				if (this.resolvers[i].id === msg.resolverId) {
					this.resolvers[i].resolve(msg.payload);
					console.log("slize", i)
					this.resolvers = this.resolvers.slice(i, 1);
				}
			}
			console.log(this.resolvers)
		});
	}
}