import * as CryptoJS from 'crypto-js';

export class AES {

	static encrypt(data:any, key:string){
		if(typeof data === 'object') data = JSON.stringify(data);
		return CryptoJS.AES.encrypt(data, key).toString()
	}

	static decrypt(encryptedData:string, key:string){
		let clear = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
		try { return JSON.parse(clear) } catch(e){ return clear; }
	}
}