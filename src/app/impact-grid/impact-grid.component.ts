import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { ImpactAnalysisRequest } from '../shared/impact-analysis-request';
import { ImpactStatusBarComponent } from './impact-status-bar.component';

@Component({
    selector: 'impact-grid',
    templateUrl: './impact-grid.component.html',
    styleUrls: ['../shared/analysis.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ImpactGridComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    public  statusBar;

    @Input() initChart: string;
    @Input() initDatasource: string;
    @Input() initFilter1: string;
    @Input() initFilter2: string;
    @Input() initVariable: string;

    datasource: string;
    variableName: string;
    datasources: any = [];
    variables: any = [];
    filter1: any = [];
    filter2: any = [];

    initChartType: string;
    chart: any;
    parameterForm: FormGroup;
    datasourceSelect: string;

    request: ImpactAnalysisRequest;
    rowData: any;

    public rowSelection: any;
    public frameworkComponents: any;

    columnDefs = [
        { headerName: 'Variable', field: 'variableCodes', sortable: true, filter: true, ColId: 'variableCol' },
        { headerName: 'Subset Freq', field: 'frequency1', sortable: true, filter: true },
        { headerName: 'Subset Pct', field: 'percent1', sortable: true, filter: true },
        { headerName: 'Other Freq', field: 'frequency2', sortable: true, filter: true },
        { headerName: 'Other Pct', field: 'percent2', sortable: true, filter: true },
        { headerName: 'Over Rep', field: 'overRepresented', sortable: true, filter: true },
        { headerName: 'Max Gain', field: 'maxGain', sortable: true, filter: true },
        { headerName: 'Significant', field: 'isSignificant', sortable: true, filter: true }
    ];
    constructor(private fb: FormBuilder, private http: HttpClient, public restApi: RestApiService) {

    }


    ngOnInit() {

        this.loadDataSources();
        this.datasource = this.initDatasource;
        this.request = new ImpactAnalysisRequest();
        this.request.dataSourceName = this.datasource;
        this.getFilter1();
        this.request.filter1Name = this.initFilter1;

        this.getFilter2();
        this.request.filter1Name = this.initFilter2;

        this.getVariables();
        this.variableName = this.initVariable;
        this.request.variableName = this.initVariable;

        this.parameterForm = this.fb.group({
            variableControl: [this.initVariable],
            filter1Control: [this.initFilter1],
            filter2Control: [this.initFilter2]
        });
        console.log('variable : ' + this.variableName + ', filter1 : ' + this.initFilter1 + ', filter2 : ' + this.initFilter2);
        this.request.suppressNulls = false;
        this.getImpactAnalysis();

        this.initChartType = this.initChart;
        this.rowSelection = 'multiple';

        this.frameworkComponents = {
            statusBarPanelComponent: ImpactStatusBarComponent
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


    autoSizeAll(skipHeader) {
        var allColumnIds = [];
        this.gridColumnApi.getAllColumns().forEach(function(column) {
          allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
      }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit()

        window.onresize = () => {
            this.autoSizeAll(false);
        }
    }

    onFirstDataRendered(params) {
        console.log('data onFirstDataRendered()...');
    }

    onRowDataChanged(params) {
        console.log('data onRowDataChanged()...');
        this.autoSizeAll(false);
    }

    loadDataSources() {
        return this.restApi.getDataSources().subscribe((data: {}) => {
            this.datasources = data;
        });
    }

    onDataSourceChange(value: string) {
        this.datasource = value;
        this.getVariables();
        this.getFilter1();
        this.getFilter2();
        this.request.dataSourceName = value;
        this.getImpactAnalysis();
    }

    onVariableChange(value: string) {
        this.request.variableName = value;
        this.getImpactAnalysis();
        const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        variableColDef.headerName = value;
        this.gridApi.refreshHeader();
    }

    onFilter1Change(value: string) {
        this.request.filter1Name = value;
        this.getImpactAnalysis();
    }

    onFilter2Change(value: string) {
        console.log("Filter 2 name :" + value);
        this.request.filter2Name = value;
        this.getImpactAnalysis();
    }

    onNullableChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.suppressNulls = value.currentTarget.checked;
        this.getImpactAnalysis();
    }

    onNoZeroChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.noZeros = value.currentTarget.checked;
        this.getImpactAnalysis();
    }
    getVariables() {
        return this.restApi.getVariables(this.datasource).subscribe((data: {}) => {
            this.variables = data;
        });
    }

    getFilter1() {
        return this.restApi.getFilters(this.datasource).subscribe((data: {}) => {
            this.filter1 = data;
        });
    }

    getFilter2() {
        return this.restApi.getFilters(this.datasource).subscribe((data: {}) => {
            this.filter2 = data;
        });
    }

    getImpactAnalysis() {
        console.log('request = ' + JSON.stringify(this.request));
        this.rowData = this.restApi.getImpactAnalysis(this.request);
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