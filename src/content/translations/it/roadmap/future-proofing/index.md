---
title: Rendere Ethereum a prova di futuro
description: Questi aggiornamenti cementano Ethereum come lo strato fondamentale, resiliente e decentralizzato per il futuro, indipendentemente da ciò che conterrà.
lang: it
image: ../../../../../assets/roadmap/roadmap-future.png
alt: "Roadmap di Ethereum"
template: roadmap
---

Alcune parti della tabella di marcia non sono necessariamente richieste per ridimensionare o proteggere Ethereum sul breve termine, ma per organizzarlo per la stabilità e affidabilità future.

## Resistenza quantistica {#quantum-resistance}

Parte della protezione crittografica odierna di Ethereum sarà compromessa quando i computer quantistici diverranno una realtà. Sebbene i computer quantistici siano probabilmente a decenni dall'essere una vera minaccia per la crittografia moderna, Ethereum ha una struttura che ne garantisce la sicurezza nei secoli a venire. Ciò significa rendere [Ethereum resistente ai computer quantistici](https://consensys.net/blog/developers/how-will-quantum-supremacy-affect-blockchain/), il prima possibile.

La sfida affrontata dagli sviluppatori di Ethereum è che l'attuale protocollo di proof-of-stake si affida a uno schema di firme molto efficiente, noto come BLS, per aggregare i voti su blocchi validi. Questo schema di firme è infranto dai computer quantistici, ma le alternative resistenti a essi non sono altrettanto efficaci.

Gli [schemi di impegno "KZG"](/roadmap/danksharding/#what-is-kzg) utilizzati in svariati punti su Ethereum per generare frasi segrete crittografiche sono noti per la loro vulnerabilità ai computer quantistici. Al momento, il problema viene eluso utilizzando le "configurazioni fidate", in cui molti utenti generano casualità non decodificabili da un computer quantistico. Tuttavia, la soluzione ideale sarebbe semplicemente incorporare, piuttosto, la crittografia sicura contro i computer quantistici. Esistono due approcci principali che potrebbero divenire efficienti sostituti per lo schema BLS: la firma [basata su STARK](https://hackmd.io/@vbuterin/stark_aggregation) e [basata su reticolo](https://medium.com/asecuritysite-when-bob-met-alice/so-what-is-lattice-encryption-326ac66e3175). Queste, sono ancora ricercate e prototipate.

<ButtonLink variant="outline-color" to="/roadmap/danksharding#what-is-kzg"> Leggi su KZG e le configurazioni fidate</ButtonLink>

## Un Ethereum più semplice ed efficiente {#simpler-more-efficient-ethereum}

La complessità crea opportunità per bug o vulnerabilità sfruttabili dagli utenti malevoli. Dunque, parte della tabella di marcia è semplificare Ethereum e rimuovere il codice rimanente dai vari aggiornamenti, ma non più necessario o migliorabile. Una base di codice più snella e semplice è, per gli sviluppatori, più facile da mantenere, nonché da ragionare.

Esistono diversi aggiornamenti che saranno apportati alla [Macchina Virtuale di Ethereum (EVM)](/developers/docs/evm), per renderla più semplice ed efficiente. Questi includono la [rimozione del codice operativo SELFDESTRUCT](https://hackmd.io/@vbuterin/selfdestruct): un comando raramente utilizzato e non più necessario che, in certe circostanze, può essere pericoloso da usare, specialmente quando combinato con altri aggiornamenti futuri al modello di archiviazione di Ethereum. Inoltre, i client di Ethereum supportano ancora i vecchi tipi di transazioni, che possono ora essere completamente rimossi. Anche il metodo di calcolo del gas è migliorabile e possono essere introdotti metodi più efficienti per il sostegno aritmetico di certe operazioni crittografiche.

Similmente, esistono aggiornamenti apportabili ad altre parti dei client odierni di Ethereum. Un esempio sono i client d'esecuzione e consenso odierni, che utilizzano un tipo di compressione dei dati differente. Sarebbe molto più facile e intuitivo condividere i dati tra i client, quando lo schema di compressione è unificato per l'intera rete.

## Stato attuale {#current-progress}

Gran parte degli aggiornamenti necessari per rendere Ethereum a prova di futuro sono ancora in fase di ricerca e potrebbero essere a distanza di svariati anni dall'essere implementati. Gli aggiornamenti come la rimozione di SELF-DESTRUCT e l'armonizzazione dello schema di compressione utilizzato nei client d'esecuzione e del consenso potrebbero arrivare prima della crittografia resistente ai computer quantistici.

**Letture consigliate**

- [Gas](/developers/docs/gas)
- [EVM](/developers/docs/evm)
- [Strutture di dati](/developers/docs/data-structures-and-encoding)
