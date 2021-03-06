/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.Report', {
    extend: 'Ext.panel.Panel',
    xtype: 'reportView',

    requires: [
        'Traccar.view.ReportController',
        'Traccar.view.GridPanel'
    ],

    controller: 'report',

    title: Strings.reportTitle,

    tools: [{
        type: 'close',
        tooltip: Strings.sharedHide,
        handler: 'hideReports'
    }],

    tbar: {
        scrollable: true,
        items: [{
            xtype: 'tbtext',
            html: Strings.sharedType
        }, {
            xtype: 'combobox',
            reference: 'reportTypeField',
            store: 'ReportTypes',
            displayField: 'name',
            valueField: 'key',
            editable: false,
            listeners: {
                change: 'onTypeChange'
            }
        }, '-', {
            text: Strings.reportConfigure,
            reference: 'reportConfigButton',
            handler: 'onConfigureClick'
        }, '-', {
            text: Strings.reportShow,
            reference: 'showButton',
            disabled: true,
            handler: 'onReportClick'
        }, {
            text: Strings.reportExport,
            reference: 'exportButton',
            disabled: true,
            handler: 'onReportClick'
        }, {
            text: Strings.reportEmail,
            reference: 'emailButton',
            disabled: true,
            hidden: true,
            handler: 'onReportClick'
        }, new Ext.SplitButton({
            text: Strings.govReports,
            reference: 'govReports',
            disabled: true,
            hidden: true,
            menu: new Ext.menu.Menu(
                {
                    items: [
                        {
                            text: Strings.reportExportIndividual,
                            glyph: 'xf1c3@FontAwesome',
                            reference: 'exportIndividual',
                            handler: 'onReportClick'
                        }, {
                            text: Strings.reportExportGroup,
                            glyph: 'xf1c3@FontAwesome',
                            reference: 'exportGroup',
                            handler: 'onReportClick'
                        }, {
                            text: Strings.reportEmailIndividual,
                            glyph: 'xf003@FontAwesome',
                            reference: 'emailIndividual',
                            handler: 'onReportClick'
                        }, {
                            text: Strings.reportEmailGroup,
                            glyph: 'xf003@FontAwesome',
                            reference: 'emailGroup',
                            handler: 'onReportClick'
                        }
                    ]
                }
            )
        }), {
            text: 'Export GPX',
            reference: 'exportGPXButton',
            disabled: true,
            handler: 'onReportClick'
        }, {
            text: Strings.reportClear,
            handler: 'onClearClick'
        }]
    },

    layout: 'card',

    items: [{
        xtype: 'customGridPanel',
        itemId: 'grid',
        listeners: {
            selectionchange: 'onSelectionChange'
        },
        columns: {
            defaults: {
                flex: 1,
                minWidth: Traccar.Style.columnWidthNormal
            },
            items: [
            ]
        },
        style: Traccar.Style.reportGridStyle
    }, {
        xtype: 'cartesian',
        itemId: 'chart',
        plugins: {
            ptype: 'chartitemevents',
            moveEvents: true
        },
        store: 'ReportRoute',
        axes: [{
            title: Strings.reportChart,
            type: 'numeric',
            position: 'left'
        }, {
            type: 'time',
            position: 'bottom',
            fields: ['fixTime']
        }],
        listeners: {
            itemclick: 'onChartMarkerClick'
        },
        insetPadding: Traccar.Style.chartPadding
    }]
});
