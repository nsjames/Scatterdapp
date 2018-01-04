import {EncryptedStream, Network, NetworkMessage, NetworkMessageTypes, ScatterError, RandomIdGenerator, ContractPermission, EOSService} from "scattermodels";



export interface IScatterdapp {
	setNetwork(network:Network):void;
	requestPermissions():Promise<string|ScatterError>;
	proveIdentity(publicKey:string):Promise<boolean|ScatterError>;
	provider(signargs:any);
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
	private network:Network = null;

	constructor(handshake:string){
		this.resolvers = [];
		this.initializeEncryptedStream(handshake);
	}

	private initializeEncryptedStream(handshake:string){
		this.stream = new EncryptedStream("injected", handshake);
		this.subscribe();
		this.stream.sync(endpoint, handshake);
	}

	public setNetwork(network:Network){ this.network = network; }

	/***
	 *
	 * @param signargs - Automatically provided
	 * @returns {Promise<any>}
	 */
	public provider = async (signargs:any) => {
		return await this.send(NetworkMessageTypes.REQUEST_SIGNATURE, signargs);
	};

	private send(type, payload):Promise<any> {
		// TODO: Throw error to notify that a network needs to be set.
		if(!this.network || this.network.host == '') {
			alert("You must set a network before sending any messages")
			return;
		}

		return new Promise((resolve, reject) => {
			let id = RandomIdGenerator.generate(24);
			let message = new NetworkMessage(type, payload, id, this.network);
			this.resolvers.push(new DanglingResolver(id, resolve, reject))
			this.stream.send(message, endpoint);
		})
	}


	/***
	 *	Requests permissions from the domain to a wallet of the user's choosing.
	 *  If the user denies the request it will return `false`, else a Public Key. */
	public signWithAnyAccount(transaction:any):Promise<string|ScatterError> {
		return this.send(NetworkMessageTypes.SIGN_WITH_ANY, transaction)
	}


	/***
	 *	Requests permissions from the domain to a wallet of the user's choosing.
	 *  If the user denies the request it will return `false`, else a Public Key. */
	public requestPermissions():Promise<string|ScatterError> {
		return this.send(NetworkMessageTypes.REQUEST_PERMISSIONS, window.location.host)
	}

	/***
	 * Sends a message to be encrypted with a known Public Key's Private Key.
	 * @param publicKey - The public key to verify against */
	public proveIdentity(publicKey:string):Promise<boolean|ScatterError> {
		return this.send(NetworkMessageTypes.PROVE_IDENTITY, publicKey)
	}

	/***
	 * Messages do not come back on the same thread.
	 * To accomplish a future promise structure this method
	 * catches all incoming messages and dispenses
	 * them to the open promises. */
	private subscribe():void {
		this.stream.listenWith((msg) => {
			if(msg.type === 'sync'){ this.stream.commitSync(this); return false; }
			for(let i=0; i < this.resolvers.length; i++) {
				if (this.resolvers[i].id === msg.resolverId) {
					if(msg.type == 'error') this.resolvers[i].reject(msg.payload);
					else this.resolvers[i].resolve(msg.payload);
					this.resolvers = this.resolvers.slice(i, 1);
				}
			}
		});
	}
}