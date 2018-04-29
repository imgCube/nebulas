declare module 'nebulify/src/Account' {
	export default class Account {
	    private privateKey;
	    private underlyingInstance;
	    constructor(privateKey?: string, path?: string);
	    setPrivateKey(key: Key | string): void;
	    getPublicKey(): string;
	    getPublicKeyBuffer(): Uint8Array;
	    getPrivateKey(): string;
	    getPrivateKeyBuffer(): Uint8Array;
	    getAddress(): string;
	    getAddressBuffer(): Uint8Array;
	    toKey(password: string, options?: KeyOptions): Key;
	    toKeyString(password: string, options?: KeyOptions): string;
	    getUnderlyingInstance(): any;
	    static fromKey(key: Key | string, password: string, nonStrict: boolean): Account;
	    static fromAddress(address: Address): Account;
	    static createRandomAccount(): Account;
	    static isAddressValid(address: Address, type: AddressType): boolean;
	}

}
declare module 'nebulify/src/Transaction' {
	import Account from 'nebulify/src/Account';
	export default class Transaction {
	    chainId: ChainId;
	    from: Account;
	    to: Account | Address;
	    value: Value;
	    nonce: number;
	    gasPrice: number;
	    gasLimit: number;
	    gasUsed: number;
	    contractAddress: Address;
	    data: {};
	    timestamp: Timestamp;
	    private underlyingInstance;
	    constructor(chainId: ChainId, from: Account, to: Account | Address, value: Value, nonce: number, gasPrice?: number, gasLimit?: number, gasUsed?: number, contractAddress?: Address, data?: {});
	    sign(): void;
	    hash(): Uint8Array;
	    toPlainObject(): {
	        chainId: ChainId;
	        from: Address;
	        to: Address;
	        value: Value;
	        nonce: number;
	        gasPrice: number;
	        gasLimit: number;
	        contract: Contract;
	    };
	    toString(): string;
	    toProto(): Uint8Array;
	    toProtoString(): string;
	}

}
declare module 'nebulify/src/NebulasAPI' {
	import Transaction from 'nebulify/src/Transaction';
	export default class NebulasAPI {
	    private nebulasInstance;
	    private underlyingInstance;
	    constructor(nebulasInstance: any);
	    getAccountState(address: Address): Promise<AccountState>;
	    getNebState(): Promise<NebState>;
	    getLatestIrreversibleBlock(): Promise<Block>;
	    call(options: TransactionOptions): Promise<ContractCallResult>;
	    sendRawTransaction(transaction: Transaction): Promise<TransactionResult>;
	    getTransactionReceipt(txHash: Hash): Promise<TransactionReceipt>;
	    getBlockByHash(hash: Hash, fullTransactionInfo: boolean): Promise<Block>;
	    getBlockByHeight(height: number, fullTransactionInfo: boolean): Promise<Block>;
	    subscribe(event: string | string[], onDownloadProgress: (chunk: string) => void): Promise<{}>;
	    getGasPrice(): Promise<number>;
	    getDynasty(height: number): Promise<Dynasty>;
	    private parseBlock(block, fullTransactionInfo);
	}

}
declare module 'nebulify/src/Nebulas' {
	import NebulasAPI from 'nebulify/src/NebulasAPI';
	export default class Nebulas {
	    apiUrl: string;
	    private readonly underlyingInstance;
	    api: NebulasAPI;
	    constructor(apiUrl?: string);
	}

}
declare module 'nebulify/src/test' {
	export {};

}
declare module 'nebulify/index' {
	import Nebulas from 'nebulify/src/Nebulas';
	import NebulasAPI from 'nebulify/src/NebulasAPI';
	import Account from 'nebulify/src/Account';
	import Transaction from 'nebulify/src/Transaction';
	export { Nebulas, NebulasAPI, Account, Transaction };

}
interface AccountState {
  balance: Value
  nonce: number
  type: AddressType
}

interface Block {
  hash: Hash
  parentHash: Hash
  height: number
  nonce: number
  coinbase: Hash
  timestamp: Timestamp
  chainId: ChainId
  stateRootHash: Hash
  txsRootHash: Hash
  eventsRootHash: Hash
  consensusRoot: Consensus
  minerAddress: Address
  isFinality: boolean
  transactions: Transaction[]
}

interface NebState {
  chainId: ChainId
  tailHash: Hash
  libHash: Hash
  height: number
  protocolVersion: string
  isSynchronized: boolean
  version: string
}

interface Consensus {
  timestamp: Timestamp
  proposer: string
  dynastyRoot: string
}

interface Transaction {
  hash: Hash
  chainId: ChainId
  from: Address
  to: Address
  value: Value
  nonce: number
  timestamp: Timestamp
  type: string
  data: {}
  gasPrice: number
  gasLimit: number
  gasUsed: number
  contractAddress: Address
  status: Status
}

interface ContractCallResult {
  result: number,
  executionError: string,
  estimatedGas: number
}

interface Contract {
  source?: string
  sourceType?: 'js' | 'ts'
  function: string
  args: string
}

interface TransactionOptions {
  from: Address
  to: Address
  value: Value
  nonce: number
  gasPrice: number
  gasLimit: number
  contract: Contract
  binary?: string
}

interface TransactionResult {
  txHash: string,
  contractAddress?: Address
}

interface TransactionReceipt {
  hash: Hash
  chainId: number
  from: Address
  to: Address
  value: Value
  nonce: number
  timestamp: Timestamp
  type: number
  data: {}
  gasPrice: number
  gasLimit: number
  contractAddress: Address
  status: Status
  gasUsed: number
}

interface KeyOptions {
  salt: Buffer
  iv:	Buffer
  kdf:	string
  dklen: number
  c: number
  n: number
  r: number
  p: number
  cipher:	string
  uuid:	Buffer
}

interface Key {
  version: number
  id:	Buffer
  address: Address
  crypto: {}
}

interface Dynasty {
  miners: Address[]
}

type Address = string
type Hash = string
type Timestamp = string
type ChainId = number
type Value = number

type Status = Failed | Succeeded | Pending

type AddressType = NormalAddress | ContractAddress

type NormalAddress = 87
type ContractAddress = 88

type Failed = 0
type Succeeded = 1
type Pending = 2