---
title: API di JSON-RPC
description: Un protocollo di chiamata della procedura remota (RPC) leggero e privo di stato per i client di Ethereum.
lang: it
---

Affinché un'applicazione software interagisca con la blockchain di Ethereum, leggendo i dati della blockchain o inviando transazioni alla rete, deve connettersi a un nodo di Ethereum.

A tale scopo, ogni [client di Ethereum](/developers/docs/nodes-and-clients/#execution-clients) implementa una [specifica JSON-RPC](https://github.com/ethereum/execution-apis), in modo che sia disponibile un insieme di metodi uniformi a cui possono affidarsi le applicazioni, indipendentemente dal nodo specifico o dall'implementazione del client.

[JSON-RPC](https://www.jsonrpc.org/specification) è un protocollo di chiamata a procedura remota (RPC) leggero e privo di stato. Definisce diverse strutture di dati e le regole per la loro elaborazione. È indipendente dal trasporto, poiché i concetti sono utilizzabili entro lo stesso processo, su prese, via HTTP o in svariati ambienti di passaggio dei messaggi. Usa JSON (RFC 4627) come formato dei dati.

## Implementazioni del client {#client-implementations}

I client di Ethereum possono usare linguaggi di programmazione diversi per l'implementazione della specifica di JSON-RPC. Visualizza la [documentazione dei singoli client](/developers/docs/nodes-and-clients/#execution-clients) per ulteriori dettagli sui linguaggi di programmazione specifici. Consigliamo di consultare la documentazione di ogni client per le informazioni più aggiornate sul supporto dell'API.

## Librerie utili {#convenience-libraries}

Anche se è possibile scegliere di interagire direttamente con i client di Ethereum tramite l'API di JSON-RPC, spesso esistono opzioni più semplici per gli sviluppatori di dApp. Esistono molte librerie di [JavaScript](/developers/docs/apis/javascript/#available-libraries) e dell'[API del backend](/developers/docs/apis/backend/#available-libraries) che forniscono wrapper sull'API di JSON-RPC. Con queste librerie, gli sviluppatori possono scrivere metodi intuitivi di una riga nel linguaggio di programmazione di loro scelta per inizializzare le richieste di JSON-RPC (sottostanti) che interagiscono con Ethereum.

## API del client di consenso {#consensus-clients}

Questa pagina tratta principalmente dell'API di JSON-RPC usata dai client di esecuzione di Ethereum. Tuttavia, anche i client del consenso hanno un'API RPC che consente agli utenti di interrogare le informazioni sul nodo, richiedere blocchi della Beacon, lo stato della Beacon e altre informazioni correlate al consenso, direttamente da un nodo. Questa API è documentata sulla [pagina web dell'API Beacon](https://ethereum.github.io/beacon-APIs/#/).

Inoltre, un'API interna viene usata per la comunicazione tra client in un nodo, ovvero consente al client di consenso e al client di esecuzione di scambiarsi dati. Questa è detta "Engine API" e le specifiche sono disponibili su [GitHub](https://github.com/ethereum/execution-apis/blob/main/src/engine/common.md).

## Specifiche del client di esecuzione {#spec}

[Leggi le specifiche complete dell'API JSON-RPC su GitHub](https://github.com/ethereum/execution-apis).

## Convenzioni {#conventions}

### Codifica del valore esadecimale {#hex-encoding}

Su JSON vengono passati due tipi di dati chiave: insiemi di byte non formattati e quantità. Entrambi vengono passati con una codifica esadecimale, ma con requisiti di formattazione differenti.

#### Quantità {#quantities-encoding}

Per la codifica delle quantità (interi, numeri): codifica come esadecimali, prefisso "0x", la rappresentazione più compatta (lieve eccezione: zero dovrebbe essere rappresentato come "0x0").

Ecco alcuni esempi:

- 0x41 (65 in decimale)
- 0x400 (1024 in decimale)
- ERRATO: 0x (dovrebbe sempre avere almeno una cifra: zero è "0x0")
- ERRATO: 0x0400 (nessuno zero iniziale consentito)
- ERRATO: ff (deve avere il prefisso 0x)

### Dati non formattati {#unformatted-data-encoding}

Codificando i dati non formattati (insiemi di dati, indirizzi dei conti, hash, insiemi di bytecode): codifica come esadecimali, prefisso "0x", due cifre esadecimali per byte.

Ecco alcuni esempi:

- 0x41 (dimensione 1, "A")
- 0x004200 (dimensione 3, "\0B\0")
- 0x (dimensione 0, "")
- ERRATO: 0xf0f0f (dev'essere un numero di cifre pari)
- ERRATO: 004200 (deve avere il prefisso 0x)

### Il parametro del blocco predefinito {#default-block}

I seguenti metodi hanno un parametro del blocco predefinito aggiuntivo:

- [eth_getBalance](#eth_getbalance)
- [eth_getCode](#eth_getcode)
- [eth_getTransactionCount](#eth_gettransactioncount)
- [eth_getStorageAt](#eth_getstorageat)
- [eth_call](#eth_call)

Quando sono effettuate richieste che agiscono sullo stato di Ethereum, il parametro dell'ultimo blocco predefinito determina l'altezza del blocco.

Le seguenti opzioni sono possibili per il parametro defaultBlock:

- `HEX String` - un numero intero del blocco
- `String "earliest"` per il primo blocco o quello di genesi
- `String "latest"` - per l'ultimo blocco estratto
- `String "pending"` - per lo stato/le transazioni in sospeso

## Esempi

Su questa pagina forniamo esempi su come usare gli endpoint individuali dell'API JSON_RPC usando lo strumento della riga di comando, [curl](https://curl.se). Questi esempi di endpoint individuali si trovano di seguito nella sezione [esempi di Curl](#curl-examples). In seguito nella pagina, forniamo anche un [esempio completo](#usage-example) per la compilazione e la distribuzione di un contratto intelligente usando un nodo di Geth, l'API JSON_RPC e curl.

## Esempi di Curl {#curl-examples}

Di seguito sono riportati esempi dell'uso dell'API di JSON_RPC effettuando richieste di [curl](https://curl.se) a un nodo di Ethereum. Ogni esempio include una descrizione dell'endpoint specifico, i suoi parametri, il tipo di restituzione e un esempio definito di come dovrebbe essere utilizzato.

Le richieste di curl potrebbero restituire un messaggio d'errore correlato al tipo di contenuto. Ciò avviene perché l'opzione `--data` imposta il tipo di contenuto su `application/x-www-form-urlencoded`. Se il tuo nodo se ne lamenta, imposta manualmente l'intestazione posizionando `-H "Content-Type: application/json"` all'inizio della chiamata. Gli esempi, inoltre, non includono la combinazione di URL/IP e porta, che deve essere l'ultimo argomento fornito al curl (ad es. `127.0.0.1:8545`). Una richiesta di curl completa, comprensiva di questi dati aggiuntivi, assume la seguente forma:

```shell
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' 127.0.0.1:8545
```

## Gossip, Stato, Storico {#gossip-state-history}

Alcuni metodi base del protocollo JSON-RPC richiedono dati dalla rete di Ethereum e rientrano in tre importanti categorie:_Gossip, Stato e Storico_. Usa i collegamenti in questa sezione per passare da un metodo all'altro oppure usa la tabella di contenuti per esplorare l'intera lista di metodi.

### Metodi di Gossip {#gossip-methods}

> Questi metodi tracciano la testa della catena. Ecco come le transazioni si fanno strada all'interno della rete ed entrano nei blocchi e come i Client fanno ricerche sui nuovi blocchi.

- [eth_blockNumber](#eth_blocknumber)
- [eth_sendRawTransaction](#eth_sendrawtransaction)

### Metodi di Stato {#state_methods}

> Metodi che indicano lo stato corrente di tutti i dati immagazzinati. Lo "stato" è come una grande porzione di RAM condivisa, che include i saldi dei conti, i dati dei contratti e le stime del gas.

- [eth_getBalance](#eth_getbalance)
- [eth_getStorageAt](#eth_getstorageat)
- [eth_getTransactionCount](#eth_gettransactioncount)
- [eth_getCode](#eth_getcode)
- [eth_call](#eth_call)
- [eth_estimateGas](#eth_estimategas)

### Metodi dello Storico {#history_methods}

> Recupera lo storico dei record di ogni blocco fino alla genesi. Può essere paragonato a un grande file Append-Only contenente tutte le intestazioni del blocco, i corpi del blocco, i blocchi ommer (zio) e le ricevute delle transazioni.

- [eth_getBlockTransactionCountByHash](#eth_getblocktransactioncountbyhash)
- [eth_getBlockTransactionCountByNumber](#eth_getblocktransactioncountbynumber)
- [eth_getUncleCountByBlockHash](#eth_getunclecountbyblockhash)
- [eth_getUncleCountByBlockNumber](#eth_getunclecountbyblocknumber)
- [eth_getBlockByHash](#eth_getblockbyhash)
- [eth_getBlockByNumber](#eth_getblockbynumber)
- [eth_getTransactionByHash](#eth_gettransactionbyhash)
- [eth_getTransactionByBlockHashAndIndex](#eth_gettransactionbyblockhashandindex)
- [eth_getTransactionByBlockNumberAndIndex](#eth_gettransactionbyblocknumberandindex)
- [eth_getTransactionReceipt](#eth_gettransactionreceipt)
- [eth_getUncleByBlockHashAndIndex](#eth_getunclebyblockhashandindex)
- [eth_getUncleByBlockNumberAndIndex](#eth_getunclebyblocknumberandindex)

## I metodi dell'API JSON-RPC {#json-rpc-methods}

### web3_clientVersion {#web3_clientversion}

Restituisce la versione del client corrente.

**Parametri**

Nessuno

**Restituisce**

`String` - La versione del client corrente

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc":"2.0",
  "result": "Mist/v0.9.3/darwin/go1.4.1"
}
```

### web3_sha3 {#web3_sha3}

Restituisce Keccak-256 (_non_ lo SHA3-256 standardizzato) dei dati forniti.

**Parametri**

1. `DATA` - I dati da convertire in un hash SHA3

```js
params: ["0x68656c6c6f20776f726c64"]
```

**Restituisce**

`DATA` - Il risultato di SHA3 della stringa data.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_sha3","params":["0x68656c6c6f20776f726c64"],"id":64}'
// Result
{
  "id":64,
  "jsonrpc": "2.0",
  "result": "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad"
}
```

### net_version {#net_version}

Restituisce l'id di rete corrente.

**Parametri**

Nessuno

**Restituisce**

`String` - L'id di rete corrente.

L'elenco completo degli ID di rete correnti è disponibile su [chainlist.org](https://chainlist.org). Alcuni ID comuni sono: `1`: Mainnet di Ethereum `2`: Testnet di Morden (ora deprecata) `3`: Testnet di Ropsten `4`: Testnet di Rinkeby `5`: Testnet di Goerli

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc": "2.0",
  "result": "3"
}
```

### net_listening {#net_listening}

Restituisce `true` se il client sta ascoltando attivamente le connessioni di rete.

**Parametri**

Nessuno

**Restituisce**

`Boolean` - `true` quando è in ascolto, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_listening","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc":"2.0",
  "result":true
}
```

### net_peerCount {#net_peercount}

Restituisce il numero di pari attualmente connessi al client.

**Parametri**

Nessuno

**Restituisce**

`QUANTITY` - intero del numero di pari connessi.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}'
// Result
{
  "id":74,
  "jsonrpc": "2.0",
  "result": "0x2" // 2
}
```

### eth_protocolVersion {#eth_protocolversion}

Restituisce la versione del protocollo di Ethereum corrente.

**Parametri**

Nessuno

**Restituisce**

`String` - La versione del protocollo di Ethereum corrente

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_protocolVersion","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc": "2.0",
  "result": "54"
}
```

### eth_syncing {#eth_syncing}

Restituisce un oggetto con i dati sullo stato di sincronizzazione o `false`.

**Parametri**

Nessuno

**Restituisce**

`Object|Boolean`, Un oggetto con i dati dello stato di sincronizzazione o `FALSE`, quando non è in sincronizzazione:

- `startingBlock`: `QUANTITY` - Il blocco in cui è iniziata l'importazione (si ripristina soltanto dopo che la sincronizzazione ha raggiunto la sua testa)
- `currentBlock`: `QUANTITY` - Il blocco corrente, uguale a eth_blockNumber
- `highestBlock`: `QUANTITY` - Il blocco più alto stimato

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": {
    startingBlock: '0x384',
    currentBlock: '0x386',
    highestBlock: '0x454'
  }
}
// Or when not syncing
{
  "id":1,
  "jsonrpc": "2.0",
  "result": false
}
```

### eth_coinbase {#eth_coinbase}

Restituisce l'indirizzo di coinbase del client.

**Parametri**

Nessuno

**Restituisce**

`DATA`, 20 byte; l'indirizzo di coinbase corrente.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_coinbase","params":[],"id":64}'
// Result
{
  "id":64,
  "jsonrpc": "2.0",
  "result": "0x407d73d8a49eeb85d32cf465507dd71d507100c1"
}
```

### eth_mining {#eth_mining}

Restituisce `true` se il client sta minando attivamente i nuovi blocchi.

**Parametri**

Nessuno

**Restituisce**

`Boolean` - restituisce `true` se il client sta minando, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":71}'
//
{
  "id":71,
  "jsonrpc": "2.0",
  "result": true
}
```

### eth_hashrate {#eth_hashrate}

Restituisce il numero di hash al secondo con cui il nodo sta minando.

**Parametri**

Nessuno

**Restituisce**

`QUANTITY` - numero di hash al secondo.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_hashrate","params":[],"id":71}'
// Result
{
  "id":71,
  "jsonrpc": "2.0",
  "result": "0x38a"
}
```

### eth_gasPrice {#eth_gasprice}

Restituisce il prezzo corrente del gas in wei.

**Parametri**

Nessuno

**Restituisce**

`QUANTITY`: intero del prezzo corrente del gas in wei.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":73}'
// Result
{
  "id":73,
  "jsonrpc": "2.0",
  "result": "0x1dfd14000" // 8049999872 Wei
}
```

### eth_accounts {#eth_accounts}

Restituisce un elenco di indirizzi posseduti dal client.

**Parametri**

Nessuno

**Restituisce**

`Array of DATA`, 20 Byte; indirizzi posseduti dal client.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]
}
```

### eth_blockNumber {#eth_blocknumber}

Restituisce il numero del blocco più recente.

**Parametri**

Nessuno

**Restituisce**

`QUANTITY` - Intero del numero di blocco corrente su cui è attivo il client.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
// Result
{
  "id":83,
  "jsonrpc": "2.0",
  "result": "0x4b7" // 1207
}
```

### eth_getBalance {#eth_getbalance}

Restituisce il saldo del conto dell'indirizzo dato.

**Parametri**

1. `DATA`, 20 Byte - indirizzo per controllare il saldo.
2. `QUANTITY|TAG` - numero intero del blocco o della stringa `"latest"`, `"earliest"` or `"pending"`, vedi il [parametro del blocco predefinito](/developers/docs/apis/json-rpc/#default-block-parameter)

```js
params: ["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"]
```

**Restituisce**

`QUANTITY` - intero del saldo corrente in wei.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x0234c8a3397aab58" // 158972490234375000
}
```

### eth_getStorageAt {#eth_getstorageat}

Restituisce il valore da una posizione di archiviazione a un dato indirizzo.

**Parametri**

1. `DATA`, 20 Bytes - Indirizzo di archiviazione.
2. `QUANTITY` - Intero nella posizione di archiviazione.
3. `QUANTITY|TAG` - Numero di blocco intero o stringa`"latest"`, `"earliest"` o `"pending"`. Vedi il [parametro di blocco predefinito](/developers/docs/apis/json-rpc/#default-block-parameter)

**Restituisce**

`DATA` - Il valore in questa posizione di archiviazione.

**Esempio** Il calcolo della posizione corretta dipende dalla memoria da recuperare. Considera il seguente contratto, distribuito su `0x295a70b2de5e3953354a6a8344e616ed314d7251` dall'indirizzo `0x391694e7e0b0cce554cb130d723a9d27458f9298`.

```
contract Storage {
    uint pos0;
    mapping(address => uint) pos1;
    function Storage() {
        pos0 = 1234;
        pos1[msg.sender] = 5678;
    }
}
```

Recuperare il valore di pos0 è semplice:

```js
curl -X POST --data '{"jsonrpc":"2.0", "method": "eth_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x0", "latest"], "id": 1}' localhost:8545
{"jsonrpc":"2.0","id":1,"result":"0x00000000000000000000000000000000000000000000000000000000000004d2"}
```

Recuperare un elemento della mappa è più difficile. La posizione di un elemento nella mappa è calcolata con:

```js
keccack(LeftPad32(key, 0), LeftPad32(map position, 0))
```

Ciò significa che per recuperare lo storage su pos1["0x391694e7e0b0cce554cb130d723a9d27458f9298"] dobbiamo calcolare la posizione con:

```js
keccak(
  decodeHex(
    "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" +
      "0000000000000000000000000000000000000000000000000000000000000001"
  )
)
```

La console geth che viene fornita con la libreria web3 può essere utilizzata per effettuare il calcolo:

```js
> var key = "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" + "0000000000000000000000000000000000000000000000000000000000000001"
undefined
> web3.sha3(key, {"encoding": "hex"})
"0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9"
```

A questo punto, per recuperare lo spazio di archiviazione:

```js
curl -X POST --data '{"jsonrpc":"2.0", "method": "eth_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9", "latest"], "id": 1}' localhost:8545
{"jsonrpc":"2.0","id":1,"result":"0x000000000000000000000000000000000000000000000000000000000000162e"}
```

### eth_getTransactionCount {#eth_gettransactioncount}

Restituisce il numero di transazioni _inviate_ da un'indirizzo.

**Parametri**

1. `DATA`, 20 Bytes - indirizzo.
2. `QUANTITY|TAG` - numero intero del blocco o stringa `"latest"`, `"earliest"` o `"pending"`. Vedi il [parametro del blocco predefinito](/developers/docs/apis/json-rpc/#default-block-parameter)

```js
params: [
  "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
  "latest", // state at the latest block
]
```

**Restituisce**

`QUANTITY` - Intero del numero di transazioni inviate da questo indirizzo.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0x407d73d8a49eeb85d32cf465507dd71d507100c1","latest"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
```

### eth_getBlockTransactionCountByHash {#eth_getblocktransactioncountbyhash}

Restituisce il numero di transazioni in un blocco da un blocco corrispondente al dato hash del blocco.

**Parametri**

1. `DATA`, 32 Byte - hash di un blocco

```js
params: ["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"]
```

**Restituisce**

`QUANTITY` - intero del numero di transazioni in questo blocco.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByHash","params":["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xb" // 11
}
```

### eth_getBlockTransactionCountByNumber {#eth_getblocktransactioncountbynumber}

Restituisce il numero di transazioni in un blocco corrispondente al numero di blocco specificato.

**Parametri**

1. `QUANTITY|TAG` - numero intero del blocco o stringa `"latest"`, `"earliest"` o `"pending"`. Vedi il [parametro del blocco predefinito](/developers/docs/apis/json-rpc/#default-block-parameter).

```js
params: [
  "0xe8", // 232
]
```

**Restituisce**

`QUANTITY` - Intero del numero di transazioni in questo blocco.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByNumber","params":["0xe8"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xa" // 10
}
```

### eth_getUncleCountByBlockHash {#eth_getunclecountbyblockhash}

Restituisce il numero di ommer in un blocco da un blocco corrispondente all'hash del blocco specificato.

**Parametri**

1. `DATA`, 32 Bytes - Hash di un blocco

```js
params: ["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"]
```

**Restituisce**

`QUANTITY` - Il numero intero di ommer in questo blocco.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockHash","params":["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
```

### eth_getUncleCountByBlockNumber {#eth_getunclecountbyblocknumber}

Restituisce il numero di ommer in un blocco da un blocco che corrisponde all'hash del blocco specificato.

**Parametri**

1. `QUANTITY|TAG` - Intero del numero di blocco o stringa "latest", "earliest" o "pending". Vedere il [parametro predefinito del blocco](/developers/docs/apis/json-rpc/#default-block-parameter)

```js
params: [
  "0xe8", // 232
]
```

**Restituisce**

`QUANTITY` - Il numero intero di ommer in questo blocco.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockNumber","params":["0xe8"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
```

### eth_getCode {#eth_getcode}

Restituisce il codice ad un indirizzo specificato.

**Parametri**

1. `DATA`, 20 Bytes - indirizzo
2. `QUANTITY|TAG` - numero intero del blocco o la stringa `"latest"`, `"earliest"` o `"pending"`. Vedere il [parametro del blocco predefinito](/developers/docs/apis/json-rpc/#default-block-parameter)

```js
params: [
  "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "0x2", // 2
]
```

**Restituisce**

`DATI` - il codice dall'indirizzo specificato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", "0x2"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
}
```

### eth_sign {#eth_sign}

Il metodo della firma calcola una firma specifica di Ethereum con: `sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)))`.

Aggiungendo un prefisso al messaggio si rende la firma calcolata riconoscibile come firma specifica di Ethereum. Ciò impedisce l'uso improprio in cui una dapp malevola può firmare i dati arbitrari (es. la transazione) e usare la firma per impersonare la vittima.

Nota: l'indirizzo con cui firmare deve essere sbloccato.

**Parametri**

1. `DATA`, 20 Bytes - indirizzo
2. `DATI`, N Byte - messaggio da firmare

**Restituisce**

`DATI`: Firma

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sign","params":["0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", "0xdeadbeaf"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}
```

### eth_signTransaction {#eth_signtransaction}

Firma una transazione che può essere inviata alla rete in un secondo momento utilizzando [eth_sendRawTransaction](#eth_sendrawtransaction).

**Parametri**

1. `Oggetto` - L'oggetto della transazione

- `from`: `DATI`, 20 Bytes - L'indirizzo da cui viene inviata la transazione.
- `to`: `DATI`, 20 Bytes - (opzionale quando si crea un nuovo contratto) L'indirizzo a cui è indirizzata la transazione.
- `gas`: `QUANTITÀ`: (facoltativo, predefinito: 90000) Intero del gas fornito per l'esecuzione della transazione. Restituirà il gas inutilizzato.
- `gasPrice`: `QUANTITY`: (facoltativo, predefinito: To-Be-Determined) Intero del gasPrice usato per ogni gas pagato, in Wei.
- `value`: `QUANTITÀ` - (opzionale) Intero del valore inviato con questa transazione, in Wei.
- `data`: `DATI` - Il codice compilato di un contratto OPPURE l'hash della firma del metodo richiamato e i parametri codificati.
- `nonce`: `QUANTITÀ` - (opzionale) Intero di una nonce. Ciò permette di sovrascrivere le proprie transazioni in sospeso che utilizzano la stessa nonce.

**Restituisce**

`DATI`, L'oggetto della transazione firmato.

**Esempio**

```js
// Request
curl -X POST --data '{"id": 1,"jsonrpc": "2.0","method": "eth_signTransaction","params": [{"data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675","from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155","gas": "0x76c0","gasPrice": "0x9184e72a000","to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567","value": "0x9184e72a"}]}'
// Result
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}
```

### eth_sendTransaction {#eth_sendtransaction}

Se il campo dati contiene il codice, crea una nuova transazione via messaggio o la stipula di un contratto.

**Parametri**

1. `Oggetto` - L'oggetto della transazione

- `from`: `DATI`, 20 Bytes - L'indirizzo da cui viene inviata la transazione.
- `to`: `DATI`, 20 Bytes - (opzionale quando si crea un nuovo contratto) L'indirizzo a cui è indirizzata la transazione.
- `gas`: `QUANTITY`: (facoltativo, prededfinito: 90000) Intero del gas fornito per l'esecuzione della transazione. Restituirà il gas inutilizzato.
- `gasPrice`: `QUANTITY`: (facoltativo, predefinito: To-Be-Determined) Intero del gasPrice usato per ogni gas pagato.
- `value`: `QUANTITÀ` - (opzionale) Intero del valore inviato con questa transazione, in Wei.
- `data`: `DATI` - Il codice compilato di un contratto OPPURE l'hash della firma del metodo richiamato e i parametri codificati.
- `nonce`: `QUANTITÀ` - (opzionale) Intero di una nonce. Questo permette di sovrascrivere le tue transazioni in sospeso che utilizzano la stessa nonce.

```js
params: [
  {
    from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    gas: "0x76c0", // 30400
    gasPrice: "0x9184e72a000", // 10000000000000
    value: "0x9184e72a", // 2441406250
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  },
]
```

**Restituisce**

`DATI`, 32 Bytes - l'hash della transazione, o l'hash zero se la transazione non è ancora disponibile.

Usa [eth_getTransactionReceipt](#eth_gettransactionreceipt) quando hai creato un contratto per ottenere l'indirizzo del contratto, dopo che la transazione è stata minata.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```

### eth_sendRawTransaction {#eth_sendrawtransaction}

Se il campo dati contiene il codice, crea una nuova transazione via messaggio o la stipula di un contratto,.

**Parametri**

1. `DATA`, L'oggetto transazione firmato.

```js
params: [
  "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
]
```

**Restituisce**

`DATI`, 32 Bytes - l'hash della transazione, o l'hash zero se la transazione non è ancora disponibile.

Usa [eth_getTransactionReceipt](#eth_gettransactionreceipt) quando hai creato un contratto per ottenere l'indirizzo del contratto, dopo che la transazione è stata minata.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```

### eth_call {#eth_call}

Esegue immediatamente un nuovo messaggio di chiamata senza creare una transazione nella catena di blocchi.

**Parametri**

1. `Oggetto` - L'oggetto della chiamata della transazione

- `from`: `DATA`, 20 Bytes - (opzionale) L'indirizzo da cui viene inviata la transazione.
- `to`: `DATA`, 20 Bytes - L'indirizzo a cui è indirizzata la transazione.
- `gas`: `QUANTITY`: (facoltativo) Intero del gas fornito per l'esecuzione della transazione. eth_call consuma zero gas, ma questo parametro potrebbe essere necessario per alcune esecuzioni.
- `gasPrice`: `QUANTITY`: (facoltativo) Intero del gasPrice usato per ogni gas pagato
- `value`: `QUANTITY` - (opzionale) Intero del valore inviato con questa transazione
- `data`: `DATA` - (opzionale) Hash del metodo di firma e dei parametri codificati. Per maggiori dettagli consulta [Ethereum Contract ABI nella documentazione di Solidity](https://docs.soliditylang.org/en/latest/abi-spec.html)

2. `QUANTITY|TAG` - numero intero del blocco o stringa `"latest"`, `"earliest"` o `"pending"`. Vedere il [parametro predefinito del blocco](/developers/docs/apis/json-rpc/#default-block-parameter)

**Restituisce**

`DATA` - Il valore di ritorno del contratto eseguito.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x"
}
```

### eth_estimateGas {#eth_estimategas}

Genera e restituisce una stima di quanto gas è necessario per consentire il completamento della transazione. La transazione non verrà aggiunta alla blockchain. Nota che la stima potrebbe esser significativamente superiore all'importo di gas effettivamente usato dall'operazione, per vari motivi, incluse le meccaniche dell'EVM e le prestazioni del nodo.

**Parametri**

Vedi i parametri [eth_call](#eth_call), tutte le proprietà dovrebbero essere opzionali. Se non è specificato alcun limite di gas, geth usa il limite di gas del blocco dal blocco in sospeso come limite massimo. Di conseguenza, la stima restituita potrebbe non esser sufficiente per eseguire la chiamata/transazione quando l'importo di gas è maggiore del limite di gas del blocco.

**Restituisce**

`QUANTITY`: l'importo di gas utilizzato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x5208" // 21000
}
```

### eth_getBlockByHash {#eth_getblockbyhash}

Restituisce informazioni su un blocco tramite hash.

**Parametri**

1. `DATA`, 32 Byte - Hash di un blocco.
2. `Boolean` - Se `true` restituisce gli oggetti di transazione completi, se `falso` solo gli hash delle transazioni.

```js
params: [
  "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
  false,
]
```

**Restituisce**

`Oggetto` - Un oggetto blocco, o `null` quando non viene trovato alcun blocco:

- `number`: `QUANTITY` - il numero di blocco. `null` quando è in attesa del blocco.
- `hash`: `DATA`, 32 Bytes - hash del blocco. `null` quando è in attesa del blocco.
- `hash`: `DATA`, 32 Bytes - hash del blocco padre.
- `nonce`: `DATA`, 8 Bytes - hash del proof-of-work generato. `null` quando è in attesa del blocco.
- `sha3Uncles`: `DATA`, 32 Bytes - SHA3 dei dati ommer del blocco.
- `logsBloom`: `DATA`, 256 Bytes - il Bloom Filter per i registri del blocco. `null` quando è in attesa del blocco.
- `transactionsRoot`: `DATA`, 32 Bytes - la radice dell'albero delle transazioni del blocco.
- `stateRoot`: `DATA`, 32 Bytes - la radice dell'albero di stato finale del blocco.
- `receiptsRoot`: `DATI`, 32 Bytes - la radice dell'albero delle ricevute del blocco.
- `miner`: `DATI`, 20 Bytes - l'indirizzo del beneficiario a cui sono state fornite le ricompense di mining.
- `difficoltà`: `QUANTITÀ` - intero della difficoltà per questo blocco.
- `totalDifficulty`: `QUANTITY` - intero della difficoltà totale della catena fino a questo blocco.
- `extraData`: `DATA` - il campo "dati extra" di questo blocco.
- `size`: `QUANTITY` - intero in bytes della dimensione di questo blocco.
- `gasLimit`: `QUANTITY`: il gas massimo consentito in questo blocco.
- `gasUsed`: `QUANTITY`: il gas totale usato da tutte le transazioni in questo blocco.
- `timestamp`: `QUANTITY` - la marca temporale unix relativa a quando il blocco è stato collazionato.
- `transactions`: `Array` - Matrice di oggetti transazione o hash di transazione da 32 byte a seconda dell'ultimo parametro specificato.
- `uncles`: `Array` - Matrice di ommer hash.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByHash","params":["0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae", false],"id":1}'
// Result
{
{
"jsonrpc": "2.0",
"id": 1,
"result": {
    "difficulty": "0x4ea3f27bc",
    "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
    "gasLimit": "0x1388",
    "gasUsed": "0x0",
    "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
    "mixHash": "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
    "nonce": "0x689056015818adbe",
    "number": "0x1b4",
    "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x220",
    "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
    "timestamp": "0x55ba467c",
    "totalDifficulty": "0x78ed983323d",
    "transactions": [
    ],
    "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "uncles": [
    ]
}
}
```

### eth_getBlockByNumber {#eth_getblockbynumber}

Restituisce informazioni su un blocco per numero di blocco.

**Parametri**

1. `QUANTITY|TAG` - numero intero del blocco o stringa `"earliest"`, `"latest"` oppure `"pending"`, come nel [parametro predefinito del blocco](/developers/docs/apis/json-rpc/#default-block-parameter).
2. `Boolean` - Se `true` restituisce gli oggetti di transazione completi, se `falso` solo gli hash delle transazioni.

```js
params: [
  "0x1b4", // 436
  true,
]
```

**Restituisce** Vedi [eth_getBlockByHash](#eth_getblockbyhash)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x1b4", true],"id":1}'
```

Risultato vedi [eth_getBlockByHash](#eth_getblockbyhash)

### eth_getTransactionByHash {#eth_gettransactionbyhash}

Restituisce le informazioni su una transazione richiesta dall'hash della transazione.

**Parametri**

1. `DATA`, 32 Bytes - hash di una transazione

```js
params: ["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]
```

**Restituisce**

`Oggetto` - Un oggetto di transazione, oppure `null` quando non viene trovata alcuna transazione:

- `blockHash`: `DATA`, 32 byte - hash del blocco in cui si trovava questa transazione. `null` quando è in sospeso.
- `blockNumber`: `QUANTITY` - numero di blocco in cui si trovava questa transazione. `null` quando è in sospeso.
- `from`: `DATA`, 20 Bytes - l'indirizzo del mittente.
- `gas`: `QUANTITY`: gas fornito dal mittente.
- `gasPrice`: `QUANTITY`: prezzo del gas fornito dal mittente in Wei.
- `hash`: `DATA`, 32 Bytes - hash della transazione.
- `input`: `DATA` - i dati inviati insieme alla transazione.
- `nonce`: `QUANTITY` - il numero di transazioni effettuate dal mittente prima di questa.
- `to`: `DATA`, 20 Bytes - l'indirizzo del destinatario. `null` quando è una transazione di creazione del contratto.
- `transactionIndex`: `QUANTITY` - intero della posizione dell'indice delle transazioni nel blocco. `null` quando è in sospeso.
- `value`: `QUANTITY` - valore trasferito in Wei.
- `v`: `QUANTITY` - id di recupero ECDSA
- `r`: `QUANTITY` - firma r ECDSA
- `s`: `QUANTITY` - firma s ECDSA

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"],"id":1}'
// Result
{
  "jsonrpc":"2.0",
  "id":1,
  "result":{
    "blockHash":"0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
    "blockNumber":"0x5daf3b", // 6139707
    "from":"0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
    "gas":"0xc350", // 50000
    "gasPrice":"0x4a817c800", // 20000000000
    "hash":"0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
    "input":"0x68656c6c6f21",
    "nonce":"0x15", // 21
    "to":"0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
    "transactionIndex":"0x41", // 65
    "value":"0xf3dbb76162000", // 4290000000000000
    "v":"0x25", // 37
    "r":"0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
    "s":"0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c"
  }
}
```

### eth_getTransactionByBlockHashAndIndex {#eth_gettransactionbyblockhashandindex}

Restituisce informazioni su una transazione per hash del blocco e posizione dell'indice delle transazioni.

**Parametri**

1. `DATA`, 32 Byte - hash di un blocco.
2. `QUANTITY` - intero della posizione dell'indice della transazione.

```js
params: [
  "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331",
  "0x0", // 0
]
```

**Restituisce** Vedi [eth_getTransactionByHash](#eth_gettransactionbyhash)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockHashAndIndex","params":["0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b", "0x0"],"id":1}'
```

Risultato vedi [eth_getBlockByHash](#eth_gettransactionbyhash)

### eth_getTransactionByBlockNumberAndIndex {#eth_gettransactionbyblocknumberandindex}

Restituisce informazioni su una transazione per hash del blocco e posizione dell'indice delle transazioni.

**Parametri**

1. `QUANTITY|TAG` - numero intero del blocco o stringa `"earliest"`, `"latest"` oppure `"pending"`, come nel [parametro predefinito del blocco](/developers/docs/apis/json-rpc/#default-block-parameter).
2. `QUANTITY` - la posizione dell'indice delle transazioni.

```js
params: [
  "0x29c", // 668
  "0x0", // 0
]
```

**Restituisce** Vedi [eth_getTransactionByHash](#eth_gettransactionbyhash)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockNumberAndIndex","params":["0x29c", "0x0"],"id":1}'
```

Risultato vedi [eth_getBlockByHash](#eth_gettransactionbyhash)

### eth_getTransactionReceipt {#eth_gettransactionreceipt}

Restituisce la ricezione di una transazione tramite l'hash di transazione.

**Nota** che la ricevuta non è disponibile per le transazioni in sospeso.

**Parametri**

1. `DATA`, 32 Bytes - hash di una transazione

```js
params: ["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"]
```

**Restituisce** `Object` - Un oggetto di ricezione della transazione o `null` quando non è stata trovata nessuna ricevuta:

- `transactionHash`: `DATA`, 32 Bytes - hash della transazione.
- `transactionIndex`: `QUANTITY` - numero intero della posizione dell'indice delle transazioni nel blocco.
- `blockHash`: `DATA`, 32 byte - hash del blocco in cui si trovava questa transazione.
- `blockNumber`: `QUANTITY` - numero di blocco in cui si trovava questa transazione.
- `from`: `DATA`, 20 Bytes - l'indirizzo del mittente.
- `to`: `DATA`, 20 Bytes - l'indirizzo del destinatario. null quando è una transazione di creazione del contratto.
- `cumulativeGasUsed`: `QUANTITY`: L'importo totale di gas usato all'esecuzione nel blocco di questa transazione.
- `gas Usato`: `QUANTITÀ`: L'importo di gas usato solo da questa specifica transazione.
- `contractAddress`: `DATA`, 20 Bytes - L'indirizzo del contratto creato, se la transazione consisteva nella creazione di un contratto, altrimenti `null`.
- `logs`: `Array` - Array di oggetti di registro che questa transazione ha generato.
- `logsBloom`: `DATA`, 256 Bytes - Filtro Bloom per i client leggeri per recuperare rapidamente i log correlati. Restituisce anche _either_:
- `root` : `DATA` 32 bytes dello stateRoot post-transazione (pre Byzantium)
- `status`: `QUANTITY` o `1` (successo) o `0` (insuccesso)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],"id":1}'
// Result
{
"id":1,
"jsonrpc":"2.0",
"result": {
     transactionHash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238',
     transactionIndex:  '0x1', // 1
     blockNumber: '0xb', // 11
     blockHash: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b',
     cumulativeGasUsed: '0x33bc', // 13244
     gasUsed: '0x4dc', // 1244
     contractAddress: '0xb60e8dd61c5d32be8058bb8eb970870f07233155', // or null, if none was created
     logs: [{
         // logs as returned by getFilterLogs, etc.
     }, ...],
     logsBloom: "0x00...0", // 256 byte bloom filter
     status: '0x1'
  }
}
```

### eth_getUncleByBlockHashAndIndex {#eth_getunclebyblockhashandindex}

Restituisce informazioni su un ommer di un blocco in base all'hash e alla posizione dell'indice dell'ommer.

**Parametri**

1. `DATA`, 32 Byte - hash di un blocco.
2. `QUANTITY` - La posizione dell'indice dell'ommer.

```js
params: [
  "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
  "0x0", // 0
]
```

**Restituisce** Vedi [eth_getBlockByHash](#eth_getblockbyhash)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockHashAndIndex","params":["0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b", "0x0"],"id":1}'
```

Risultato vedi [eth_getBlockByHash](#eth_getblockbyhash)

**Nota**: Un ommer non contiene transazioni individuali.

### eth_getUncleByBlockNumberAndIndex {#eth_getunclebyblocknumberandindex}

Restituisce informazioni su un ommer di un blocco in base al numero e alla posizione dell'indice dell'ommer.

**Parametri**

1. `QUANTITY|TAG` - numero intero del blocco o stringa `"earliest"`, `"latest"` oppure `"pending"`, come nel [parametro predefinito del blocco](/developers/docs/apis/json-rpc/#default-block-parameter).
2. `QUANTITY` - la posizione dell'indice dell'ommer.

```js
params: [
  "0x29c", // 668
  "0x0", // 0
]
```

**Restituisce** Vedi [eth_getBlockByHash](#eth_getblockbyhash)

**Nota**: Un ommer non contiene transazioni individuali.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockNumberAndIndex","params":["0x29c", "0x0"],"id":1}'
```

Risultato vedi [eth_getBlockByHash](#eth_getblockbyhash)

### eth_getCompilers {#eth_getcompilers}

Restituisce un elenco di compilatori disponibili nel client.

**Parametri** Nessuno

**Restituisce** `Array` - Array dei compilatori disponibili.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getCompilers","params":[],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": ["solidity", "lll", "serpent"]
}
```

### eth_compileSolidity {#eth_compile_solidity}

Restituisce il codice Solidity compilato.

**Parametri**

1. `Stringa` - Il codice sorgente.

```js
params: [
  "contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }",
]
```

**Restituisce** `DATA` - Il codice sorgente compilato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_compileSolidity","params":["contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": {
      "code": "0x605880600c6000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063c6888fa114602e57005b603d6004803590602001506047565b8060005260206000f35b60006007820290506053565b91905056",
      "info": {
        "source": "contract test {\n   function multiply(uint a) constant returns(uint d) {\n       return a * 7;\n   }\n}\n",
        "language": "Solidity",
        "languageVersion": "0",
        "compilerVersion": "0.9.19",
        "abiDefinition": [
          {
            "constant": true,
            "inputs": [
              {
                "name": "a",
                "type": "uint256"
              }
            ],
            "name": "multiply",
            "outputs": [
              {
                "name": "d",
                "type": "uint256"
              }
            ],
            "type": "function"
          }
        ],
        "userDoc": {
          "methods": {}
        },
        "developerDoc": {
          "methods": {}
        }
      }
}
```

### eth_compileLLL {#eth_compileLLL}

Restituisce il codice LLL compilato.

**Parametri**

1. `String` - Il codice sorgente.

```js
params: ["(returnlll (suicide (caller)))"]
```

**Restituisce** `DATA` - Il codice sorgente compilato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_compileLLL","params":["(returnlll (suicide (caller)))"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056" // the compiled source code
}
```

### eth_compileSerpent {#eth_compileserpent}

Restituisce il codice Serpent compilato.

**Parametri**

1. `String` - Il codice sorgente.

```js
params: ["/* some serpent */"]
```

**Restituisce** `DATA` - Il codice sorgente compilato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_compileSerpent","params":["/* some serpent */"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056" // the compiled source code
}
```

### eth_newFilter {#eth_newfilter}

Crea un oggetto filtro, basato sulle opzioni di filtro, per notificare quando lo stato cambia (log). Per verificare se lo stato è cambiato, chiama [eth_getFilterChanges](#eth_getfilterchanges).

**Una nota per specificare i filtri degli argomenti:** Gli argomenti dipendono dall'ordine. Una transazione con un registro con argomenti [A, B] sarà abbinata ai seguenti filtri tematici:

- `[]` "qualsiasi"
- `[A]`: "A in prima posizione (e tutto il resto segue)"
- `[null, B]`: "tutto nella prima posizione e B nella seconda (e tutto il resto segue)"
- `[A, B]`: "A in prima posizione e B in seconda (e tutto il resto segue)"
- `[[A, B], [A, B]]`: "(A o B) in prima posizione e (A o B) in seconda posizione (e tutto il resto segue)"
- **Parametri**

1. `Object` - Le opzioni di filtro:

- `fromBlock`: `QUANTITY|TAG` - (opzionale, predefinito: `"latest"`) Numero intero del blocco, oppure `"latest"` per l'ultimo blocco estratto oppure `"pending"`, `"earliest"` per le transazioni ancore non estratte.
- `toBlock`: `QUANTITY|TAG` - (opzionale, predefinito: `"latest"`) numero intero del block, oppure `"latest"` per l'ultimo blocco estratto, oppure `"pending"`, `"earliest"` per le transazioni ancora non estratte.
- `address`: `DATA|Array`, 20 Bytes - (opzionale) Gli indirizzi del contratto oppure un elenco di indirizzi da cui dovrebbero avere origine i registri.
- `topics`: `Array of DATA`, - (opzionale) Array di 32 Bytes `DATA` Argomento. Argomenti di analisi della dipendenza dei dati. Ogni argomento può anche essere una matrice di DATI con opzioni "oppure".

```js
params: [
  {
    fromBlock: "0x1",
    toBlock: "0x2",
    address: "0x8888f1f195afa192cfee860698584c030f4c9db1",
    topics: [
      "0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
      null,
      [
        "0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
        "0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc",
      ],
    ],
  },
]
```

**Restituisce** `QUANTITY` - L'ID di un filtro.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newFilter","params":[{"topics":["0x12341234"]}],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
```

### eth_newBlockFilter {#eth_newblockfilter}

Crea un filtro nel nodo, per notificare quando arriva un nuovo blocco. Per verificare se lo stato è cambiato, chiama [eth_getFilterChanges](#eth_getfilterchanges).

**Parametri** Nessuno

**Restituisce** `QUANTITY` - L'ID di un filtro.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newBlockFilter","params":[],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":  "2.0",
  "result": "0x1" // 1
}
```

### eth_newPendingTransactionFilter {#eth_newpendingtransactionfilter}

Crea un filtro nel nodo, per avvisare quando arrivano nuove transazioni in sospeso. Per verificare se lo stato è cambiato, chiama [eth_getFilterChanges](#eth_getfilterchanges).

**Parametri** Nessuno

**Restituisce** `QUANTITY` - Un filtro ID.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newPendingTransactionFilter","params":[],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":  "2.0",
  "result": "0x1" // 1
}
```

### eth_uninstallFilter {#eth_uninstallfilter}

Disinstalla un filtro con un Id specificato. Dovrebbe essere sempre chiamato quando l'orologio non è più necessario. Inoltre i filtri scadono quando non vengono richiesti con [eth_getFilterChanges](#eth_getfilterchanges) per un periodo di tempo.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0xb", // 11
]
```

**Restituisce** `Boolean` - `true` se il filtro è stato disinstallato con successo, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_uninstallFilter","params":["0xb"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": true
}
```

### eth_getFilterChanges {#eth_getfilterchanges}

Metodo di sondaggio per un filtro, che restituisce un array di registri che si sono verificati dall'ultimo sondaggio.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0x16", // 22
]
```

**Restituisce** `Array` - Array di oggetti di log, o un array vuoto se nulla è cambiato dall'ultimo sondaggio.

- Per i filtri creati con `eth_newBlockFilter` vengono restituiti hash di blocco (`DATA`, 32 Byte), ad esempio `["0x3454645634534..."]`.
- Per i filtri creati con `eth_newPendingTransactionFiltro` vengono restituiti hash di transazione (`DATA`, 32 Bytes), ad esempio `["0x6345343454645..."]`.
- Per i filtri creati con `eth_newFiltro` i registri sono oggetti con i seguenti parametri:
  - `removed`: `TAG` - `true` quando il registro è stato rimosso, a causa di una riorganizzazione a catena. `false` se il suo registro è valido.
  - `transactionIndex`: `QUANTITY` - numero intero della posizione dell'indice delle transazioni nel blocco. `null` quando il log è in sospeso.
  - `transactionIndex`: `QUANTITY` - numero intero del registro della posizione dell'indice delle transazioni da cui è stato creato. `null` quando il log è in sospeso.
  - `transactionHash`: `DATA`, 32 Bytes - hash delle transazioni da cui è stato creato il registro. `null` quando il log è in sospeso.
  - `blockHash`: `DATA`, 32 byte - hash del blocco in cui si trovava questa transazione. `null` quando è in sospeso. `null` quando il log è in sospeso.
  - `blockNumber`: `QUANTITY` il numero di blocco in cui si trovava questo registro. `null` quando è in sospeso. `null` quando il log è in sospeso.
  - `address`: `DATI`, 20 Bytes - indirizzo da cui è nato questo registro.
  - `data`: `DATA` - contiene uno o più argomenti a 32 byte non indicizzati del registro.
  - `topics`: `Array of DATA` - Array da 0 a 432 byte di `DATA` di argomenti di log indicizzati. (In _solidity_: il primo argomento è l'_hash_ della firma dell'evento (ad es. `Deposit(address,bytes32,uint256)`), tranne se hai dichiarato l'evento con lo specificatore `anonymous`
- **Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":["0x16"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": [{
    "logIndex": "0x1", // 1
    "blockNumber":"0x1b4", // 436
    "blockHash": "0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d",
    "transactionHash":  "0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf",
    "transactionIndex": "0x0", // 0
    "address": "0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d",
    "data":"0x0000000000000000000000000000000000000000000000000000000000000000",
    "topics": ["0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5"]
    },{
      ...
    }]
}
```

### eth_getFilterLogs {#eth_getfilterlogs}

Restituisce un array di tutti i log corrispondenti al filtro con un dato ID.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0x16", // 22
]
```

**Restituisce** Vedi [eth_getBlockByHash](#eth_getfilterchanges)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterLogs","params":["0x16"],"id":74}'
```

Risultato vedi [eth_getFilterChanges](#eth_getfilterchanges)

### eth_getLogs {#eth_getlogs}

Restituisce un array di tutti i log che corrispondono a un dato oggetto filtro.

**Parametri**

1. `Oggetto` - Le opzioni di filtro:

- `fromBlock`: `QUANTITY|TAG` - (opzionale, predefinito: `"latest"`) Numero intero del blocco, oppure `"latest"` per l'ultimo blocco minato oppure `"pending"`, `"earliest"` per le transazioni non ancora minate.
- `toBlock`: `QUANTITY|TAG` - (opzionale, predefinito: `"latest"`) numero intero del blocco, oppure `"latest"` per l'ultimo blocco minato, oppure `"pending"`, `"earliest"` per le transazioni non ancora minate.
- `address`: `DATA|Array`, 20 Bytes - (opzionale) Gli indirizzi del contratto oppure un elenco di indirizzi da cui dovrebbero avere origine i registri.
- `topics`: `Array of DATA`, - (opzionale) Array di argomenti `DATA` a 32 byte. Gli argomenti dipendono dall'ordine. Ogni argomento può anche essere una matrice di DATA con opzioni "oppure".
- `blockhash`: `DATI`, 32 Bytes - (opzionale, **future**) Con l'aggiunta di EIP-234, `blockHash` sarà una nuova opzione di filtro che limita i log restituiti al singolo blocco con l'hash `blockHash` da 32 byte. L'utilizzo di `blockHash` equivale a `fromBlock` = `toBlock` = il numero di blocco con hash `blockHash`. Se `blockHash` è presente nei criteri di filtraggio, non sono permessi né `fromBlock` né `toBlock`.

```js
params: [
  {
    topics: [
      "0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
    ],
  },
]
```

**Restituisce** Vedi [eth_getBlockByHash](#eth_getfilterchanges)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"topics":["0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b"]}],"id":74}'
```

Risultato vedi [eth_getFilterChanges](#eth_getfilterchanges)

### eth_getWork {#eth_getwork}

Restituisce l'hash del blocco corrente, il seedHash e la condizione limite da soddisfare ("target").

**Parametri** Nessuno

**Restituisce** `Array` - Array con le seguenti proprietà:

1. `DATI`, 32 Byte - intestazione pow-hash del blocco corrente
2. `DATI`, 32 Byte - il seed hash utilizzato per il DAG.
3. `DATI`, 32 Byte - la condizione di confine ("target"), 2^256 / difficoltà.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getWork","params":[],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": [
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "0x5EED00000000000000000000000000005EED0000000000000000000000000000",
      "0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000"
    ]
}
```

### eth_submitWork {#eth_submitwork}

Utilizzato per presentare una soluzione proof-of-work.

**Parametri**

1. `DATA`, 8 Byte - Il nonce trovato (64 bit)
2. `DATA`, 32 Byte - il pow-hash dell'intestazione (256 bit)
3. `DATA`, 32 Byte - Il mix digest (256 bit)

```js
params: [
  "0x0000000000000001",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000",
]
```

**Restituisce** `Boolean` - restituisce `true` se la soluzione fornita è valida, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0", "method":"eth_submitWork", "params":["0x0000000000000001", "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", "0xD1GE5700000000000000000000000000D1GE5700000000000000000000000000"],"id":73}'
// Result
{
  "id":73,
  "jsonrpc":"2.0",
  "result": true
}
```

### eth_submitHashrate {#eth_submithashrate}

Usato per inviare hashrate di mining.

**Parametri**

1. `Hashrate`, una rappresentazione esadecimale della stringa (32 byte) dell'hashrate
2. `ID`, Stringa - Un ID esadecimale casuale (32 byte) che identifica il client

```js
params: [
  "0x0000000000000000000000000000000000000000000000000000000000500000",
  "0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c",
]
```

**Restituisce** `Boolean` - restituisce `true` se l'invio è andato a buon fine e `falso` in caso contrario.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0", "method":"eth_submitHashrate", "params":["0x0000000000000000000000000000000000000000000000000000000000500000", "0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c"],"id":73}'
// Result
{
  "id":73,
  "jsonrpc":"2.0",
  "result": true
}
```

### db_putString (deprecated) {#db_putstring}

Memorizza una stringa nel database locale.

**Nota** questa funzione è superata.

**Parametri**

1. `String` - Nome del database.
2. `String` - Nome della chiave.
3. `String` - Stringa da archiviare.

```js
params: ["testDB", "myKey", "myString"]
```

**Restituisce** `Boolean` - `true` se il valore è stato memorizzato, in caso contrario `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"db_putString","params":["testDB","myKey","myString"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": true
}
```

### db_getString (deprecated) {#db_getstring}

Memorizza una stringa nel database locale. **Nota** questa funzione è superata.

**Parametri**

1. `String` - Nome del database.
2. `String` - Nome della chiave.

```js
params: ["testDB", "myKey"]
```

**Restituisce** `String` - La stringa precedentemente memorizzata.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"db_getString","params":["testDB","myKey"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": "myString"
}
```

### db_putHex (deprecated) {#db_puthex}

Memorizza i dati binari nel database locale. **Nota** questa funzione è superata.

**Parametri**

1. `String` - Nome del database.
2. `String` - Nome della chiave.
3. `DATA` - I dati da archiviare.

```js
params: ["testDB", "myKey", "0x68656c6c6f20776f726c64"]
```

**Restituisce** `Boolean` - `true` se il valore è stato memorizzato, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"db_putHex","params":["testDB","myKey","0x68656c6c6f20776f726c64"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": true
}
```

### db_getHex (deprecated) {#db_gethex}

Memorizza i dati binari nel database locale. **Nota** questa funzione è superata.

**Parametri**

1. `String` - Nome del database.
2. `String` - Nome della chiave.

```js
params: ["testDB", "myKey"]
```

**Restituisce** `DATI` - I dati precedentemente memorizzati.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"db_getHex","params":["testDB","myKey"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": "0x68656c6c6f20776f726c64"
}
```

### shh_version (deprecated) {#shh_post}

Restituisce la versione corrente del protocollo Whisper.

**Nota** questa funzione è superata.

**Parametri** Nessuno

**Restituisce** `Stringa` - La versione corrente del protocollo Whisper

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_version","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc": "2.0",
  "result": "2"
}
```

### shh_post (deprecated) {#shh_version}

Invia un messaggio Whisper.

**Nota** questa funzione è superata.

**Parametri**

1. `Object` -Il contenuto dei post di Whisper:

- `da`: `DATA`, 60 Byte - (opzionale) L'identità del mittente.
- `to`: `DATA`, 60 Byte - (opzionale) L'identità del destinatario. Se presente, Whisper cifrerà il messaggio in modo che solo il destinatario possa decifrarlo.
- `topics`: `Array of DATA` - Array di argomenti `DATA`, affinchè il destinatario possa identificare i messaggi.
- `payload`: `DATA` - Il carico utile del messaggio.
- `priority`: `QUANTITY` - L'intero della priorità in un range da ... (?).
- `ttl`: `QUANTITY` - intero del tempo residuo in secondi.

```js
params: [
  {
    from: "0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1",
    to: "0x3e245533f97284d442460f2998cd41858798ddf04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a0d4d661997d3940272b717b1",
    topics: [
      "0x776869737065722d636861742d636c69656e74",
      "0x4d5a695276454c39425154466b61693532",
    ],
    payload: "0x7b2274797065223a226d6",
    priority: "0x64",
    ttl: "0x64",
  },
]
```

**Restituisce** `Boolean` - restituisce `true` se il messaggio è stato inviato, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_post","params":[{"from":"0xc931d93e97ab07fe42d923478ba2465f2..","topics": ["0x68656c6c6f20776f726c64"],"payload":"0x68656c6c6f20776f726c64","ttl":0x64,"priority":0x64}],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": true
}
```

### shh_newIdentity (superata){#shh_newidentity}

Crea una nuova identità di Whisper nel client.

**Nota** questa funzione è superata.

**Parametri** Nessuno

**Restituisce** `DATA`, 60 Byte - l'indirizzo della nuova identità.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_newIdentity","params":[],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xc931d93e97ab07fe42d923478ba2465f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca9007d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf"
}
```

### shh_hasIdentity (deprecated){#shh_hasidentity}

Controlla se il client possiede le chiavi private per una data identità.

**Nota** questa funzione è superata.

**Parametri**

1. `DATA`, 60 Byte - L'indirizzo di identità da controllare.

```js
params: [
  "0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1",
]
```

**Restituisce** `Boolean` - restituisce `true` se il messaggio è stato inviato, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_hasIdentity","params":["0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": true
}
```

### shh_newGroup (deprecated){#shh_newgroup}

**Nota** questa funzione è superata.

**Parametri** Nessuno

**Restituisce** `DATA`, 60 Byte - l'indirizzo di un nuovo gruppo. (?)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_newGroup","params":[],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xc65f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca90931d93e97ab07fe42d923478ba2407d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf"
}
```

### shh_addToGroup (deprecated){#shh_addtogroup}

**Nota** questa funzione è superata.

**Parametri**

1. `DATA`, 60 Byte - L'indirizzo di identità da aggiungere a un gruppo (?).

```js
params: [
  "0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1",
]
```

**Restituisce** `Boolean` - restituisce `true` se l'identità è stata aggiunta con successo al gruppo, altrimenti `false`(?).

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_addToGroup","params":["0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": true
}
```

### shh_newFilter (deprecated){#shh_newfilter}

Crea un filtro per notificare, quando il client riceve un messaggio Whisper corrispondente alle opzioni del filtro. **Nota** questa funzione è superata.

**Parametri**

1. `Oggetto` - Le opzioni del filtro:

- `to`: `DATA`, 60 Byte - (opzionale) L'identità del destinatario. _Quando è presente, proverà a decifrare qualsiasi messaggio in arrivo se il client detiene la chiave privata di questa identità._
- `topics`: `Array of DATA` - Insieme di argomenti `DATA` a cui dovrebbero corrispondere gli argomenti del messaggio in entrata. You can use the following combinations:
  - `[A, B] = A && B`
  - `[A, [B, C]] = A && (B || C)`
  - `[null, A, B] = ANYTHING && A && B` `null` funge da jolly
  -

```js
params: [
  {
    topics: ["0x12341234bf4b564f"],
    to: "0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1",
  },
]
```

**Restituisce** `QUANTITY` - Il filtro appena creato.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_newFilter","params":[{"topics": ['0x12341234bf4b564f'],"to": "0x2341234bf4b2341234bf4b564f..."}],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": "0x7" // 7
}
```

### shh_uninstallFilter (deprecated){#shh_uninstallfilter}

Disinstalla un filtro con un ID specificato. Dovrebbe essere sempre chiamato quando l'orologio non è più necessario. Inoltre i filtri scadono quando non vengono richiesti con [shh_getFilterChange](#shh_getfilterchanges) per un periodo di tempo. **Nota** questa funzione è superata.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0x7", // 7
]
```

**Restituisce** `Boolean` - `true` se il filtro è stato disinstallato con successo, altrimenti `false`.

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_uninstallFilter","params":["0x7"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": true
}
```

### shh_getFilterChanges (deprecated){#shh_getfilterchanges}

Metodo di sondaggio per i filtri Whisper. Restituisce nuovi messaggi dall'ultima chiamata di questo metodo. **Nota** chiamando il metodo [shh_getMessages](#shh_getmessages) verrà resettato il buffer per questo metodo, in modo da non ricevere messaggi duplicati. **Nota** questa funzione è superata.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0x7", // 7
]
```

**Restituisce** `Array` - Matrice di messaggi ricevuti dall'ultimo sondaggio:

- `hash`: `DATA`, 32 Byte (?) - L'hash del messaggio.
- `da`: `DATA`, 60 Byte - Il mittente del messaggio, se è stato specificato un mittente.
- `to`: `DATA`, 60 Byte - Il destinatario del messaggio, se è stato specificato un destinatario.
- `expiry`: `QUANTITY` - Intero del tempo in secondi che esprime la scadenza presunta del messaggio (?).
- `ttl`: `QUANTITY` - Intero del tempo durante il quale il messaggio dovrebbe fluttuare nel sistema, in secondi (?).
- `sent`: `QUANTITY` - Intero della marca temporale unix quando il messaggio è stato inviato.
- `topics`: `Array of DATA` - Matrice di argomenti `DATA` contenuti nel messaggio.
- `payload`: `DATA` - Il carico utile del messaggio.
- `workProved`: `QUANTITY` - Intero del lavoro richiesto da questo messaggio prima che fosse inviato (?).

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_getFilterChanges","params":["0x7"],"id":73}'
// Result
{
  "id":1,
  "jsonrpc":"2.0",
  "result": [{
    "hash": "0x33eb2da77bf3527e28f8bf493650b1879b08c4f2a362beae4ba2f71bafcd91f9",
    "from": "0x3ec052fc33..",
    "to": "0x87gdf76g8d7fgdfg...",
    "expiry": "0x54caa50a", // 1422566666
    "sent": "0x54ca9ea2", // 1422565026
    "ttl": "0x64", // 100
    "topics": ["0x6578616d"],
    "payload": "0x7b2274797065223a226d657373616765222c2263686...",
    "workProved": "0x0"
    }]
}
```

### shh_getMessages (deprecated) {#shh_getmessages}

Ottieni tutti i messaggi corrispondenti a un filtro. A differenza di `shh_getFilterChanges`, questo restituisce tutti i messaggi.

**Nota** questa funzione è superata.

**Parametri**

1. `QUANTITY` - L'ID del filtro.

```js
params: [
  "0x7", // 7
]
```

**Restituisce** Vedi [shh_getFilterChanges](#shh_getfilterchanges)

**Esempio**

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"shh_getMessages","params":["0x7"
],"id":73}'
```

Risultato vedi [shh_getFilterChanges](#shh_getfilterchanges)

## Esempio di utilizzo {#usage-example}

### Distribuire un contratto utilizzando JSON_RPC {#deploying-contract}

Questa sezione include una dimostrazione di come distribuire un contratto utilizzando solo l'interfaccia RPC. Esistono vie alternative per la distribuzione di contratti in cui questa complessità viene eliminata tramite astrazione, ad esempio utilizzando librerie costruite partendo dall'interfaccia RPC, come [web3. s](https://web3js.readthedocs.io/) e [web3.py](https://github.com/ethereum/web3.py). Queste astrazioni sono generalmente più facili da capire e meno soggette a errori, ma è comunque utile capire cosa succede dietro le quinte.

Di seguito, trovi un semplice contratto intelligente, detto `Multiply7`, che sarà distribuito usando l'interfaccia JSON-RPC a un nodo di Ethereum. Questo tutorial presuppone che il lettore stia già eseguendo un nodo Geth. Maggiori informazioni sui nodi e sui client sono disponibili [qui](/developers/docs/nodes-and-clients/run-a-node). Fare riferimento alla documentazione del [client](/developers/docs/nodes-and-clients/) individuale per capire come avviare HTTP JSON-RPC per i client non-Geth. La maggior parte dei clienti serve di default su `localhost:8545`.

```javascript
contract Multiply7 {
    event Print(uint);
    function multiply(uint input) returns (uint) {
        Print(input * 7);
        return input * 7;
    }
}
```

La prima cosa da fare è assicurarsi che l'interfaccia HTTP RPC sia abilitata. Questo significa che forniamo a Geth il flag `--http` all'avvio. In questo esempio usiamo il nodo Geth su una catena di sviluppo privata. Utilizzando questo approccio non abbiamo bisogno di ether sulla rete reale.

```bash

geth --http --dev --mine --miner.threads 1 --unlock 0 console 2>>geth.log

```

Questo avvierà l'interfaccia HTTP RPC su `http://localhost:8545`.

Possiamo verificare che l'interfaccia sia in esecuzione recuperando l'indirizzo Coinbase e il saldo utilizzando [curl](https://curl.haxx.se/download.html). Si prega di notare che i dati in questi esempi saranno diversi sul nodo locale. Se vuoi provare questi comandi, sostituisci i parametri di richiesta nella seconda richiesta di Curl con il risultato restituito dalla prima.

```bash
curl --data '{"jsonrpc":"2.0","method":"eth_coinbase", "id":1}' -H "Content-Type: application/json" localhost:8545
{"id":1,"jsonrpc":"2.0","result":["0x9b1d35635cc34752ca54713bb99d38614f63c955"]}

curl --data '{"jsonrpc":"2.0","method":"eth_getBalance", "params": ["0x9b1d35635cc34752ca54713bb99d38614f63c955", "latest"], "id":2}' -H "Content-Type: application/json" localhost:8545
{"id":2,"jsonrpc":"2.0","result":"0x1639e49bba16280000"}
```

Poiché i numeri sono soggetti a codifica esadecimale, il saldo viene restituito in wei sotto forma di stringa esadecimale. Se vogliamo ottenere il saldo in Ether sotto forma di numero possiamo utilizzare web3 dalla console Geth.

```javascript
web3.fromWei("0x1639e49bba16280000", "ether")
// "410"
```

Ora che vi sono Ether nella nostra catena di sviluppo privato, possiamo distribuire il contratto. Il primo passo è quello di compilare il contratto Multiply7 al codice di byte che può essere inviato all'EVM. Per installare solc, il compilatore Solidity, seguire la documentazione [Solidity](https://docs.soliditylang.org/en/latest/installing-solidity.html). (Potresti voler utilizzare una versione `solc` più vecchia per abbinare [la versione del compilatore utilizzata per il nostro esempio](https://github.com/ethereum/solidity/releases/tag/v0.4.20).)

Il passo successivo è quello di compilare il contratto Multiply7 al codice di byte che può essere inviato all'EVM.

```bash
echo 'pragma solidity ^0.4.16; contract Multiply7 { event Print(uint); function multiply(uint input) public returns (uint) { Print(input * 7); return input * 7; } }' | solc --bin

======= <stdin>:Multiply7 =======
Binary:
6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029
```

Ora che abbiamo il codice compilato, dobbiamo determinare quanto gas occorre per distribuirlo. L'interfaccia RPC ha un metodo `eth_estimateGas` che ci darà una stima.

```bash
curl --data '{"jsonrpc":"2.0","method": "eth_estimateGas", "params": [{"from": "0x9b1d35635cc34752ca54713bb99d38614f63c955", "data": "0x6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029"}], "id": 5}' -H "Content-Type: application/json" localhost:8545
{"jsonrpc":"2.0","id":5,"result":"0x1c31e"}
```

E infine distribuiamo il contratto.

```bash
curl --data '{"jsonrpc":"2.0","method": "eth_sendTransaction", "params": [{"from": "0x9b1d35635cc34752ca54713bb99d38614f63c955", "gas": "0x1c31e", "data": "0x6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029"}], "id": 6}' -H "Content-Type: application/json" localhost:8545
{"id":6,"jsonrpc":"2.0","result":"0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf"}
```

La transazione è accettata dal nodo e viene restituito un hash di transazione. Questo hash può essere usato per tracciare la transazione. Il passo successivo è quello di determinare l'indirizzo dove il nostro contratto è distribuito. Ogni transazione eseguita creerà una ricevuta. Questa ricevuta contiene varie informazioni sulla transazione, ad esempio, in quale blocco è stata inclusa e quanto gas è stato usato dall'EVM. Se una transazione crea un contratto, conterrà anche l'indirizzo dello stesso. Possiamo recuperare la ricevuta con il metodo `eth_getTransactionReceipt` RPC.

```bash
curl --data '{"jsonrpc":"2.0","method": "eth_getTransactionReceipt", "params": ["0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf"], "id": 7}' -H "Content-Type: application/json" localhost:8545
{"jsonrpc":"2.0","id":7,"result":{"blockHash":"0x77b1a4f6872b9066312de3744f60020cbd8102af68b1f6512a05b7619d527a4f","blockNumber":"0x1","contractAddress":"0x4d03d617d700cf81935d7f797f4e2ae719648262","cumulativeGasUsed":"0x1c31e","from":"0x9b1d35635cc34752ca54713bb99d38614f63c955","gasUsed":"0x1c31e","logs":[],"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","status":"0x1","to":null,"transactionHash":"0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf","transactionIndex":"0x0"}}
```

Il nostro contratto è stato creato su `0x4d03d617d700cf81935d7f797f4e2ae719648262`. Un risultato nullo invece di una ricevuta significa che la transazione non è ancora stata inclusa in un blocco. Attendere un attimo e controllare se il miner è in esecuzione, quindi riprovare.

#### Interagire con i contratti intelligenti {#interacting-with-smart-contract}

In questo esempio invieremo una transazione usando `eth_sendTransaction` al metodo `multiply` del contratto.

`eth_sendTransaction` richiede diversi argomenti, in particolare `from`, `to` e `data`. `From` è l'indirizzo pubblico del nostro conto, mentre `to` è l'indirizzo del contratto. L'argomento `data` contiene un carico utile che definisce quale metodo deve essere chiamato e con quali argomenti. È qui che entra in gioco l'[ABI (interfaccia binaria dell'applicazione)](https://docs.soliditylang.org/en/latest/abi-spec.html). L'ABI è un file JSON che determina come definire e codificare i dati per l'EVM.

I byte del carico utile definiscono quale metodo viene chiamato nel contratto. Si tratta dei primi 4 byte dall'hash Keccak sul nome della funzione e sui suoi tipi di argomento, con codifica esadecimale. La funzione di moltiplicazione accetta un uint che è un alias per uint256. Ci ritroviamo quindi con:

```javascript
web3.sha3("multiply(uint256)").substring(0, 10)
// "0xc6888fa1"
```

Il passo successivo è la codifica degli argomenti. Vi è solo un uint256, ad esempio il valore 6. L'ABI ha una sezione che specifica come codificare i tipi uint256.

`int<M>: enc(X)` è la codifica big-endian in complemento a due di X, riempita sul lato di ordine superiore (sinistro) con 0xff per X negativo e con zero > byte per X positivo, in modo tale che la lunghezza sia un multiplo di 32 byte.

Si ottiene la codifica `0000000000000000000000000000000000000000000000000000000000000000000000000006`.

Combinando il selettore di funzione e l'argomento codificato, otterremo i dati `0xc6888fa100000000000000000000000000000000000000000000000000000000000000000000000000000006`.

A questo punto possiamo inviare al nodo:

```bash
curl --data '{"jsonrpc":"2.0","method": "eth_sendTransaction", "params": [{"from": "0xeb85a5557e5bdc18ee1934a89d8bb402398ee26a", "to": "0x6ff93b4b46b41c0c3c9baee01c255d3b4675963d", "data": "0xc6888fa10000000000000000000000000000000000000000000000000000000000000006"}], "id": 8}' -H "Content-Type: application/json" localhost:8545
{"id":8,"jsonrpc":"2.0","result":"0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74"}
```

Dall'invio di una transazione, è stato restituito un hash di transazione. Recuperando la ricevuta si ottiene:

```javascript
{
   blockHash: "0xbf0a347307b8c63dd8c1d3d7cbdc0b463e6e7c9bf0a35be40393588242f01d55",
   blockNumber: 268,
   contractAddress: null,
   cumulativeGasUsed: 22631,
   gasUsed: 22631,
   logs: [{
      address: "0x6ff93b4b46b41c0c3c9baee01c255d3b4675963d",
      blockHash: "0xbf0a347307b8c63dd8c1d3d7cbdc0b463e6e7c9bf0a35be40393588242f01d55",
      blockNumber: 268,
      data: "0x000000000000000000000000000000000000000000000000000000000000002a",
      logIndex: 0,
      topics: ["0x24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da"],
      transactionHash: "0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74",
      transactionIndex: 0
  }],
  transactionHash: "0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74",
  transactionIndex: 0
}
```

La ricevuta contiene un log. Questo log è stato generato da EVM sull'esecuzione della transazione e incluso nella ricevuta. La funzione `moltiplica` mostra che l'evento `Print` è stato alzato con i tempi di input 7. Poiché l'argomento per l'evento `Print` era un uint256, possiamo decodificare secondo le regole ABI, ottenendo così il decimale 42 previsto. Oltre ai dati, vale la pena notare che gli argomenti possono essere utilizzati per determinare quale evento ha creato il registro:

```javascript
web3.sha3("Print(uint256)")
// "24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da"
```

Questa è stata solo una breve introduzione su alcuni dei compiti più comuni, dimostrando l'uso diretto di JSON-RPC.

## Argomenti correlati {#related-topics}

- [Specifiche di JSON-RPC](http://www.jsonrpc.org/specification)
- [Nodi e client](/developers/docs/nodes-and-clients/)
- [API per JavaScript](/developers/docs/apis/javascript/)
- [API per il backend](/developers/docs/apis/backend/)
- [Client di esecuzione](/developers/docs/nodes-and-clients/#execution-clients)
