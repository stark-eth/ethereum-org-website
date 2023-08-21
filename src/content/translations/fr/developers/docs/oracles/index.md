---
title: Oracles
description: Les oracles permettent aux contrats intelligents d'Ethereum d'accéder à des données du monde réel, débloquant ainsi davantage de cas d'utilisation et une plus grande valeur pour les utilisateurs.
lang: fr
---

Les oracles sont des flux de données qui apportent des données provenant de sources de données hors blockchain (off-chain) et les placent sur la blockchain (on-chain) pour que les contrats intelligents puissent les utiliser. Cela est nécessaire car les contrats intelligents fonctionnant sur Ethereum ne peuvent pas accéder aux informations stockées en dehors du réseau de la blockchain.

En donnant aux contrats intelligents la possibilité de s'exécuter en utilisant des entrées de données hors chaîne, on étend la valeur des applications décentralisées. Par exemple, les marchés de prédiction décentralisés s'appuient sur des oracles pour fournir des informations sur les résultats avec lesquels ils peuvent valider les prédictions des utilisateurs. Supposons qu'Alice parie 20 ETH sur qui deviendra le prochain président des États-Unis . Dans ce cas, la dApp du marché prédictif a besoin d'un oracle pour confirmer les résultats des élections et déterminer si Alice a droit à un paiement.

## Prérequis {#prerequisites}

