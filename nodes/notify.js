module.exports = function (RED)  {
    function NotifyNode(n) {
        RED.nodes.createNode(this, n);

        this.options = {
            name : n.name || n.id,
            url : n.url || "",
            typenotify : n.typenotify || ""
        }
    }

    RED.nodes.registerType('you-notify', NotifyNode);
}