import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { FrequencyAnalysisRequest } from '../shared/frequency-analysis-request';
import { StatusBarPanelComponent } from '../status-bar-panel/status-bar-panel.component';

@Component({
    selector: 'frequency-grid',
    templateUrl: './frequency-grid.component.html',
    styleUrls: ['frequency-grid.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class FrequencyGridComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    public statusBar;

    @Input() initChart: string;
    @Input() initDatasource: string;
    @Input() initFilter: string;
    @Input() initVariable: string;

    datasource: string;
    variableName: string;
    datasources: any = [];
    variables: any = [];
    filters: any = [];

    initChartType: string;
    chart: any;
    parameterForm: FormGroup;
    datasourceSelect: string;

    request: FrequencyAnalysisRequest;
    rowData: any;

    public rowSelection: any;
    public frameworkComponents: any;

    columnDefs = [
        { headerName: 'Variable', field: 'variableCodes', sortable: true, filter: true, ColId: 'variableCol' },
        { headerName: 'Frequency', field: 'frequency1', sortable: true, filter: true },
        { headerName: 'Cum Frequency', field: 'cumulativeFrequency1', sortable: true, filter: true },
        { headerName: 'Percent', field: 'percent1', sortable: true, filter: true },
        { headerName: 'Cum Percent', field: 'cumulativePercent1', sortable: true, filter: true },
    ];

    constructor(private fb: FormBuilder, private http: HttpClient, public restApi: RestApiService) {

    }

    ngOnInit() {

        this.loadDataSources();
        this.datasource = this.initDatasource;
        this.request = new FrequencyAnalysisRequest();
        this.request.dataSourceName = this.datasource;

        this.getFilters();
        this.request.filterName = this.initFilter;

        this.getVariables();
        this.variableName = this.initVariable;
        this.request.variableName = this.initVariable;

        this.parameterForm = this.fb.group({
            variableControl: [this.initVariable],
            filterControl: [this.initFilter]
        });
        console.log('variable : ' + this.variableName + ', filter : ' + this.initFilter);
        this.request.suppressNulls = false;
        this.getFrequencyAnalysis();

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

    onFirstDataRendered(params) {
        console.log('data onFirstDataRendered()...');
        this.gridApi.sizeColumnsToFit();
        if (this.initChartType) {
            console.log("chart type = "+this.initChartType);
            if (this.initChartType === 'pie') {
                this.pieChart();
            } else {
                this.stackedBarChart();
            }
        }
    }

    onRowDataChanged(params) {
        console.log('data onRowDataChanged()...');
        this.gridApi.sizeColumnsToFit();
        if (this.initChartType && this.chart) {
            this.chart.destroyChart();
            console.log("chart type = "+this.initChartType);
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
        this.getFrequencyAnalysis();
    }

    onVariableChange(value: string) {
        this.request.variableName = value;
        this.getFrequencyAnalysis();
        const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        variableColDef.headerName = value;
        this.gridApi.refreshHeader();
    }

    onFilterChange(value: string) {
        this.request.filterName = value;
        this.getFrequencyAnalysis();
    }

    onNullableChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.suppressNulls = value.currentTarget.checked;
        this.getFrequencyAnalysis();
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

    getFrequencyAnalysis() {
        console.log('request = ' + JSON.stringify(this.request));
        this.rowData = this.restApi.getFrequencyAnalysis(this.request);
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