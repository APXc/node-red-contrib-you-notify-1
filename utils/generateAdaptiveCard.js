const Ajv = require('ajv');
const ajv = new Ajv();

const draftSchemaKey = 'http://json-schema.org/draft-07/schema';
if (!ajv.getSchema(draftSchemaKey)) {
  const draftSchema = require('ajv/dist/refs/json-schema-draft-07.json');
  ajv.addMetaSchema(draftSchema);
}


const jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "Notify Schema",
    "type": "object",
    "default": {},
    "required": [
        "object"
    ],
    "additionalProperties": false,
    "properties": {
        "title": {
            "title": "The title Schema",
            "type": "string",
            "default": ""
        },
        "status": {
            "title": "The status Schema",
            "type": "string",
            "enum": ["init", "info", "success", "warn", "error"],
            "default": "info"
        },
        "statusText": {
            "title": "The status Schema",
            "type": ["string", "null"],
            "default": ""
        },
        "icon": {
            "title": "The icon Schema",
            "type": "string",
            "default": ""
        },
        "object": {
            "title": "The object Schema",
            "type": "object",
            "default": {},
            "required": [],
            "additionalProperties": true,
            "properties": {}
        }
    }
};





const stauts = {
    "INFO" : {
        color: "light",
        text : "Information"
    },
    "INIT" : {
        color: "accent",
        text: "Initialitation"
    },
    "WARN" : {
        color: "warning",
        text: "Warning"
    },
    "SUCCESS" : {
        color: "good",
        text : "Success",
    },
    "ERROR": {
        color: "attention",
        text: "Error"
    }
}

function validateBySchema(object) {
    const validate = ajv.compile(jsonSchema);
    return validate(object);
}


function generateAdaptiveCard(notify) {
    let vector = {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "body" : []
    }
    if(notify.hasOwnProperty('status') || notify.hasOwnProperty('icon')) {
       
        let object = {
            "type": "Container",
            "style": "emphasis",
            "items": [
              {
                "type": "ColumnSet",
                "columns": []
              }
            ],
            "bleed": true
        };

        if(notify.hasOwnProperty('status')){
            let statusObject = stauts[notify.status.toUpperCase()];
            object.items[0].columns.push( {
                "type": "Column",
                "items": [
                  {
                    "type": "TextBlock",
                    "size": "large",
                    "weight": "bolder",
                    "text": `**${ notify.hasOwnProperty('statusText') ?  notify.statusText.trim() : statusObject.text.trim()}**`,
                    "color": statusObject.color,
                    "style": "heading",
                    "wrap": true
                  }
                ],
                "width": "stretch"
              });
        }

        if(notify.hasOwnProperty('icon')){
            object.items[0].columns.push({
                "type": "Column",
                "items": [
                  {
                    "type": "Image",
                    "url": notify.icon,
                    "altText": "ICON",
                    "height": "30px"
                  }
                ],
                "width": "auto"
              })
        }
        vector.body.push(object);
    }

    if(notify.hasOwnProperty('title')){
        let object = {
                "type": "TextBlock",
                "size": "medium",
                "weight": "bolder",
                "text":  `**${notify.title}**`,
                "style": "heading",
                "wrap": true
        };
        vector.body.push(object);
    }

    let keyOfObject = Object.keys(notify.object);

    for( let key of keyOfObject) {
        let typeOfObject = notify.object[key].type.toUpperCase();
        let object = null;
        let tableHead = null;
        let tableRows = [];
        switch(typeOfObject) {
            case "TEXT" : 
                object = {
                    "type": "TextBlock",
                    "text": notify.object[key].value || "", 
                    "wrap": true,
                     ...notify.object[key].configs  || {}
                };
                break;
            case "LISTKEYVALUE" : 
                let buildValue = [];
                let keys = Object.keys(notify.object[key].value || {});
                for (let key2 of keys) {
                    buildValue.push(
                        {
                            "title": key2,
                            "value":notify.object[key].value[key2]
                        }
                    );
                }
                object = {
                    "type": "FactSet",
                    "spacing": "large",
                    "facts" : buildValue,
                    ...notify.object[key].configs  || {}
                }
                break;
            case "TABLE" : 
                let buildColumValue = [];
                let keysColum = Object.keys(notify.object[key].value[0] || {});
                for (let key of keysColum) {
                    buildColumValue.push(
                        {
                            "type": "Column",
                            "items": [
                              {
                                "type": "TextBlock",
                                "weight": "bolder",
                                "text": key,
                                "wrap": true
                              }
                            ],
                            "width": "auto"
                          },
                    );
                }

                tableHead = {
                    "type": "Container",
                    "spacing": "large",
                    "style": "emphasis",
                    "bleed": true,
                    "items" : [
                        {
                            "type": "ColumnSet",
                            "columns" : buildColumValue
                        }
                    ]
                };

                for( let obj of notify.object[key].value || []){
                    let keyOfCurrentObject = Object.keys(obj);
                    let tempRow = [];
                    for(let key of keyOfCurrentObject){
                        tempRow.push(
                            {
                                "type": "Column",
                                "width": "auto",
                                "items" : [
                                    {
                                        "type": "TextBlock",
                                        "text": obj[key],
                                        "wrap": true
                                    }
                                ]
                            }
                        )
                    }

                    let rowObject = {
                        "type": "Container",
                        "items": [
                           {
                            "type": "ColumnSet",
                            "columns" : tempRow
                           }
                        ]
                    }

                    tableRows.push(rowObject); 
                }
                break;
        }

        if( typeOfObject == "TABLE") {
            if(tableHead) {
                vector.body.push(tableHead);
                vector.body = vector.body.concat(...tableRows);
            }
        }
        else {
            if(object) {
                vector.body.push(object);
            }
        }
    }

    return {
        "type": "message",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.adaptive",
                    "contentUrl": null,
                    "content": vector
                }
            ]
    };
}
  

module.exports = {
    generateAdaptiveCard,
    validateBySchema
};
