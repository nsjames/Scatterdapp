import Scatterdapp from './scatterdapp';
import {Network} from "scattermodels";
import * as Eos from 'eosjs';

class IndexTest {
	scatter:any;

	constructor(){
		document.addEventListener('scatterLoaded', this.loaded)
	}

	// Setting up Scatter and eosjs
	private loaded(x){

		// At this point scatter is synced, loaded, encrypted, and can be setup.
		this.scatter = (<any>window).scatter;

		// In order to set up a signature provided instance of eosjs we need
		// to predefine a network, and possibly options.
		const network = { host:"192.168.56.101", port:8888 };
		// const network = { host:"mainnet.eos.io", port:8080 };
		const eosOptions = { expireInSeconds: 60, };

		// Now this.scatter can be used to return a valid instance of eosjs that can be
		// used with the Scatter extension. Trying to use a manually created eosjs instance
		// with a fake scatter provider will fail due to WeakMap verification.
		const eos = this.scatter.eos( Eos.Localnet, network, eosOptions );

		console.log(this.scatter);



		document.getElementById('buy').addEventListener('click', () => {
			eos.transfer('feasdf1', 'inita', 10, '').then(transaction => {
				bindTrxData('buy_vals', transaction);
			}).catch(e => { bindError('buy_vals', e) })
		})
		//
		// document.getElementById('buy2').addEventListener('click', () => {
		// 	let trx = {
		// 		messages: [{
		// 			code: 'eos',
		// 			type: 'transfer',
		// 			authorization: [], // Left out, will be calculated after
		// 			data:{
		// 				from:'[scatter]', // Left out, will be calculated after
		// 				to:'inita',
		// 				amount:1,
		// 				memo:''
		// 			}
		// 		}],
		// 		scope:['inita'], // Leave out the other
		// 		signatures:[]
		// 	};
		//
		// 	this.scatter.signWithAnyAccount(trx).then(transaction => {
		// 		bindTrxData('buy2_vals', transaction);
		// 	}).catch(e => { bindError('buy2_vals', e) })
		// })
		//
		document.getElementById('ident').addEventListener('click', () => {
			this.scatter.getIdentity(['email']).then(id => {
				console.log('Possible identity', id)
			});
		})
		//
		// document.getElementById('topup').addEventListener('click', () => {
		// 	this.scatter.requestIdentity().then(account => {
		// 		let webEos = (<any>window).Eos.Localnet({httpEndpoint:network.toEndpoint(), keyProvider:'5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'});
		// 		webEos.transfer('inita', account.name, 100000, '').then(transaction => {
		// 			bindTrxData('topup_vals', transaction);
		// 		}).catch(e => { bindError('topup_vals', e) })
		// 	}).catch(e => { bindError('topup_vals', e) })
		// })
		//
		//
		//
		function bindTrxData(elemId, transaction){
			document.getElementById(elemId).innerHTML = `Transaction ID: <b>${transaction.transaction_id}</b> <br>
													     Transaction Data: <code>${JSON.stringify(transaction.transaction.messages[0].data)}</code>`
		}

		function bindError(elemId, error){
			document.getElementById(elemId).innerHTML = `Error Type: <b>${error.type}</b> <br>
													     Error Message: <code>${error.message}</code>`
		}



	}
}

let x = new IndexTest();

