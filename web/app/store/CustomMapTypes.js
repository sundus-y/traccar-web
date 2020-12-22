Ext.define('Traccar.store.CustomMapTypes', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name'],

    data: [{
        key: 'Polygon',
        name: Strings.mapShapePolygon
    }, {
        key: 'Circle',
        name: Strings.mapShapeCircle
    }, {
        key: 'Point',
        name: Strings.mapShapePoint
    }]
});