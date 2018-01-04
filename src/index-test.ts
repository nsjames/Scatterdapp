import Scatterdapp from './scatterdapp';
import {Network, CurrencyAction, ContractMessage, ContractAuthorization, ContractPermission} from "scattermodels";

class IndexTest {
	scatter:Scatterdapp;

	constructor(){
		document.addEventListener('scatterLoaded', () => {this.loaded()})
	}

	private loaded(){
		this.scatter = (<any>window).scatter;
		console.log(this.scatter, window);
		let network = new Network("Test Network 1", "testnet1.eos.io", 8888);
		this.scatter.setNetwork(network);
		// this.scatter.requestPermissions().then(res => {
		// 	console.log("From Request Permissions", res)
		// }).catch(e => {
		// 	console.log("Request Permissions Error: ", e)
		// })


		document.getElementById('buy').addEventListener('click', () => {
			let price = (<any>document.getElementById('price')).value;
			let testTransaction = {
				message: {
					code: 'currency',
					type: 'transfer',
					authorization: [
						{account: 'currency', permission: 'active'}
					]
				},
				data:{
					from:'currency',
					to:'inita',
					quantity:price
				},
				scope:['currency', 'inita'],
				publicKey:'' // active public of the contract creator(?)
			};
			console.log('testTransaction', testTransaction);


			let contractPermission = new ContractPermission('cryptocrap.com', 'EOS Deposit', 'Basic deposit of coins into Crypto Craps to use for playing at the tables.')
			this.scatter.requestSignature(testTransaction, contractPermission).then(res => {
				console.log("From Request Signature", res)
			}).catch(e => {
				console.log("Request Signature Error: ", e)
			})
		})

		// this.watchIncomingMessages();
	}

	// private watchIncomingMessages(){
	// 	this.scatter.subscribe((msg:any) => {
	// 		console.log("Message", msg);
	//
	// 	})
	// }
}

let x = new IndexTest();

