/***
	https://github.com/alameddince/basic-blockchain-withJs
*/

const SHA256 = require('crypto-js/sha256');
class Transaction{
	constructor(fromAddress,toAddress,amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}
class Block {
	constructor(timestamp,transactions,prevHash=''){
		this.timestamp =timestamp;
		this.transactions = transactions;
		this.prevHash = prevHash
		this.explorerCount = 0;
		this.hash = this.calculateHash();
	}
	calculateHash(){
		return SHA256(this.prevHash + this.timestamp + this.explorerCount + JSON.stringify(this.data)).toString();
	}


	/**
		Mine Block (Block seeks to ensure that the first number of difficulty variable characters are equal to the current explorerCount to hex.)

		Block Kazma işlemidir. (Girilen zorluk seviyesi adetinde ilk karakterin o anki explorerCount değerinin hex değerine eşit olmasını beklemektedir.
		Bu sayede Block oluşturma zorlaştırılmış ve eğer block üzerinde değişiklik yapılacak olursa sonraki blockları değiştirme fırsatını zorlamış olmakla 
		güvenilirliği arttırmış bulunmaktayız.)
	*/
	mineBlock(difficulty){
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join((this.explorerCount%16).toString(16)) || this.hash.substring(this.hash.length-difficulty,this.hash.length) !== Array(difficulty + 1).join((this.explorerCount%16).toString(16))){
			this.explorerCount++;
			console.log(this.hash)
			this.hash=this.calculateHash();
		}
		console.log(this.hash)
		console.log("Finish")
		return this.hash;
	}
}

class BlockChain{
	constructor(){
		this.chain = [this.createFirstBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}


	/**
		Chain is Initialized 
	*/
	createFirstBlock(){
		return new Block("27/09/2019","started","0"); 
	}


	/**
		Last Block
	*/
	getLastBlock(){
		return this.chain[this.chain.length - 1];
	}

	/**
		Mining (Miner add pending transactions to chain with a new block)
	*/
	minePendingTransactions(mineRewardAddress){
		let block = new Block(Date.now(),this.pendingTransactions);
		block.mineBlock(this.difficulty);
		console.log("Block Created");
		this.chain.push(block);
		this.pendingTransactions = [
			new Transaction(null, mineRewardAddress, this.miningReward)
		];
	}

	/**
		Create a new Transaction 
	*/
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	/**
		Balance Wallet
	*/
	getBalanceOfAddress(currentAddress){
		let balance = 0;

		for(const block of this.chain){
			for(const transaction of block.transactions){
				if(transaction.fromAddress==currentAddress){
					balance -= transaction.amount;
				}

				if(transaction.toAddress==currentAddress){
					balance += transaction.amount;
				}
			}
		}
		console.log(currentAddress + ":> " +balance);
	}
	/**
		Validation Function for Chain
	*/
	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const prevBlock = this.chain[i - 1];

			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}
				

			if(currentBlock.prevHash !== prevBlock.hash){
				return false;
			}

			return true;
		}
	}
}


