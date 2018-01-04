import {EncryptedStream, Network, NetworkMessage, NetworkMessageTypes, ScatterError, RandomIdGenerator, ContractPermission} from "scattermodels";



export interface IScatterdapp {
	// User specific
	setNetwork(network:Network):void;

	requestPermissions():Promise<string|ScatterError>;
	proveIdentity(publicKey:string):Promise<boolean|ScatterError>;
	requestSignature(transaction:any, permission:any):Promise<string|ScatterError>;
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
	 * Converts a message into a promise
	 * @param type
	 * @param payload
	 * @returns {Promise<T>}
	 */
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
	 * Signs a transaction
	 * @param transaction - The transaction to sign
	 * @param permission */
	public requestSignature(transaction:any, permission:ContractPermission):Promise<string|ScatterError> {
		return new Promise((resolve, reject) => {
			if(!permission || !permission.isValid()) {
				reject(new ScatterError('The permission object is invalid'))
				return;
			}

			// TODO: Error handling for proper transaction

			this.send(NetworkMessageTypes.REQUEST_SIGNATURE, {transaction, permission})
				.then(res => resolve(res))
				.catch(e => reject(e));
		})
	}

	/***
	 * Signs a transaction
	 * @param publicKey - Provide a Public Key for a balance of it,
	 * 					  or omit the key for a total balance of all
	 * 					  authorized wallets. */
	public getBalance(publicKey:string = ''):Promise<number|ScatterError> {
		return this.send(NetworkMessageTypes.GET_BALANCE, publicKey)
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