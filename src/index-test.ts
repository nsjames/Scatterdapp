import Scatterdapp from './scatterdapp';

class IndexTest {
	scatter:Scatterdapp;

	constructor(){
		document.addEventListener('scatterLoaded', () => {this.loaded()})
	}

	private loaded(){
		this.scatter = (<any>window).scatter;
		console.log(this.scatter, window);
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

