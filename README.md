# Sand

Partage de petits fichiers\* de façon sécurisée avec RSA.

> \* ne supportes pas les binaires

## Exécution avec Python 3.9.2

Préparation de l'environnement

```bash
$ python3 -m venv .
$ source bin/activate
$ pip install -r requirements.txt
```

Lancement

```bash
$ python3 -m flask --app src/app.py run
```

## Ressources utilisés

-   [Rilu](https://github.com/alisinisterra/Rilu) (police)
-   [Forge](https://github.com/digitalbazaar/forge) (nombres premiers)
-   [bigint-mod-arith](https://github.com/juanelas/bigint-mod-arith) (inverse modulaire)

## Fonctionnement

### Explication

Le but est que le serveur n'est jamais accès :

-   au fichier déchiffré
-   aux clefs permettant de lire le fichier

Pour cela, tout le chiffrement est fait en local dans le navigateur.
Lors de la réception du fichier, une paire de clef RSA (sur 1024 bits) est créer.

À cause des limitations du Javascript, la clef est limitée à 1024 bits, sinon le
chiffrement est trop long. Aussi la taille des fichiers est limitée à environ 500 ko.

À cause de RSA, il est recommandé de n'envoyer que des petits fichiers de
quelques octets, plus le fichier est lourd, plus le chiffrement sera long.
Pendant le chiffrement, l'interface se figera car les calculs sont faits sur
le thread principal.

Le fichier reçu est ensuite chiffré avec la clef secrète générée précédemment.
Le nom du fichier est également chiffré avec la même clef.

Les deux chiffrés sont envoyés au serveur. Un hash du fichier chiffré est généré
par le serveur, cet hash ainsi que le nom du fichier chiffré est stocké dans une
base de données SQLite, le fichier est quant à lui enregistrer sur le disque (par
défaut dans le dossier `uploads/` avec comme nom de fichier l'hash).

L'hash est renvoyé par le serveur au client, une fois reçu le client affiche
à l'utilisateur l'URL pour télécharger le fichier, qui se présente ainsi :

<center><code>HTTP(S)://IP:PORT/file/HASH#CLEF</code></center>

La clef publique étant composé du module de chiffrement (`n`) et de l'exposant de
chiffrement (`e`), les deux nombres sont séparés, soit `CLEF` = `e:n`.

Quand le second utilisateur clique sur le lien, il peut donc télécharger le fichier
car :

-   l'hash permettant de demander au serveur le fichier est contenu dans la
    première partie de l'URL (avant le #)
-   la clef permettant de déchiffrer le chiffré est contenue dans la seconde partie
    de l'URL (après le #)

Le nom du fichier est stocké pour permettre de garder le même nom de fichier
quand on reçoit le fichier.

**Le serveur ne connaît donc jamais la clef permettant de déchiffrer les fichiers
qu'il reçoit et stocke.**

### Implémentation et limite

Pour le chiffrement, je transforme le fichier en base64, puis je regarde le code
ASCII, par exemple "<3" devient "060051" pour 60 et 51. Je vais devoir convertir
mes string en bigint pour le chiffrement RSA, alors pour rester dans la limite de
bigint, je garde la taille de mes strings fixe à max 100 caractères. Au maximum un
code ASCII est composé de 3 chiffres alors je sais que pour retrouver mes chiffres
je vais devoir découper mon string tous les 3 caractères. Pour garder mon code
"060051" qui sera `60051` en int, j'ajoute un `1` au début, que je retirerais
lors de la transformation en bigint. Ces opérations sont faites dans le fichier
`rsa.js` (cf. l'arborescence expliquée en dessous) dans `str_to_int`
et `int_to_str`. Cette implémentation n'est pas optimisée et c'est ce qu'il
faudrait changer pour pouvoir supporter les fichiers binaires.

Le chiffrement se fait donc par bloc, tous les 100 chiffres, dans `RSA_enc_data`.

Le fait que JS ne gère pas aussi bien les très gros nombre que Python est un
problème qui fragilise encore plus le RSA, car je dois envoyer le chiffré découpé
par des virgules tous les x caractères pour qu'il soit correctement déchiffré. Ce
qui rend reconnaissable le chiffré produit car il contient une suite de nombres
séparés régulièrement par des virgules.

#### Organisation du projet

```
src
├── app.py ------------> Point d'entrée pour lancer l'application
├── config.py ---------> Configuration globale + télécharge les dépendances
├── public ------------> Accessible depuis le client
│  ├── js
│  │  ├── download.js -> Gère la partie téléchargement
│  │  ├── index.js ----> Gère la partie téléversement
│  │  └── rsa.js ------> Implémentation de RSA
│  └── styles
│     └── style.css
├── routes
│  ├── api ------------> /api
│  │  ├── download.py -> /api/download -> Envoie les données au client
│  │  └── upload.py ---> /api/upload ---> Reçoit les données du client
│  ├── file.py --------> /file ---------> Interface de téléchargement
│  └── index.py -------> / -------------> Interface de téléversement
├── templates ---------> Fichier HTML
│  ├── download.html
│  └── index.html
└── utils
   ├── font.py -------> Permets de télécharger la police
   ├── libjs.py ------> Permets de télécharger la librarie Javascript
   ├── misc.py -------> Entre autres, implémente la fonction de hashage
   └── sqlite.py -----> Gère ce qui est en rapport avec SQLite
```

### Schéma récapitulatif

<!-- Excalidraw URL: https://excalidraw.com/#json=140empN7z1NEAYRzKaqGT,LWw3rGV3z46-I724iAoCdQ -->

![](https://i.imgur.com/IPhwrUZ.png)
