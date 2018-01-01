import Scatterdapp from './scatterdapp';
import {Network} from "scattermodels";

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
		this.scatter.requestPermissions().then(res => {
			console.log("From page", res)
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

