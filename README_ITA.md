# [node-red-contrib-you-notify]

generic node for manage notify

il nodo utilizza la proprieta `msg.notify` per leggere i valori di notifica in base alla casistica e inviare il messaggio

## Type of Notify

### Adaptivecards/Teams Notify

questa tipologia va a generare un messagio seguendo lo schema previsto da Microsoft [Adaptive Cards](https://adaptivecards.io/explorer/)

in questa casistica i valori validi sotto msg.notify i seguenti:

- `title`: titolo della notifica da inviare *

- `status`: eventuale status da mostrare in notifica

- `statusText`: eventuale testo di stato da mostrare in notifica

- `icon`: eventuale icona da mostrare in notifica

- `object`: contenuto di notfica stroturato come definizione sotto riportata *

> *Required Value

#### Spiegazione campi

##### Title

valore : `string`

titolo da mostrare in notifica

##### Status

valore : `["init", "info", "success", "warn", "error"]`

in base al valore mostrerà nella parte alta della notifica un testo di un colore per segnalare lo stato 

i valori possibili sono:

- `init` (color : accent, text: "Initialitation" )

- `info` (color : light, text: "Information" )

- `warn` (color : warning, text: "Warning" )

- `success` (color: good, text: "Success")

- `error` (color: attention, text: "Error")

> i valori dei colori sono quando definito per il textBlock, per info vedi : [Schema Explorer | Adaptive Cards](https://adaptivecards.io/explorer/TextBlock.html)

##### StautsText

valore : `string`

testo che se valorizato sovrascrive il testo previsto per lo status con un valore personalizatto

##### Icon

valore: `WebUrl`

evetuale url ad una immagine da inserire in cima alla notifica / al fianco dello status

##### Object

valore : `Object`

contenuto della notifica 

in questo oggetto ogni proprieta sara inserita come valore in notifica

###### detaglio contenuto proprieta di Object

ogni proprieta di questo oggetto per essere considerata valida deve avere le seguenti prorieta:

- `type`: tipologia di contenuto

- `value`: valore di contenuto

- `config`: contenuto addizionale di stile - per info vedi [Schema Explorer | Adaptive Cards](https://adaptivecards.io/explorer/AdaptiveCard.html)

###### Tipologia Gestite

- `Text`: testo libero

- `ListKeyValue`: lista di valori 

- `Table`: Tabella di valori

#### Essempio di Oggetto completto

```javascript
msg.notify = {
      title : "ORDER#00001",
      status: "success", 
      statusText : "New Order form Customer"
      icon: "https://adaptivecards.io/content/airplane.png",
      object : { 
        hederMessage : {
          type: "Text",
          value : "New Order by Customer C00001",
          configs : {
            "spacing": "small",
            "size": "small",
            "weight": "bolder",
            "wrap": true,
          }
        },
        linearDetails: {
            type: "ListKeyValue",
            value : {
                "total" : "**12000**",
                "Type Delivery" : "OnSite"
            },
             configs : {
                "spacing": "large"
             }
        },
        itemsRows : {
          type: "Table",
          value : [{
            id: "0",
            item: "Box-Site",
            quantity : "28",
            desc: "Box-Site",
            price: "1192"
          },
            {
            id: "1",
            item: "AdditonalObject",
            quantity : "1",
            desc: "Additional-Serivce",
            price: "8"
          }]

        },
      },
  };
```

### Custom

Questa tipologia va ad inviare una richiesta post con il contenuto in `msg.notify` in `POST` al'url configurato

questa tipologia è totalmente libera per gestire l'eventuali casitiche non previste

## Nodi

### you-notify

nodo di configurazione

campi previsti:

- Name : nome della configurazione

- Url: link per l'invio della Notifica 

- Entity : tipologia di notifica da inviare

### you-notify-out

nodo per inviare le notifiche

#### Configs

campi previsti:

- Name: nome da assegnare al nodo

- you-notify: configurazione assegnata da utilizzare

#### input

il nodo utilizza la proprieta `msg.notify` come proprio input
