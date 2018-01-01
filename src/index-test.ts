import {Scatterdapp} from './scatterdapp';

class IndexTest {
	scatter:Scatterdapp;

	constructor(){
		document.addEventListener('scatterLoaded', () => { this.loaded(); })
	}

	private loaded(){
		this.scatter = (<any>window).scatter;
		this.watchIncomingMessages();

		this.scatter.sign("Hi").then(res => {
			console.log("RES", res);
		})
	}

	private watchIncomingMessages(){
		this.scatter.subscribe((msg:any) => {
			console.log("Message", msg);

		})
	}
}

let x = new IndexTest();

