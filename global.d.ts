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