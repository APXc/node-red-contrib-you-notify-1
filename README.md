# @yousolution/node-red-contrib-you-notify

generic node for manage notify
the node uses the `msg.notify` property to read the notification values by case and send the message

## Type of Notify

### Adaptivecards/Teams Notify

This type generates a message following the scheme provided by Microsoft [Adaptive Cards](https://adaptivecards.io/explorer/).

The valid values under `msg.notify` are the following:

- `title`: title of the notification to be sent (required)
- `status`: optional status to be shown in the notification
- `statusText`: optional status text to be shown in the notification
- `icon`: optional icon to be shown in the notification
- `object`: notification content structured as defined below (required)

> *Required Value

#### Explanation of fields

##### Title

value : `string`

string with the title to be shown in the notification

##### Status

value : `["init", "info", "success", "warn", "error"]`

Displays colored text at the top of the notification to indicate the status.

available value:

- `init` (color : accent, text: "Initialitation" )

- `info` (color : light, text: "Information" )

- `warn` (color : warning, text: "Warning" )

- `success` (color: good, text: "Success")

- `error` (color: attention, text: "Error")

> colour values are when defined for the textBlock, for info see : [Schema Explorer | Adaptive Cards](https://adaptivecards.io/explorer/TextBlock.html)

##### StautsText

value : `string`

string that overrides the default status text with a custom value

##### Icon

value: `WebUrl`

URL of an optional image to be inserted in the notification

##### Object

value : `Object`

object containing the notification content


###### Details of the properties within Object

Each property must have the following characteristics:

- `type`: type of content (`Text`, `ListKeyValue`, `Table`)

- `value`: value of the content

- `config`: additional style content- for info see [Schema Explorer | Adaptive Cards](https://adaptivecards.io/explorer/AdaptiveCard.html)

###### Type of content 

- `Text`: Free Text

- `ListKeyValue`: Values List  

- `Table`: Table

#### Example of a complete Object

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

This type sends a POST request with the content in `msg.notify` to the configured URL. It is completely flexible to handle any cases not provided for.

## Nodes

### you-notify

Configuration node. 

Expected fields:

- `Name`: name of the configuration
- `Url`: link for sending the notification
- `Entity`: type of notification to be sent

### you-notify-out

Node for sending notifications

#### Configs

Expected fields:

- `Name`: name to be assigned to the node
- `you-notify`: assigned configuration to be used

#### Input

The node uses the property `msg.notify` as its input.