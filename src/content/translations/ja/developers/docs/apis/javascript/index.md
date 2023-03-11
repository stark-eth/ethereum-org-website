---
title: JavaScript APIライブラリ
description: アプリケーションからブロックチェーンへやり取りできるJavaScriptクライアントライブラリの紹介。
lang: ja
---

Web アプリはイーサリアムブロックチェーンとやりとりを行うために (例えばブロックチェーンデータの読み込みやトランザクションの送信など) 、イーサリアムノードに接続する必要があります。

この目的のために、すべてのイーサリアムクライアントは[JSON-RPC](/developers/docs/apis/json-rpc/)の仕様を実装しています。そのため、アプリケーションは統一された[メソッド](/developers/docs/apis/json-rpc/#json-rpc-methods)のセットを使用できます。

JavaScript でイーサリアムノードに接続する場合、通常の JavaScript を使用することは可能です。しかし、エコシステム内には、作業をより簡単にするいくつかの便利なライブラリがあります。 これらのライブラリにより、デベロッパーは直感的な 1 行のメソッドを作成するだけで、イーサリアムとやり取りする JSON-RPC リクエストを (内部的に) 初期化できるようになります。

[マージ](/upgrades/merge/)以降は、ノードの実行には、実行クライアントとコンセンサスクライアントという 2 つのつながったイーサリアムソフトウェアが必要になることに注意してください。 必ず、ノードに実行クライアントとコンセンサスクライアントの両方が含まれるようにしてください。 ノードがローカルマシン上にない (ノードが AWS インスタンス上で動作しているなど) 場合は、適宜、チュートリアルの IP アドレスをアップデートしてください。 詳細については、[ノードの実行](/developers/docs/nodes-and-clients/run-a-node/)ページをご覧ください。

## 前提知識 {#prerequisites}

JavaScript を理解している必要があります。また、[イーサリアムスタック](/developers/docs/ethereum-stack/)と[イーサリアムクライアント](/developers/docs/nodes-and-clients/)についても理解していることが推奨されます。

## ライブラリの利点 {#why-use-a-library}

これらのライブラリにより、イーサリアムノードと直接やり取りする際の複雑さが抽象化されます。 また、ユーティリティ関数 (ETH を Gwei に変換する関数など) も提供されています。そのため、デベロッパーは複雑なイーサリアムクライアントの作業に費やす時間を削減でき、自身のアプリケーションの独自機能の開発作業に専念できます。

## ライブラリの機能 {#library-features}

### イーサリアムノードに接続 {#connect-to-ethereum-nodes}

providers ライブラリを使用することで、JSON-RPC、INFURA、Etherscan、Alchemy または MetaMask であっても、イーサリアムに接続してデータを読み取ることができます。

**Ethers.js を使った例**

```js
// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
const signer = provider.getSigner()
```

**Web3.js を使った例**

```js
var web3 = new Web3("http://localhost:8545")
// or
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

// change provider
web3.setProvider("ws://localhost:8546")
// or
web3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8546"))

// Using the IPC provider in node.js
var net = require("net")
var web3 = new Web3("/Users/myuser/Library/Ethereum/geth.ipc", net) // mac os path
// or
var web3 = new Web3(
  new Web3.providers.IpcProvider("/Users/myuser/Library/Ethereum/geth.ipc", net)
) // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

一度セットアップすると、ブロックチェーンへ以下のクエリが可能になります。

- ブロック番号
- ガスの推定値
- スマートコントラクトのイベント
- ネットワーク ID
- その他

### ウォレットの機能 {#wallet-functionality}

これらのライブラリは、ウォレットの作成、キーの管理、トランザクションへ署名を行います。

Ethers.js を使った例

```js
// Create a wallet instance from a mnemonic...
mnemonic =
  "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol"
walletMnemonic = Wallet.fromMnemonic(mnemonic)

// ...or from a private key
walletPrivateKey = new Wallet(walletMnemonic.privateKey)

walletMnemonic.address === walletPrivateKey.address
// true

// The address as a Promise per the Signer API
walletMnemonic.getAddress()
// { Promise: '0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1' }

// A Wallet address is also available synchronously
walletMnemonic.address
// '0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1'

// The internal cryptographic components
walletMnemonic.privateKey
// '0x1da6847600b0ee25e9ad9a52abbd786dd2502fa4005dd5af9310b7cc7a3b25db'
walletMnemonic.publicKey
// '0x04b9e72dfd423bcf95b3801ac93f4392be5ff22143f9980eb78b3a860c4843bfd04829ae61cdba4b3b1978ac5fc64f5cc2f4350e35a108a9c9a92a81200a60cd64'

// The wallet mnemonic
walletMnemonic.mnemonic
// {
//   locale: 'en',
//   path: 'm/44\'/60\'/0\'/0/0',
//   phrase: 'announce room limb pattern dry unit scale effort smooth jazz weasel alcohol'
// }

// Note: A wallet created with a private key does not
//       have a mnemonic (the derivation prevents it)
walletPrivateKey.mnemonic
// null

// Signing a message
walletMnemonic.signMessage("Hello World")
// { Promise: '0x14280e5885a19f60e536de50097e96e3738c7acae4e9e62d67272d794b8127d31c03d9cd59781d4ee31fb4e1b893bd9b020ec67dfa65cfb51e2bdadbb1de26d91c' }

tx = {
  to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  value: utils.parseEther("1.0"),
}

// Signing a transaction
walletMnemonic.signTransaction(tx)
// { Promise: '0xf865808080948ba1f109551bd432803012645ac136ddd64dba72880de0b6b3a7640000801ca0918e294306d177ab7bd664f5e141436563854ebe0a3e523b9690b4922bbb52b8a01181612cec9c431c4257a79b8c9f0c980a2c49bb5a0e6ac52949163eeb565dfc' }

// The connect method returns a new instance of the
// Wallet connected to a provider
wallet = walletMnemonic.connect(provider)

// Querying the network
wallet.getBalance()
// { Promise: { BigNumber: "42" } }
wallet.getTransactionCount()
// { Promise: 0 }

// Sending ether
wallet.sendTransaction(tx)
```

[全ドキュメントを読む](https://docs.ethers.io/v5/api/signer/#Wallet)

セットアップ後、以下が可能になります。

- アカウントの作成
- トランザクションの送信
- トランザクションへの署名
- 等々...

### スマートコントラクト関数とのやり取り {#interact-with-smart-contract-functions}

Javascript クライアントライブラリを使用すると、コンパイルされたコントラクトのアプリケーションバイナリインタフェース (ABI) を読み取ることによって、アプリからスマートコントラクト関数を呼び出せるようになります。

ABI には基本的に JSON 形式でコントラクトの関数が記述されており、それを通常の JavaScript オブジェクトのように使用することができます。

以下は Solidity のスマートコントラクトです:

```solidity
contract Test {
    uint a;
    address d = 0x12345678901234567890123456789012;

    function Test(uint testInt)  { a = testInt;}

    event Event(uint indexed b, bytes32 c);

    event Event2(uint indexed b, bytes32 c);

    function foo(uint b, bytes32 c) returns(address) {
        Event(b, c);
        return d;
    }
}
```

上記は次のような JSON になります:

```json
[{
    "type":"constructor",
    "payable":false,
    "stateMutability":"nonpayable"
    "inputs":[{"name":"testInt","type":"uint256"}],
  },{
    "type":"function",
    "name":"foo",
    "constant":false,
    "payable":false,
    "stateMutability":"nonpayable",
    "inputs":[{"name":"b","type":"uint256"}, {"name":"c","type":"bytes32"}],
    "outputs":[{"name":"","type":"address"}]
  },{
    "type":"event",
    "name":"Event",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"}, {"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
  },{
    "type":"event",
    "name":"Event2",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"},{"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
}]
```

次のことが可能であることを意味します:

- スマートコントラクトにトランザクションを送信し、メソッドを実行
- EVM でメソッド実行時にかかるガス代を見積もるためにコール
- コントラクトのデプロイ
- 等々...

### ユーティリティ関数 {#utility-functions}

ユーティリティ関数は、イーサリアムでの構築を少し簡単にする便利なショートカットです。

ETH の値は、デフォルトで wei に設定されています。 1 ETH は、1,000,000,000,000,000,000,000,000,000,000,000,000 wei です。つまり、非常に巨大な数値を扱っているということです。 Ether は`web3.utils.toWei`によって、wei に変換されます。

Ethers.js で記述した場合は次のようになります:

```js
// Get the balance of an account (by address or ENS name)
balance = await provider.getBalance("ethers.eth")
// { BigNumber: "2337132817842795605" }

// Often you will need to format the output for the user
// which prefer to see values in ether (instead of wei)
ethers.utils.formatEther(balance)
// '2.337132817842795605'
```

- [Web3js のユーティリティ関数](https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#)
- [Ethers のユーティリティ関数](https://docs.ethers.io/v5/api/utils/)

## 利用可能なライブラリ {#available-libraries}

**Web3.js -** **_イーサリアムの JavaScript API_**

- [ドキュメント](https://web3js.readthedocs.io/en/1.0/)
- [GitHub](https://github.com/ethereum/web3.js/)

**Ethers.js -** **_JavaScript と TypeScript での完全なイーサリアムウォレットの実装とユーティリティ_**

- [ドキュメント](https://docs.ethers.io/)
- [GitHub](https://github.com/ethers-io/ethers.js/)

**The Graph -** **_イーサリアムと IPFS のデータをインデックス化し、GraphQL を使用してクエリを実行するためのプロトコル_**

- [The Graph](https://thegraph.com/)
- [Graph Explorer](https://thegraph.com/explorer/)
- [ドキュメント](https://thegraph.com/docs/)
- [GitHub](https://github.com/graphprotocol/)
- [Discord](https://thegraph.com/discord)

**light.js -** **_ライトクライアント向けに最適化された高位のリアクティブ JS ライブラリ_**

- [GitHub](https://github.com/openethereum/js-libs/tree/master/packages/light.js)

**Web3-wrapper -** **_Typescript で記述された、Web3.js の代替ライブラリ_**

- [ドキュメント](https://0x.org/docs/web3-wrapper#introduction)
- [GitHub](https://github.com/0xProject/0x-monorepo/tree/development/packages/web3-wrapper)

**Alchemyweb3 -** **_自動リトライと強化された API を備えた、Web3.js のラッパー_**

- [ドキュメント](https://docs.alchemy.com/reference/api-overview)
- [GitHub](https://github.com/alchemyplatform/alchemy-web3)

**Alchemy NFT API -** **_所有権やメタデータ属性などの NFT データを取得するための API_**

- [ドキュメント](https://docs.alchemy.com/alchemy/enhanced-apis/nft-api)
- [GitHub](https://github.com/alchemyplatform/alchemy-web3)

## 参考文献 {#further-reading}

_役に立つコミュニティリソースをご存知の場合は、 このページを編集して追加してください。_

## 関連トピック {#related-topics}

- [ノードとクライアント](/developers/docs/nodes-and-clients/)
- [開発フレームワーク](/developers/docs/frameworks/)

## 関連チュートリアル {#related-tutorials}

- [Javascript でイーサリアムブロックチェーンを使用するための Web3js のセットアップ](/developers/tutorials/set-up-web3js-to-use-ethereum-in-javascript/) _– プロジェクトで web3.js をセットアップするための手順。_
- [JavaScript からスマートコントラクトを呼び出す](/developers/tutorials/calling-a-smart-contract-from-javascript/) _– Dai トークンを使用することで、JavaScript を使用してスマートコントラクト関数を呼び出す方法を確認できます。_
- [Web3 と Alchemy を使用してトランザクションを送信する](/developers/tutorials/sending-transactions-using-web3-and-alchemy/) _– バックエンドからトランザクションを送信するための段階的ガイド。_
