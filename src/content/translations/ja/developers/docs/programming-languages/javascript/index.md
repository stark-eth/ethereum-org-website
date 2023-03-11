---
title: JavaScriptデベロッパーのためのイーサリアム
description: JavaScriptベースのプロジェクトとツールを使ってイーサリアムの開発方法を学ぶ
lang: ja
---

JavaScript はイーサリアムのエコシステムで最も人気のある言語の 1 つです。 実際、できるだけ多くのイーサリアムの機能を JavaScript で実装することに注力している専門[チーム](https://github.com/ethereumjs)も存在しています。

[スタックのすべてのレベル](/developers/docs/ethereum-stack/)で、JavaScript (または近似の言語) で記述できる機会があります。

## イーサリアムとのやりとり {#interact-with-ethereum}

### JavaScript API ライブラリ {#javascript-api-libraries}

JavaScript でブロックチェーンへのクエリやトランザクションの送信などを行うための最も便利な方法は、[JavaScript API ライブラリ](/developers/docs/apis/javascript/)を使用することです。 このライブラリの API を使用すると、デベロッパーは[イーサリアムネットワークのノード](/developers/docs/nodes-and-clients/)と簡単にやり取りできます。

このライブラリにより、イーサリアム上のスマートコントラクトとやり取りできるようになります。そのため、JavaScript のみで既存のコントラクトとやり取りできる dapp を構築することが可能になります。

**以下をご参照ください。**

- [Web3.js](https://web3js.readthedocs.io/)
- [Ethers.js](https://docs.ethers.io/) - _JavaScript と TypeScript での完全なイーサリアムウォレットの実装とユーティリティを含む_

### スマートコントラクト {#smart-contracts}

独自のスマートコントラクトを作成したいと考えている JavaScript デベロッパーは、[Solidity](https://solidity.readthedocs.io)について熟知することをお勧めします。 これは最も人気のあるスマートコントラクト言語であり、構文的には JavaScript に似ているため、比較的簡単に習得できる可能性があります。

詳細については、[スマートコントラクト](/developers/docs/smart-contracts/)をご確認ください。

## プロトコルの理解 {#understand-the-protocol}

### イーサリアム仮想マシン {#the-ethereum-virtual-machine}

[イーサリアム仮想マシン](/developers/docs/evm/)の JavaScript 実装を利用できます。 これは、最新のフォークルールをサポートしています。 フォークルールとは、計画されたアップグレードの結果として EVM に加えられた変更のことです。

イーサリアム仮想マシンは、さまざまな JavaScript パッケージに分かれています。これらのパッケージを調べることで、以下の項目について理解を深めることができます。

- アカウント
- ブロック
- ブロックチェーン自体
- トランザクション
- その他

これにより、アカウントのデータ構造などについて理解できるようになります。

コードを読みたい場合は、イーサリアムドキュメントを通読するよりも、上記の JavaScript のほうが役立ちます。

**モノリポを調べる**  
[`ethereumjs`](https://github.com/ethereumjs/ethereumjs-vm)

### ノードとクライアント {#nodes-and-clients}

開発中の Ethereumjs クライアントを利用できます。 これにより、理解できる言語でイーサリアムクライアントの動作について詳細に調査できます。

**クライアントを調べる**  
[`ethereumjs`](https://github.com/ethereumjs/ethereumjs-client)

## 他のプロジェクト {#other-projects}

イーサリアムの JavaScript 界隈では、その他にも、以下を含めた多くのプロジェクトが進められています。

- ウォレットユーティリティのライブラリ
- イーサリアムのキーを生成、インポート、エクスポートするためのツール
- `merkle-patricia-tree`の実装 - イーサリアムの技術仕様書で概説されているデータ構造

[EthereumJS リポジトリ](https://github.com/ethereumjs)で、最も興味があるものについて詳細に調査してみてください。

## 参考文献 {#further-reading}

_役に立つコミュニティリソースをご存知の場合は、 このページを編集して追加してください。_
