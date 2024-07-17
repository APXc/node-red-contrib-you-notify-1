
const { generateAdaptiveCard, validateBySchema } = require('../utils/generateAdaptiveCard.js');
const axios = require('axios');

module.exports = function(RED) {
    function notifyOut(config) {
        RED.nodes.createNode(this, config);
        this.notify = config.notify;
        this.notifyConfig = RED.nodes.getNode(this.notify);
        let node = this;

        node.on('input', async function(msg) {
            if(msg.hasOwnProperty("notify")) {
                node.log(`Type: ${node.notifyConfig.options.typenotify}`)
                switch(node.notifyConfig.options.typenotify) {
                    case "AadaptiveCards": 
                        let testValid =  validateBySchema(msg.notify);
                        if(testValid) {
                            try{
                                let options = {
                                    method: 'POST',
                                    url: node.notifyConfig.options.url,
                                    rejectUnauthorized: false,
                                    data: generateAdaptiveCard(msg.notify),
                                    headers: {
                                    'Content-Type': 'application/json',
                                    },
                                };
                                await axios(options).then(() => {
                                    node.status({ fill: 'green', shape: 'dot', text: 'Success Send Notify' });
                                    node.send(msg);
                                });
                            }
                            catch (e) {
                                node.error(e, msg);
                                node.status({ fill: 'red', shape: 'dot', text: 'Error Generic' });
                            }
                        }
                        else {
                            node.error('Not Valid Notify Object', msg);
                            node.status({ fill: 'red', shape: 'dot', text: 'Not Valid Notify Object' });
                        }
                        break;
                    case "Custom":
                        if(!msg.notify) {
                            node.error('Not Valid Notify Object', msg);
                            node.status({ fill: 'red', shape: 'dot', text: 'Not Valid Notify Object' });
                        }
                        else {
                            let options = {
                                method: 'POST',
                                url: node.notifyConfig.options.url,
                                rejectUnauthorized: false,
                                data: msg.notify,
                                headers: {
                                'Content-Type': 'application/json',
                                },
                            };
                            await axios(options).then(() => {
                                node.status({ fill: 'green', shape: 'dot', text: 'Success Send Notify' });
                                node.send(msg);
                            });
                        }
                        break;
                    default:
                        node.error('Not Manage Type Notify', msg);
                        node.status({ fill: 'red', shape: 'dot', text: 'Not Manage Type Notify' });
                }
            }
            else {
                node.error('Not set a msg.notify props', msg);
                node.status({ fill: 'red', shape: 'dot', text: 'Not set a msg.notify props' });
            }
            
        });
    }
    RED.nodes.registerType("you-notify-out",notifyOut);
}
