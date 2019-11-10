Ext.define('Traccar.store.DevicesTree', {
    extend: 'Ext.data.TreeStore',

    parentIdProperty: 'groupId',

    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },

    constructor: function () {
        this.callParent(arguments);

        Ext.getStore('Groups').on({
            scope: this,
            load: this.onGroupLoad,
            update: this.onGroupUpdate
        });

        Ext.getStore('Devices').on({
            scope: this,
            load: this.onDeviceLoad,
            update: this.onDeviceUpdate
        });
    },

    reloadData: function () {
        var groupsStore, devicesStore, nodes = [];
        groupsStore = Ext.getStore('Groups');
        devicesStore = Ext.getStore('Devices');

        function getGroupName(id) {
            var group, store;
            if (id !== 0) {
                store = Ext.getStore('AllGroups');
                if (store.getTotalCount() === 0) {
                    store = Ext.getStore('Groups');
                }
                group = store.getById(id);
                return group ? group.get('name') : id;
            }
        }

        groupsStore.each(function (record) {
            var groupId, node = {
                id: getGroupName(record.get('id')),
                original: record,
                leaf: true
            };
            groupId = record.get('groupId');
            if (groupId !== 0 && groupsStore.indexOfId(groupId) !== -1) {
                node.groupId = getGroupName(groupId);
            }
            nodes.push(node);
        }, this);
        if (Traccar.app.getUser().get('administrator')) {
            nodes.push({
                id: "NA",
                original: null,
                leaf: true
            });
        }
        devicesStore.each(function (record) {
            var groupId, node = {};
            Object.keys(record.data).forEach(function (key) {
                node[key] = record.data[key];
            });
            node['groupId'] = 'NA';
            node['id'] = 'd' + record.get('id');
            node['original'] = record;
            node['name'] = record.get('name');
            node['status'] = record.get('status');
            node['lastUpdate'] = record.get('lastUpdate');
            node['leaf'] = true;
            groupId = record.get('groupId');
            if (groupId !== 0 && groupsStore.indexOfId(groupId) !== -1) {
                node.groupId = getGroupName(groupId);
            }
            nodes.push(node);
        }, this);

        this.getProxy().setData(nodes);
        this.load();
    },

    onGroupLoad: function () {
        console.log('onGroupLoad');
        this.reloadData();
    },

    onDeviceLoad: function () {
        console.log('onDeviceLoad');
        this.reloadData();
    },

    onGroupUpdate: function () {
        console.log('onGroupUpdate');
        // this.reloadData();
    },

    onDeviceUpdate: function (a,b,c) {
        console.log('onDeviceUpdate');
        // this.reloadData();
    }
});