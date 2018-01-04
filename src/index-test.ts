import Scatterdapp from './scatterdapp';
import {Network, CurrencyAction, ContractMessage, ContractAuthorization, ContractPermission} from "scattermodels";

class IndexTest {
	scatter:Scatterdapp;

	constructor(){
		document.addEventListener('scatterLoaded', () => {this.loaded()})
	}

	private loaded(){

		this.scatter = (<any>window).scatter;
		let network = new Network("Test Network 1", "192.168.56.101", 8888);
		this.scatter.setNetwork(network);
		let eos = (<any>window).Eos.Localnet({httpEndpoint:network.toEndpoint(), signProvider:this.scatter.provider});

		document.getElementById('buy').addEventListener('click', () => {
			// This is how we can push a contract transaction when we pre-select the confirming account
			//------------------------------------------------------------------------------------------
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
					quantity:5
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
						.then(transaction => { console.log(transaction) })
						.catch(e => { console.log('Authenticated sign error: ', e) /*User did not sign*/ })
				})
			})
			//------------------------------------------------------------------------------------------
		})

		document.getElementById('buy2').addEventListener('click', () => {


			// eos.transfer({from: 'testacc', to: 'inita', amount: 1, memo: ''}).then(res => {
			// 	console.log("TEST: ", res)
			// })

			let trx = {
				messages: [{
					code: 'currency',
					type: 'transfer',
					authorization: [], // Left out, will be calculated after
					data:{
						from:'[scatter]', // Left out, will be calculated after
						to:'inita',
						quantity:5
					}
				}],
				data:{
					from:'[scatter]', // Left out, will be calculated after
					to:'inita',
					quantity:5
				},
				scope:['inita'],
				signatures:[]
			};

			this.scatter.signWithAnyAccount(trx).then(x => {
				console.log(x);
			}).catch(e => { console.log('signWithAnyAccount error: ', e) /*User did not sign*/ })
			//------------------------------------------------------------------------------------------
		})





	}
}

let x = new IndexTest();

