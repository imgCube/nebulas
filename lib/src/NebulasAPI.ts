import Transaction from "./Transaction"

export default class NebulasAPI {
  private underlyingInstance: any

  constructor(private nebulasInstance: any) {
    this.underlyingInstance = nebulasInstance.api
  }

  getAccountState(address: Address): Promise<AccountState> {
    return new Promise<AccountState>((resolve, reject) => {
      this.underlyingInstance.getAccountState(address).then((state) => {
        resolve({
          balance: parseInt(state.balance),
          nonce: parseInt(state.nonce),
          type: state.type
        } as AccountState)
      }).catch((error) => reject(error))
    })
  }

  getNebState(): Promise<NebState> {
    return new Promise<NebState>((resolve, reject) => {
      this.underlyingInstance.getNebState().then((state) => {
        resolve({
          chainId: state.chain_id,
          tailHash: state.tail,
          libHash: state.lib,
          height: parseInt(state.height),
          protocolVersion: state.protocolVersion,
          isSynchronized: state.synchronized,
          version: state.version
        } as NebState)
      }).catch((error) => reject(error))
    })
  };

  getLatestIrreversibleBlock(): Promise<Block> {
    return new Promise<Block>((resolve, reject) => {
      this.underlyingInstance.latestIrreversibleBlock().then((block) => {
        resolve(this.parseBlock(block, true))
      }).catch((error) => reject(error))
    })
  }

  call(options: TransactionOptions): Promise<ContractCallResult> {
    return new Promise<ContractCallResult>((resolve, reject) => {
      this.underlyingInstance.call(options).then((result) => {
        resolve({
          result: parseInt(result.result),
          executionError: result.execute_err,
          estimatedGas: parseInt(result.estimate_gas)
        } as ContractCallResult)
      }).catch((error) => reject(error))
    })
  }

  sendRawTransaction(transaction: Transaction): Promise<TransactionResult> {
    return new Promise<TransactionResult>((resolve, reject) => {
      this.underlyingInstance.sendRawTransaction({
        data: transaction.toProtoString()
      }).then((result) => {
        resolve({
          txHash: result.txhash,
          contractAddress: result.contractAddress || null
        } as TransactionResult)
      }).catch((error) => reject(error))
    })
  }

  getTransactionReceipt(txHash: Hash): Promise<TransactionReceipt> {
    return new Promise<TransactionReceipt>((resolve, reject) => {
      this.underlyingInstance.getTransactionReceipt(txHash).then((result) => {
        resolve({
          hash: result.hash,
          chainId: result.chainId,
          from: result.from,
          to: result.to,
          value: parseInt(result.value),
          nonce: result.nonce,
          timestamp: result.timestamp,
          type: result.type,
          data: result.data,
          gasPrice: parseInt(result.gas_price),
          gasLimit: parseInt(result.gas_limit),
          gasUsed: parseInt(result.gas_used),
          contractAddress: result.contract_address,
          status: result.status
        } as TransactionReceipt)
      }).catch((error) => reject(error))
    })
  }

  getBlockByHash(hash: Hash, fullTransactionInfo: boolean): Promise<Block> {
    return new Promise<Block>((resolve, reject) => {
      this.underlyingInstance.getBlockByHash(hash, fullTransactionInfo).then((block) => {
        resolve(this.parseBlock(block, fullTransactionInfo))
      }).catch((error) => reject(error))
    })
  }

  getBlockByHeight(height: number, fullTransactionInfo: boolean): Promise<Block> {
    return new Promise<Block>((resolve, reject) => {
      this.underlyingInstance.getBlockByHeight(height, fullTransactionInfo).then((block) => {
        resolve(this.parseBlock(block, fullTransactionInfo))
      }).catch((error) => reject(error))
    })
  }

  subscribe(event: string | string[], onDownloadProgress: (chunk: string) => void): Promise<{}> {
    return this.underlyingInstance.subscribe(event, onDownloadProgress)
  }

  getGasPrice(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.underlyingInstance.gasPrice().then((price) => {
        resolve(parseInt(price.gas_price))
      }).catch((error) => reject(error))
    })
  }

  getDynasty(height: number): Promise<Dynasty> {
    return this.underlyingInstance.getDynasty(height)
  }

  private parseBlock(block, fullTransactionInfo: boolean): Block {
    return {
      hash: block.hash,
      parentHash: block.parent_hash,
      height: parseInt(block.height),
      nonce: parseInt(block.nonce),
      coinbase: block.coinbase,
      timestamp: block.timestamp,
      chainId: block.chain_id,
      stateRootHash: block.state_root,
      txsRootHash: block.txs_root,
      eventsRootHash: block.eventsRoot,
      consensusRoot: block.consensus_root,
      minerAddress: block.miner,
      isFinality: block.is_finality,
      transactions: (block.transactions || []).map((transaction) => {
        if (fullTransactionInfo) {
          return {
            hash: transaction.hash,
            chainId: transaction.chainId,
            from: transaction.from,
            to: transaction.to,
            value: parseInt(transaction.value),
            nonce: parseInt(transaction.nonce),
            timestamp: transaction.timestamp,
            data: transaction.data,
            gasPrice: parseInt(transaction.gas_price),
            gasLimit: parseInt(transaction.gas_limit),
            gasUsed: parseInt(transaction.gas_used),
            contractAddress: transaction.contractAddress,
          } as Partial<Transaction>
        } else {
          return {
            hash: transaction.hash
          } as Partial<Transaction>
        }
      })
    } as Block
  }
}