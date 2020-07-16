import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';

import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { CrossTabAnalysisRequest } from '../shared/crosstab-analysis-request';
import { CrossTabAnalysisResponse } from '../shared/crosstab-analysis-response';
import { CrossTabAnalysisData } from '../shared/crosstab-analysis-data';
import { StatusBarPanelComponent } from '../status-bar-panel/status-bar-panel.component';

import { inspect } from 'util';

@Component({
    selector: 'crosstab-analysis',
    templateUrl: './crosstab-analysis.component.html',
    styleUrls: ['../shared/analysis.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class CrossTabAnalysisComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    private gridOptions: GridOptions;
    public statusBar;

    @Input() initChart: string;
    @Input() initDatasource: string;
    @Input() initFilter: string;
    @Input() initVariable: string;

    datasource: string;
    variable1Name: string;
    variable2Name: string;
    datasources: any = [];
    variables: any = [];
    filters: any = [];


    initChartType: string;
    chart: any;
    parameterForm: FormGroup;
    datasourceSelect: string;

    request: CrossTabAnalysisRequest;
    rowData: any = [];

    public rowSelection: any;
    public frameworkComponents: any;


    columnDefs = [
        { headerName: 'row', field: 'row', sortable: true, filter: true, ColId: 'variableCol' },
        { headerName: 'valueList', field: 'valueList', rowGroup: true, hide: true },
        { field: 'key' },
        { field: 'value' },
    ];
    constructor(private fb: FormBuilder, private http: HttpClient, public restApi: RestApiService) {

    }

    ngOnInit() {

        this.loadDataSources();
        this.datasource = this.initDatasource;
        this.request = new CrossTabAnalysisRequest();
        this.request.dataSourceName = this.datasource;

        this.getFilters();
        this.request.filterName = this.initFilter;

        this.getVariables();
        this.parameterForm = this.fb.group({
            variable1Control: [this.variables],
            variable2Control: [this.variables],
            filterControl: [this.initFilter]
        });
        console.log('variable1 : ' + this.variable1Name + ', filter : ' + this.initFilter);
        this.request.suppressNulls = false;
        this.getCrossTabAnalysis();

        this.initChartType = this.initChart;
        this.rowSelection = 'multiple';

        this.frameworkComponents = {
            statusBarPanelComponent: StatusBarPanelComponent
        };
        this.statusBar = {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent' },
                { statusPanel: 'statusBarPanelComponent' },
                {
                    statusPanel: 'agAggregationComponent',
                    statusPanelParams: {
                        aggFuncs: ['count', 'sum']
                    }
                }
            ]
        };
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    onFirstDataRendered(event: any) {
        console.log('data onFirstDataRendered()...');
        //
        this.gridApi.sizeColumnsToFit();

    }

    onRowDataChanged(params) {
        console.log('data onRowDataChanged()...');
        this.gridApi.sizeColumnsToFit();
        if (this.initChartType && this.chart) {
            this.chart.destroyChart();
            console.log("chart type = " + this.initChartType);
            if (this.initChartType === 'pie') {
                this.pieChart();
            } else {
                this.stackedBarChart();
            }
        }
    }


    loadDataSources() {
        return this.restApi.getDataSources().subscribe((data: {}) => {
            this.datasources = data;
        });
    }

    onDataSourceChange(value: string) {
        this.datasource = value;
        this.getVariables();
        this.getFilters();
        this.request.dataSourceName = value;
        this.getCrossTabAnalysis();
    }

    onFilterChange(value: string) {
        this.request.filterName = value;
        this.getCrossTabAnalysis();
    }

    onVariable1Change(value: string) {
        this.request.variable1Name = value;
        console.log('variable1 : ' + value);
        this.getCrossTabAnalysis();
        //const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        //variableColDef.headerName = value;
        //this.gridApi.refreshHeader();
    }

    onVariable2Change(value: string) {
        this.request.variable2Name = value;
        console.log('variable2 : ' + value);
        this.getCrossTabAnalysis();
        //const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        //variableColDef.headerName = value;
        //this.gridApi.refreshHeader();
    }

    onNullableChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.suppressNulls = value.currentTarget.checked;
        this.getCrossTabAnalysis();
    }

    onNoZeroChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.noZeros = value.currentTarget.checked;
        this.getCrossTabAnalysis();
    }

    getVariables() {
        return this.restApi.getVariables(this.datasource).subscribe((data: {}) => {
            this.variables = data;
        });
    }

    getFilters() {
        return this.restApi.getFilters(this.datasource).subscribe((data: {}) => {
            this.filters = data;
        });
    }

    getColumns(jsonData) {
        let cols: Array<string> = [];
        var val = jsonData[0];
        for (var j in val) {
            var sub_key = j;
            var sub_val = val[j];
            cols.push(sub_key.trim())
        }
        return cols;
    }

    getCrossTabAnalysis() {
        this.restApi.getCrossTabAnalysis(this.request).subscribe(
            data => {
                try {
                    //console.log(JSON.stringify(data.crossTabAnalysisData));
                    this.gridApi.setRowData(data.crossTabAnalysisData, error => { console.log(error) });
                }
                catch (Error) {
                    console.log(Error.message);
                }   
            }
        );
    }

    pieChart() {
        const cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        const chartRangeParams = {
            cellRange: cellRange,
            chartType: 'pie'
        };
        this.initChartType = 'pie';
        this.chart = this.gridApi.createRangeChart(chartRangeParams);
    }

    stackedBarChart() {
        const cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        const chartRangeParams = {
            cellRange: cellRange,
            chartType: 'stackedBar'
        };
        this.initChartType = 'bar';
        this.chart = this.gridApi.createRangeChart(chartRangeParams);
    }
}