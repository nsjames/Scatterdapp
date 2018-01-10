import Scatterdapp from './scatterdapp';
import {Network} from "scattermodels";

class IndexTest {
	scatter:Scatterdapp;

	constructor(){
		document.addEventListener('scatterLoaded', () => {this.loaded()})
	}

	private loaded(){

		this.scatter = (<any>window).scatter;
		let network = new Network("Test Network 1", "192.168.56.101", 8888);
		// let network = new Network("Test Network 1", "testnet1.eos.io", 80);
		// let network = new Network("Test Network 1", "failing.eos.io", 80);
		this.scatter.setNetwork(network);
		let eos = (<any>window).Eos.Localnet({httpEndpoint:network.toEndpoint(), signProvider:this.scatter.provider});

		document.getElementById('buy').addEventListener('click', () => {
			let trx = {
				messages: [{
					code: 'currency',
					type: 'transfer',
					authorization: [{account: 'testacc', permission: 'active'}],
					data:null
				}],
				data:{
					from:'testacc',
					to:'inita',
					quantity:1
				},
				scope:['testacc', 'inita'],
				signatures:[]
			};

			let message = trx.messages[0];
			eos.abiJsonToBin({code:message.code, action:message.type, args:trx.data}).then(bin => {
				let bintrx = Object.assign({}, trx);
				bintrx.messages[0].data = bin.binargs;
				eos.contract('currency').then(currency => {
					currency.transaction(bintrx)
						.then(transaction => {
							console.log(transaction)
							bindTrxData('buy_vals', transaction);
						})
						.catch(e => { bindError('buy_vals', e) })
				})
			})
		})

		document.getElementById('buy2').addEventListener('click', () => {
			let trx = {
				messages: [{
					code: 'currency',
					type: 'transfer',
					authorization: [], // Left out, will be calculated after
					data:{
						from:'[scatter]', // Left out, will be calculated after
						to:'inita',
						quantity:1
					}
				}],
				scope:['inita'], // Leave out the other
				signatures:[]
			};

			this.scatter.signWithAnyAccount(trx).then(transaction => {
				console.log(transaction);
				bindTrxData('buy2_vals', transaction);
			}).catch(e => { bindError('buy2_vals', e) })
		})

		document.getElementById('ident').addEventListener('click', () => {
			this.scatter.requestIdentity().then(account => {
				document.getElementById('ident_vals').innerHTML = `Account: <b>${account.name}</b> <br> Public Key: <b>${account.publicKey}</b>`
				console.log("Got identity", account);
			}).catch(e => { bindError('ident_vals', e) })
		})

		document.getElementById('topup').addEventListener('click', () => {
			this.scatter.requestIdentity().then(account => {
				let webEos = (<any>window).Eos.Localnet({httpEndpoint:network.toEndpoint(), keyProvider:'5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'});
				webEos.transfer('inita', account.name, 10000, '').then(res => {
					console.log(res);
				}).catch(e => console.log(e));
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

