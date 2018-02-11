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
		const eosOptions = {};

		// Now this.scatter can be used to return a valid instance of eosjs that can be
		// used with the Scatter extension. Trying to use a manually created eosjs instance
		// with a fake scatter provider will fail due to WeakMap verification.
		const eos = this.scatter.eos( Eos.Localnet, network, eosOptions );
		console.log(Eos.Localnet());

		let identity = null;

		document.getElementById('ident').addEventListener('click', () => {
			this.scatter.getIdentity(['account', 'firstname']).then(id => {
				if(!id) return false;
				this.scatter.useIdentity(id.hash);
				identity = id;
				console.log('Possible identity', id)
			});
		});

		document.getElementById('buy').addEventListener('click', () => {
			const requiredFields = ['country', 'phone'];
			eos.transfer(identity.account.name, 'inita', 10, '', {requiredFields}).then(transaction => {
				console.log('transaction', transaction);
				bindTrxData('buy_vals', transaction);
			}).catch(e => { bindError('buy_vals', e) })
		});

		document.getElementById('topup').addEventListener('click', () => {
			let webEos = Eos.Localnet({httpEndpoint:`http://${network.host}:${network.port}`, keyProvider:'5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'});
			webEos.transfer('inita', identity.account.name, 100000, '').then(transaction => {
				bindTrxData('topup_vals', transaction);
			}).catch(e => { bindError('topup_vals', e) })
		})

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