Cette page suppose que le lecteur est familier avec les principes fondamentaux d'Ethereum, notamment des [nœuds](/developers/docs/nodes-and-clients/), [ des mécanismes de consensus](/developers/docs/consensus-mechanisms/), et de [l'EVM](/developers/docs/evm/). Vous devez également avoir une bonne connaissance des [contrats intelligents](/developers/docs/smart-contracts/) et de [l'anatomie des contrats intelligents](/developers/docs/smart-contracts/anatomy/), notamment des [événements](/glossary/#events).

## Qu'est-ce qu'un oracle blockchain ? {#what-is-a-blockchain-oracle}

Les oracles sont des applications qui génèrent, vérifient et transmettent des informations externes (c'est-à-dire des informations stockées hors chaîne) aux contrats intelligents fonctionnant sur la blockchain. En plus de « tirer » des données hors chaîne et de les diffuser sur Ethereum, les oracles peuvent également « pousser » des informations de la blockchain vers des systèmes externes. Un exemple de ce dernier pourrait être un oracle qui déverrouille une serrure intelligente une fois que l'utilisateur a envoyé les frais via une transaction Ethereum.

Les oracles agissent comme un « pont » reliant les contrats intelligents sur les blockchains aux fournisseurs de données hors chaîne. Sans oracles, les applications de contrats intelligents ne seraient en mesure d'accéder qu'aux données de la chaîne. Un oracle fournit un mécanisme pour déclencher des fonctions de contrat intelligent en utilisant des données hors chaîne.

Les oracles diffèrent en fonction de la source des données (une ou plusieurs sources), des modèles de confiance (centralisés ou décentralisés) et de l'architecture du système (lecture immédiate, publication-abonnement et demande-réponse). Nous pouvons également distinguer les oracles selon qu'ils récupèrent des données externes à utiliser par les contrats on-chain (oracles d'entrée), qu'ils envoient des informations de la blockchain aux applications off-chain (oracles de sortie) ou qu'ils effectuent des tâches de calcul off-chain (oracles de calcul).

## Pourquoi les contrats intelligents ont-ils besoin d'oracles ? {#why-do-smart-contracts-need-oracles}

La plupart des développeurs considèrent les contrats intelligents comme de simples morceaux de code exécutés à des adresses spécifiques sur la blockchain. Cependant, une vision plus [générale des contrats intelligents](/smart-contracts/) est qu'il s'agit de programmes logiciels auto-exécutoires capables de faire respecter les accords entre les parties une fois que des conditions spécifiques sont remplies - ce qui explique le terme « smart contracts. »

Mais l'utilisation de contrats intelligents pour faire respecter des accords entre personnes n'est pas simple, étant donné qu'Ethereum est déterministe. Un [système déterministe](https://en.wikipedia.org/wiki/Deterministic_algorithm) est un système qui produit toujours les mêmes résultats compte tenu d'un état initial et d'une entrée particulière - il n'y a pas de caractère aléatoire ou de variation dans le processus de calcul des sorties à partir des entrées.

Pour parvenir à une exécution déterministe, les blockchains limitent les nœuds visant à atteindre un consensus sur des questions binaires simples (vrai/faux) en utilisant _uniquement_ les données stockées sur la blockchain elle-même. Voici quelques exemples de ces questions :

- « Le propriétaire du compte (identifié par une clé publique) a-t-il signé cette transaction avec la clé privée appariée ? »
- « Ce compte dispose-t-il de suffisamment de fonds pour couvrir la transaction ? »
- « Cette transaction est-elle valable dans le contexte de ce contrat intelligent ? », etc.

Si les blockchains recevaient des informations de sources externes (c'est-à-dire du monde réel), le déterminisme serait impossible à atteindre, ce qui empêcherait les nœuds de s'accorder sur la validité des modifications apportées à l'état de la blockchain. Prenons l'exemple d'un contrat intelligent qui exécute une transaction sur la base du taux de change actuel ETH-USD obtenu à partir d'une API de prix traditionnelle. Ce chiffre est susceptible de changer fréquemment (sans compter que l'API peut être dépréciée ou piratée), ce qui signifie que des nœuds exécutant le même code de contrat arriveraient à des résultats différents.

Pour une blockchain publique, comme Ethereum, avec des milliers de nœuds dans le monde traitant des transactions, le déterminisme est essentiel. Sans autorité centrale servant de source de vérité, on s'attend à ce que les nœuds arrivent au même état après avoir appliqué les mêmes transactions. Un cas où le nœud A exécute le code d'un contrat intelligent et obtient « 3 » comme résultat, alors que le nœud B obtient « 7 » après avoir exécuté la même transaction, provoquerait la rupture du consensus et éliminerait la valeur d'Ethereum en tant que plateforme informatique décentralisée.

Le scénario décrit précédemment met également en évidence le problème que pose la conception de blockchains pour tirer des informations de sources externes. Les oracles, cependant, résolvent ce problème en prenant des informations de sources hors chaîne et en les stockant sur la blockchain pour que les contrats intelligents puissent les consommer. Les informations stockées sur la chaîne étant inaltérables et accessibles au public, les nœuds d'Ethereum peuvent utiliser en toute sécurité les données hors chaîne importées de l'oracle pour calculer les changements d'état sans rompre le consensus.

Pour ce faire, un oracle est généralement constitué d'un contrat intelligent fonctionnant sur la chaîne et de certains composants hors chaîne. Le contrat on-chain reçoit des demandes de données d'autres contrats intelligents, qu'il transmet au composant off-chain (appelé nœud oracle). Ce nœud oracle peut interroger des sources de données - en utilisant des interfaces de programmation d'applications (API), par exemple - et envoyer des transactions pour stocker les données demandées dans le stockage du contrat intelligent.

Essentiellement, un oracle de blockchain comble le fossé informationnel entre la blockchain et l'environnement externe, créant ainsi des « contrats intelligents hybrides ». Un contrat intelligent hybride est un contrat qui fonctionne sur la base d'une combinaison de code de contrat on-chain et d'infrastructure off-chain. Les marchés de prédiction décentralisés, décrits dans l'introduction, sont un excellent exemple de contrats intelligents hybrides. Parmi les autres exemples, on peut citer les contrats intelligents d'assurance récolte qui versent des indemnités lorsqu'un ensemble d'oracles détermine que certains phénomènes météorologiques ont eu lieu.

## Quel est le problème de l'oracle ? {#the-oracle-problem}

Il est facile de donner aux contrats intelligents un accès aux données hors chaîne en s'appuyant sur une entité (ou plusieurs entités) pour introduire des informations extrinsèques dans la blockchain en les stockant dans les données utiles d'une transaction. Mais cela pose de nouveaux problèmes :

- Comment vérifier que les informations injectées ont été extraites de la bonne source ou n'ont pas été altérées ?

- Comment s'assurer que ces données sont toujours disponibles et régulièrement mises à jour ?

Le « problème de l'oracle » illustre les problèmes liés à l'utilisation des oracles de la blockchain pour envoyer des données aux contrats intelligents. Il est essentiel de s'assurer que les données provenant d'un oracle sont correctes, sinon l'exécution du contrat intelligent produira des résultats erronés. Il est également important de ne pas avoir à faire confiance à des opérateurs d'oracle pour fournir des informations précises et fiables, ce qui prive les contrats intelligents de leurs principales qualités.

Les différents oracles diffèrent dans leur approche de la résolution du problème de l'oracle, et nous explorerons ces approches plus tard. Bien qu'aucun oracle ne soit parfait, les mérites d'un oracle doivent être mesurés en fonction de la façon dont il gère les défis suivants :

1. **Exactitude** : Un oracle ne doit pas amener les contrats intelligents à déclencher des changements d'état basés sur des données hors chaîne invalides. Pour cette raison, un oracle doit garantir _l'authenticité_ et _l'intégrité_ des données - l'authenticité signifie que les données ont été obtenues de la bonne source, tandis que l'intégrité signifie que les données sont restées intactes (c'est-à-dire qu'elles n'ont pas été modifiées) avant d'être envoyées sur la chaîne.

2. **Disponibilité** : Un oracle ne doit pas retarder ou empêcher les contrats intelligents d'exécuter des actions et de déclencher des changements d'état. Cette qualité exige que les données d'un oracle soient _disponibles sur demande_ sans interruption.

3. **Compatibilité incitative** : Un oracle devrait inciter les fournisseurs de données hors chaîne à soumettre des informations correctes aux contrats intelligents. La compatibilité incitative implique _l'imputabilité_ et _la responsabilité_. L'attribuabilité permet de corréler un élément d'information externe à son fournisseur, tandis que la responsabilité lie les fournisseurs de données aux informations qu'ils fournissent, de sorte qu'ils peuvent être récompensés ou pénalisés en fonction de la qualité des informations fournies.

## Comment fonctionne un service oracle blockchain ? {#how-does-a-blockchain-oracle-service-work}

### Utilisateurs {#users}

Les utilisateurs sont des entités (c'est-à-dire des contrats intelligents) qui ont besoin d'informations externes à la blockchain pour effectuer des actions spécifiques. Le flux de travail de base d'un service oracle commence par l'envoi par l'utilisateur d'une demande de données au contrat oracle. Les demandes de données répondent généralement à tout ou partie des questions suivantes :

1. Quelles sources les nœuds hors chaîne peuvent-ils consulter pour obtenir les informations demandées ?

2. Comment les journalistes traitent-ils les informations provenant des sources de données et extraient-ils les points de données utiles ?

3. Combien de nœuds d'oracle peuvent participer à la récupération des données ?

4. Comment gérer les divergences dans les rapports oracle ?

5. Quelle méthode doit être mise en œuvre pour filtrer les soumissions et agréger les rapports en une seule valeur ?

### Contrat Oracle {#oracle-contract}

Le contrat d'oracle est le composant sur la chaîne pour le service d'oracle : il écoute les demandes de données provenant d'autres contrats, relaie les demandes de données aux nœuds d'oracle et diffuse les données renvoyées aux contrats clients. Ce contrat peut également effectuer des calculs sur les points de données renvoyés pour produire une valeur agrégée qu'il envoie au contrat demandeur.

Le contrat de l'oracle expose certaines fonctions que les contrats clients appellent lorsqu'ils font une demande de données. À la réception d'une nouvelle requête, le contrat intelligent émettra un [événement de journal](/developers/docs/smart-contracts/anatomy/#events-and-logs) avec les détails de la demande de données. Cela notifie les nœuds hors chaîne abonnés au journal (généralement en utilisant quelque chose comme la commande JSON-RPC `eth_subscribe`), qui procèdent à la récupération des données définies dans l'événement du journal.

Vous trouverez ci-dessous un [exemple de contrat oracle](https://medium.com/@pedrodc/implementing-a-blockchain-oracle-on-ethereum-cedc7e26b49e) par Pedro Costa. Il s'agit d'un simple service oracle qui peut interroger des API hors chaîne à la demande d'autres contrats intelligents et stocker les informations demandées sur la blockchain :

```solidity
pragma solidity >=0.4.21 <0.6.0;

contract Oracle {
  Request[] requests; //list of requests made to the contract
  uint currentId = 0; //increasing request id
  uint minQuorum = 2; //minimum number of responses to receive before declaring final result
  uint totalOracleCount = 3; // Hardcoded oracle count

  // defines a general api request
  struct Request {
    uint id;                            //request id
    string urlToQuery;                  //API url
    string attributeToFetch;            //json attribute (key) to retrieve in the response
    string agreedValue;                 //value from key
    mapping(uint => string) answers;     //answers provided by the oracles
    mapping(address => uint) quorum;    //oracles which will query the answer (1=oracle hasn't voted, 2=oracle has voted)
  }

  //event that triggers oracle outside of the blockchain
  event NewRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch
  );

  //triggered when there's a consensus on the final result
  event UpdatedRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch,
    string agreedValue
  );

  function createRequest (
    string memory _urlToQuery,
    string memory _attributeToFetch
  )
  public
  {
    uint length = requests.push(Request(currentId, _urlToQuery, _attributeToFetch, ""));
    Request storage r = requests[length-1];

    // Hardcoded oracles address
    r.quorum[address(0x6c2339b46F41a06f09CA0051ddAD54D1e582bA77)] = 1;
    r.quorum[address(0xb5346CF224c02186606e5f89EACC21eC25398077)] = 1;
    r.quorum[address(0xa2997F1CA363D11a0a35bB1Ac0Ff7849bc13e914)] = 1;

    // launch an event to be detected by oracle outside of blockchain
    emit NewRequest (
      currentId,
      _urlToQuery,
      _attributeToFetch
    );

    // increase request id
    currentId++;
  }

  //called by the oracle to record its answer
  function updateRequest (
    uint _id,
    string memory _valueRetrieved
  ) public {

    Request storage currRequest = requests[_id];

    //check if oracle is in the list of trusted oracles
    //and if the oracle hasn't voted yet
    if(currRequest.quorum[address(msg.sender)] == 1){

      //marking that this address has voted
      currRequest.quorum[msg.sender] = 2;

      //iterate through "array" of answers until a position if free and save the retrieved value
      uint tmpI = 0;
      bool found = false;
      while(!found) {
        //find first empty slot
        if(bytes(currRequest.answers[tmpI]).length == 0){
          found = true;
          currRequest.answers[tmpI] = _valueRetrieved;
        }
        tmpI++;
      }

      uint currentQuorum = 0;

      //iterate through oracle list and check if enough oracles(minimum quorum)
      //have voted the same answer has the current one
      for(uint i = 0; i < totalOracleCount; i++){
        bytes memory a = bytes(currRequest.answers[i]);
        bytes memory b = bytes(_valueRetrieved);

        if(keccak256(a) == keccak256(b)){
          currentQuorum++;
          if(currentQuorum >= minQuorum){
            currRequest.agreedValue = _valueRetrieved;
            emit UpdatedRequest (
              currRequest.id,
              currRequest.urlToQuery,
              currRequest.attributeToFetch,
              currRequest.agreedValue
            );
          }
        }
      }
    }
  }
}
```

### Nœuds Oracle {#oracle-nodes}

Le nœud d'oracle est le composant hors chaîne du service d'oracle : il extrait des informations de sources externes, telles que des API hébergées sur des serveurs tiers, et les met sur la chaîne pour que les contrats intelligents puissent les consommer. Les nœuds Oracle écoutent les événements provenant du contrat d'oracle sur la chaîne et procèdent à l'exécution de la tâche décrite dans le journal.

Une tâche courante des nœuds Oracle consiste à envoyer une requête [HTTP GET](https://www.w3schools.com/tags/ref_httpmethods.asp) à un service d'API, à analyser la réponse pour en extraire les données pertinentes, à la formater en une sortie lisible par la blockchain et à l'envoyer sur la chaîne en l'incluant dans une transaction vers le contrat d'oracle. Le nœud oracle peut également être tenu d'attester de la validité et de l'intégrité des informations soumises à l'aide de « preuves d'authenticité », que nous étudierons plus loin.

Les oracles informatiques s'appuient également sur des nœuds hors chaîne pour effectuer des tâches de calcul intensif, qui ne seraient pas pratiques à exécuter sur la chaîne, compte tenu des coûts du gaz et des limites de taille des blocs. Par exemple, le nœud Oracle peut être chargé de générer un chiffre aléatoire vérifiable (par exemple, pour les jeux basés sur la blockchain).

## Modèles de conception Oracle {#oracle-design-patterns}

Il existe différents types d'oracles, notamment _lecture-immédiate_, _publier-s'abonner_, et _demande-réponse_. Les deux derniers sont les plus populaires parmi les contrats intelligents Ethereum. Vous trouverez ci-dessous une brève description des deux types de services oracle :

### Oracles publier-s'abonner {#publish-subscribe-oracles}

Un service oracle basé sur un mécanisme de publication et d'abonnement expose un « flux de données » que d'autres contrats peuvent lire régulièrement pour obtenir des informations. Dans ce cas, les données sont censées changer fréquemment, de sorte que les contrats clients doivent écouter les mises à jour des données dans le stockage de l'oracle. Un excellent exemple est un oracle qui fournit aux utilisateurs des informations sur le dernier cours de l'ETH-USD.

### Oracles requête-réponse {#request-response-oracles}

Une configuration requête-réponse permet au contrat client de demander des données arbitraires autres que celles fournies par un oracle de type publier-s'abonner. Les oracles requête-réponse sont idéaux dans les conditions suivantes :

- L'ensemble de données est trop grand pour être stocké dans l'espace de stockage d'un contrat intelligent

- Les utilisateurs n'auront besoin que d'une petite partie des données à un moment donné

Bien que plus complexes que les modèles publier-s'abonner, les oracles de requête-réponse sont fondamentalement ce que nous avons décrit dans la section précédente. L'oracle aura un composant on-chain qui reçoit une demande de données et la transmet à un nœud off-chain pour traitement.

Les utilisateurs qui interrogent les données doivent couvrir le coût de la récupération des informations à partir de la source hors chaîne. Le contrat du client doit également fournir des fonds pour couvrir les frais de gaz encourus par le contrat de l'oracle pour renvoyer la réponse via la fonction de rappel spécifiée dans la demande.

## Types d'oracles {#types-of-oracles}

### Oracles centralisés {#centralized-oracles}

Comme son nom l'indique, un oracle centralisé est contrôlé par une seule entité chargée d'agréger les informations hors chaîne et de mettre à jour les données du contrat de l'oracle selon les demandes. Les oracles centralisés sont efficaces car ils reposent sur une seule source de vérité. Ils peuvent même être préférables dans les cas où les jeux de données propriétaires sont publiés directement par le propriétaire avec une signature largement acceptée. Cependant, l'utilisation d'un oracle centralisé s'accompagne de divers problèmes :

#### Faibles garanties de correction {#low-correctness-guarantees}

Avec les oracles centralisés, il n'y a aucun moyen de confirmer si l'information fournie est correcte ou non. Le fournisseur d'oracle peut être « réputé », mais cela n'élimine pas la possibilité que quelqu'un se rebelle ou qu'un pirate manipule le système. Si l'oracle est corrompu, les contrats intelligents seront exécutés sur la base de mauvaises données.

#### Faible disponibilité {#poor-availability}

Les oracles centralisés ne sont pas garantis de toujours mettre les données hors chaîne à la disposition des autres contrats intelligents. Si le fournisseur décide de désactiver le service ou si un pirate informatique détourne le composant hors chaîne de l'oracle, votre contrat intelligent risque de subir une attaque par déni de service (DoS).

#### Mauvaise compatibilité des incitations {#poor-incentive-compatibility}

Les oracles centralisés ont souvent des incitations mal conçues ou inexistantes pour que le fournisseur de données envoie des informations exactes/altérées. Payer l'oracle pour ses services peut encourager un comportement honnête, mais cela peut ne pas être suffisant. Avec les contrats intelligents qui contrôlent d'énormes quantités de valeur, le gain de la manipulation des données de l'oracle est plus important que jamais.

### Oracles décentralisés {#decentralized-oracles}

Les oracles décentralisés sont conçus pour surmonter les limites des oracles centralisés en éliminant les points uniques de défaillance. Un service d'oracle décentralisé comprend plusieurs participants dans un réseau peer-to-peer qui forment un consensus sur les données hors chaîne avant de les envoyer à un contrat intelligent.

Un oracle décentralisé devrait (idéalement) être sans permission, sans confiance, et libre de toute administration par une partie centrale ; en réalité, la décentralisation parmi les oracles est un spectre. Il existe des réseaux d'oracles semi-décentralisés où tout le monde peut participer, mais avec un « propriétaire » qui approuve et supprime les nœuds en fonction des performances historiques. Il existe également des réseaux d'oracles entièrement décentralisés : ils fonctionnent généralement comme des blockchains autonomes et disposent de mécanismes de consensus définis pour coordonner les nœuds et sanctionner les mauvais comportements.

L'utilisation d'oracles décentralisés présente les avantages suivants :

### Hautes garanties de correction {#high-correctness-guarantees}

Les oracles décentralisés tentent d'assurer l'exactitude des données en utilisant différentes approches. Il s'agit notamment d'utiliser des preuves attestant de l'authenticité et de l'intégrité des informations renvoyées et de demander à plusieurs entités de s'accorder collectivement sur la validité des données hors chaîne.

#### Preuves d'authenticité {#authenticity-proofs}

Les preuves d'authenticité sont des mécanismes cryptographiques qui permettent la vérification indépendante d'informations extraites de sources externes. Ces preuves permettent de valider la source de l'information et de détecter les éventuelles altérations des données après leur récupération.

Voici quelques exemples de preuves d'authenticité :

**Preuves de la sécurité de la couche de transport (TLS)** : Les nœuds Oracle récupèrent souvent des données à partir de sources externes en utilisant une connexion HTTP sécurisée basée sur le protocole TLS (Transport Layer Security). Certains oracles décentralisés utilisent des preuves d'authenticité pour vérifier les sessions TLS (c'est-à-dire confirmer l'échange d'informations entre un nœud et un serveur spécifique) et confirmer que le contenu de la session n'a pas été modifié.

**Attestations de l'environnement d'exécution de confiance (TEE)** : Un [environnement d'exécution de confiance](https://en.wikipedia.org/wiki/Trusted_execution_environment) (TEE) est un environnement de calcul en bac à sable qui est isolé des processus opérationnels de son système hôte. Les TEE garantissent que tout code d'application ou toute donnée stockée/utilisée dans l'environnement de calcul conserve son intégrité, sa confidentialité et son immuabilité. Les utilisateurs peuvent également générer une attestation pour prouver qu'une instance d'application est exécutée dans l'environnement d'exécution de confiance.

Certaines classes d'oracles décentralisés exigent que les opérateurs de nœuds d'oracle fournissent des attestations TEE. Cela confirme à un utilisateur que l'opérateur du nœud exécute une instance du client oracle dans un environnement d'exécution de confiance. Les TEE empêchent les processus externes de modifier ou de lire le code et les données d'une application. Par conséquent, ces attestations prouvent que le nœud oracle a conservé les informations intactes et confidentielles.

#### Validation consensuelle des informations {#consensus-based-validation-of-information}

Les oracles centralisés reposent sur une source unique de vérité lorsqu'ils fournissent des données aux contrats intelligents, ce qui introduit la possibilité de publier des informations inexactes. Les oracles décentralisés résolvent ce problème en s'appuyant sur plusieurs nœuds d'oracle pour interroger les informations hors chaîne. En comparant les données provenant de plusieurs sources, les oracles décentralisés réduisent le risque de transmettre des informations invalides aux contrats on-chain.

Les oracles décentralisés, cependant, doivent gérer les divergences dans les informations récupérées de plusieurs sources hors chaîne. Pour minimiser les différences d'information et garantir que les données transmises au contrat de l'oracle reflètent l'opinion collective des nœuds de l'oracle, les oracles décentralisés utilisent les mécanismes suivants :

##### Vote/suivi de l'exactitude des données

Certains réseaux d'oracles décentralisés demandent aux participants de voter ou de miser sur l'exactitude des réponses aux requêtes de données (par exemple, « Qui a gagné les élections américaines de 2020 ? ») en utilisant le jeton natif du réseau. Un protocole d'agrégation regroupe ensuite les votes et les enjeux et considère la réponse soutenue par la majorité comme la réponse valide.

Les nœuds dont les réponses s'écartent de la réponse majoritaire sont pénalisés en voyant leurs jetons distribués à d'autres qui fournissent des valeurs plus correctes. Le fait d'obliger les nœuds à fournir une caution avant de fournir des données incite à des réponses honnêtes puisqu'on suppose qu'ils sont des acteurs économiques rationnels qui cherchent à maximiser les retours.

Le staking/vote protège également les oracles décentralisés contre les « attaques Sybil », où des acteurs malveillants créent des identités multiples pour faire le jeu du système de consensus. Cependant, le staking ne peut empêcher le « freeloading » (les nœuds d'oracle copiant les informations des autres) et la « validation paresseuse » (les nœuds d'oracle suivant la majorité sans vérifier eux-mêmes les informations).

##### Mécanismes du point de Schelling

[Le point de Schelling](<https://en.wikipedia.org/wiki/Focal_point_(game_theory)>) est un concept de la théorie des jeux qui suppose que plusieurs entités trouveront toujours par défaut une solution commune à un problème en l'absence de toute communication. Les mécanismes du point de Schelling sont souvent utilisés dans les réseaux d'oracles décentralisés pour permettre aux nœuds d'atteindre un consensus sur les réponses aux demandes de données.

Un premier exemple est [SchellingCoin](https://blog.ethereum.org/2014/03/28/schellingcoin-a-minimal-trust-universal-data-feed/), une proposition de flux de données où les participants soumettent des réponses à des questions « scalaires » (questions dont les réponses sont décrites par une magnitude, par exemple « quel est le prix de l'ETH ? »), accompagnées d'un dépôt. Les utilisateurs qui fournissent des valeurs comprises entre le 25e et le 75e [percentile](https://en.wikipedia.org/wiki/Percentile) sont récompensés, tandis que ceux dont les valeurs s'écartent largement de la valeur médiane sont pénalisés.

Bien que SchellingCoin n'existe pas aujourd'hui, un certain nombre d'oracles décentralisés - notamment [les oracles du protocole Maker](https://docs.makerdao.com/smart-contract-modules/oracle-module) - utilisent le mécanisme du point de Schelling pour améliorer la précision des données de l'oracle. Chaque Maker Oracle est constitué d'un réseau P2P hors chaîne de nœuds (« relayeurs » et « alimenteurs ») qui soumettent des prix de marché pour les actifs donnés en garantie et d'un contrat « Medianizer » en chaîne qui calcule la médiane de toutes les valeurs fournies. Une fois le délai spécifié écoulé, cette valeur médiane devient le nouveau prix de référence de l'actif associé.

Parmi les autres exemples d'oracles qui utilisent les mécanismes du point de Schelling, citons [Chainlink Off-Chain Reporting](https://docs.chain.link/docs/off-chain-reporting/) et Witnet. Dans les deux systèmes, les réponses des nœuds oracle du réseau pair-à-pair sont agrégées en une seule valeur agrégée, telle qu'une moyenne ou une médiane. Les nœuds sont récompensés ou punis en fonction de la mesure dans laquelle leurs réponses s'alignent ou s'écartent de la valeur globale.

Les mécanismes du point de Schelling sont intéressants car ils minimisent l'empreinte sur la chaîne (une seule transaction doit être envoyée) tout en garantissant la décentralisation. Ce dernier cas est possible parce que les nœuds doivent approuver la liste des réponses soumises avant qu'elle ne soit introduite dans l'algorithme qui produit la valeur moyenne/médiane.

### Disponibilité {#availability}

Les services décentralisés d'oracle assurent une haute disponibilité des données hors chaîne pour les contrats intelligents. Pour ce faire, il faut décentraliser à la fois la source d'information hors chaîne et les nœuds responsables du transfert de l'information dans la chaîne.

Cela garantit la tolérance aux pannes puisque le contrat de l'oracle peut s'appuyer sur plusieurs nœuds (qui s'appuient également sur plusieurs sources de données) pour exécuter des requêtes provenant d'autres contrats. La décentralisation au niveau de la source _et_ de l'opérateur de nœud est cruciale - un réseau de nœuds d'oracle servant des informations extraites de la même source se heurtera au même problème qu'un oracle centralisé.

Il est également possible pour les oracles basés sur les enjeux de sabrer les opérateurs de nœuds qui ne répondent pas rapidement aux demandes de données. Cela incite fortement les nœuds d'oracle à investir dans une infrastructure tolérante aux pannes et à fournir des données en temps voulu.

### Bonne compatibilité des incitations {#good-incentive-compatibility}

Les oracles décentralisés implémentent diverses conceptions d'incitation pour prévenir le comportement [Byzantin](https://en.wikipedia.org/wiki/Byzantine_fault) parmi les noeuds Oracle. Plus précisément, ils atteignent _l'attribuabilité_ et _la responsabilité_ :

1. Les nœuds Oracle décentralisés sont souvent tenus de signer les données qu'ils fournissent en réponse aux demandes de données. Ces informations aident à évaluer les performances historiques des nœuds Oracle, de sorte que les utilisateurs puissent filtrer les nœuds Oracle non fiables lorsqu'ils font des demandes de données. Un exemple est le [Système de réputation algorithmique](https://docs.witnet.io/intro/about/architecture#algorithmic-reputation-system) de Witnet.

2. Les oracles décentralisés - comme expliqué précédemment - peuvent exiger des nœuds qu'ils placent un enjeu sur leur confiance dans la véracité des données qu'ils soumettent. Si la demande est acceptée, cette mise peut être restituée avec des récompenses pour service honnête. Mais il peut également être réduit en cas d'information incorrecte, ce qui permet une certaine responsabilisation.

## Applications des oracles dans les contrats intelligents {#applications-of-oracles-in-smart-contracts}

Voici les cas d'utilisation courants des oracles dans Ethereum :

### Récupération des données financières {#retrieving-financial-data}

Les applications de [finance décentralisée](/defi/) (DeFi) permettent de prêter, d'emprunter et d'échanger des actifs de pair à pair. Cela nécessite souvent d'obtenir différentes informations liées à la finance, notamment des données sur les taux de change (pour calculer la valeur en monnaie fiduciaire des crypto-monnaies ou comparer les prix de deux jetons) et des données sur les marchés de capitaux (pour calculer la valeur d'actifs tokenisés, comme l'or ou le dollar américain).

Si vous envisagez de créer un protocole de prêt DeFi, par exemple, vous devrez interroger les prix actuels du marché pour les actifs (par exemple, ETH) déposés en garantie. Cela permet à votre contrat intelligent de déterminer la valeur des actifs donnés en garantie et de déterminer le montant qu'il peut emprunter au système.

Les « oracles de prix » (comme on les appelle souvent) les plus populaires dans DeFi comprennent les flux de prix Chainlink, le [flux de prix ouvert](https://compound.finance/docs/prices) de Compound Protocol, les [prix moyens pondérés dans le temps (TWAP)](https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles) d'Uniswap et les [Oracles Maker](https://docs.makerdao.com/smart-contract-modules/oracle-module). Il est conseillé de comprendre les réserves qui accompagnent ces oracles de prix avant de les intégrer à votre projet. Cet [article](https://blog.openzeppelin.com/secure-smart-contract-guidelines-the-dangers-of-price-oracles/) fournit une analyse détaillée des éléments à prendre en compte lorsque vous envisagez d'utiliser l'un des oracles de prix mentionnés.

Vous trouverez ci-dessous un exemple de la façon dont vous pouvez récupérer le dernier prix de l'ETH dans votre contrat intelligent en utilisant un flux de prix Chainlink :

```solidity
pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() public {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```

### Génération d'un caractère aléatoire vérifiable {#generating-verifiable-randomness}

Certaines applications blockchain, telles que les jeux ou les systèmes de loterie basés sur la blockchain, nécessitent un niveau élevé d'imprévisibilité et de nature aléatoire pour fonctionner efficacement. Cependant, l'exécution déterministe des blockchains élimine toute source d'aléa.

L'approche habituelle consiste à utiliser des fonctions cryptographiques pseudo-aléatoires, telles que le `blockhash`, mais elles peuvent être [manipulées par d'autres acteurs](https://ethereum.stackexchange.com/questions/3140/risk-of-using-blockhash-other-miners-preventing-attack#:~:text=So%20while%20the%20miners%20can,to%20one%20of%20the%20players.), à savoir les mineurs qui résolvent l'algorithme de preuve de travail. En outre, le [passage d'Ethereum à la preuve d'enjeu](/roadmap/merge/) signifie que les développeurs ne peuvent plus compter sur `blockhash` pour le caractère aléatoire sur la chaîne (le [mécanisme RANDAO](https://eth2book.info/altair/part2/building_blocks/randomness) de la chaîne Beacon fournit une source alternative de caractère aléatoire, cependant).

Il est possible de générer la valeur aléatoire hors chaîne et de l'envoyer en chaîne, mais cela impose des exigences de confiance élevées aux utilisateurs. Ils doivent croire que la valeur a réellement été générée par des mécanismes imprévisibles et qu'elle n'a pas été altérée en cours de route.

Les oracles conçus pour le calcul hors chaîne résolvent ce problème en générant de manière sécurisée des résultats aléatoires hors chaîne qu'ils diffusent sur la chaîne avec des preuves cryptographiques attestant de l'imprévisibilité du processus. Un exemple est le [VRF (Verifiable Random Function) de Chainlink](https://docs.chain.link/docs/chainlink-vrf/), qui est un générateur de nombres aléatoires (RNG) à l'épreuve de la falsification et d'une équité prouvée, utile pour construire des contrats intelligents fiables pour des applications qui reposent sur des résultats imprévisibles.

### Obtenir des résultats pour les événements {#getting-outcomes-for-events}

Avec les oracles, il est facile de créer des contrats intelligents qui répondent à des événements du monde réel. Les services Oracle rendent cela possible en permettant aux contrats de se connecter à des API externes par le biais de composants hors chaîne et de consommer des informations provenant de ces sources de données. Par exemple, la dApp de prédiction mentionnée précédemment peut demander à un oracle de renvoyer les résultats des élections à partir d'une source hors chaîne fiable (par exemple, l'Associated Press).

L'utilisation d'oracles pour récupérer des données en fonction de résultats réels permet d'autres cas d'utilisation novateurs, notamment des applications d'assurance décentralisées. Un contrat intelligent d'assurance qui paie les utilisateurs aura besoin d'informations précises (par exemple, des données météorologiques, des rapports de catastrophe, etc.) pour fonctionner efficacement.

### Automatisation des contrats intelligents {#automating-smart-contracts}

Contrairement aux descriptions populaires, les contrats intelligents ne s'exécutent pas automatiquement : un compte externe (EOA), ou un autre compte de contrat, doit déclencher les bonnes fonctions pour exécuter le code du contrat. Dans la plupart des cas, l'essentiel des fonctions du contrat sont publiques et peuvent être invoquées par les EOA et d'autres contrats.

Mais il existe également des _fonctions privées_ au sein d'un contrat qui sont inaccessibles aux autres ; elles sont généralement essentielles à la fonctionnalité globale de la dApp. Parmi les exemples potentiels, citons une fonction `mintERC721Token()` qui frappe périodiquement de nouveaux NFT pour les utilisateurs, une fonction d'attribution des gains dans un marché prédictif ou une fonction de déblocage des jetons mis en jeu dans un DEX.

Les développeurs devront déclencher ces fonctions à intervalles réguliers pour assurer le bon fonctionnement de l'application. Toutefois, cela pourrait entraîner une augmentation du nombre d'heures perdues sur des tâches banales pour les développeurs, d'où l'intérêt d'automatiser l'exécution des contrats intelligents.

Certains réseaux d'oracle décentralisés offrent des services d'automatisation, qui permettent aux nœuds d'oracle hors chaîne de déclencher des fonctions de contrat intelligent en fonction de paramètres définis par l'utilisateur. En général, il faut pour cela « enregistrer » le contrat cible auprès du service d'oracle, fournir des fonds pour payer l'opérateur d'oracle et spécifier les conditions ou les moments de déclenchement du contrat.

Le [réseau Keeper](https://chain.link/keepers) de Chainlink en est un exemple. Il offre aux contrats intelligents la possibilité d'externaliser les tâches de maintenance régulières d'une manière décentralisée et avec un minimum de confiance. Lisez la [documentation officielle de Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/) pour savoir comment rendre votre contrat compatible avec Keeper et utiliser le service Upkeep.

## Utiliser les oracles de la blockchain {#use-blockchain-oracles}

Il existe de multiples applications oracle que vous pouvez intégrer dans votre dApp Ethereum :

**[Chainlink](https://chain.link/)** - _Les réseaux d'oracles décentralisés Chainlink fournissent des entrées, des sorties et des calculs inviolables pour prendre en charge des contrats intelligents avancés sur n'importe quelle blockchain._

**[Witnet](https://witnet.io/)** - _Witnet est un oracle sans permission, décentralisé et résistant à la censure, qui aide les contrats intelligents à réagir aux événements du monde réel avec de solides garanties crypto-économiques._

**[UMA Oracle](https://uma.xyz)** - _L'oracle optimiste d'UMA permet aux contrats intelligents de recevoir rapidement tout type de données pour différentes applications, notamment les assurances, les produits dérivés financiers et les marchés prédictifs._

**[Tellor](https://tellor.io/)** - _Tellor est un protocole oracle transparent et sans permission permettant à votre contrat intelligent d'obtenir facilement toutes les données dont il a besoin._

**[Band Protocol](https://bandprotocol.com/)** - _Band Protocol est une plateforme d'oracle de données inter-chaînes qui agrège et connecte les données du monde réel et les API aux contrats intelligents._

**[Paralink](https://paralink.network/)** - _Paralink fournit une plateforme oracle open source et décentralisée pour les contrats intelligents fonctionnant sur Ethereum et d'autres blockchains populaires._

**[Réseau Pyth](https://pyth.network/)** - _Pyth network est un réseau d'oracles novateur délivrant des données financières, mis au point pour relier en temps réel les données du monde réel à la blockchain dans un écosystème de blockchains autonomes, décentralisées, et résistantes aux attaques. _

## Lecture complémentaire {#further-reading}

**Articles**

- [Qu'est-ce qu'un Oracle Blockchain ?](https://chain.link/education/blockchain-oracles) — _Chainlink_
- [Qu'est-ce qu'un Oracle Blockchain ?](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72) — _Patrick Collins_
- [Oracles décentralisés : un aperçu complet](https://medium.com/fabric-ventures/decentralised-oracles-a-comprehensive-overview-d3168b9a8841) — _Julien Thevenard_
- [Implémentation d'un Oracle Blockchain sur Ethereum](https://medium.com/@pedrodc/implementing-a-blockchain-oracle-on-ethereum-cedc7e26b49e) – _Pedro Costa_
- [Pourquoi les contrats intelligents ne peuvent-ils pas faire d'appels d'API ?](https://ethereum.stackexchange.com/questions/301/why-cant-contracts-make-api-calls) — _StackExchange_
- [Pourquoi nous avons besoin d'oracles décentralisés](https://newsletter.banklesshq.com/p/why-we-need-decentralized-oracles) — _Bankless_
- [Vous voulez donc utiliser un oracle de prix](https://samczsun.com/so-you-want-to-use-a-price-oracle/) — _samczsun_

**Vidéos**

- [Les oracles et l'expansion de l'utilité de la blockchain](https://youtu.be/BVUZpWa8vpw) — _Real Vision Finance_

**Tutoriels**

- [Comment obtenir le prix actuel d'Ethereum dans Solidity ?](https://blog.chain.link/fetch-current-crypto-price-data-solidity/) — _Chainlink_

**Exemples de projets**

- [Projet de démarrage complet Chainlink pour Ethereum en Solidity](https://github.com/hackbg/chainlink-fullstack) — _HackBG_
