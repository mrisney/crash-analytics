import { Component } from '@angular/core';
import { IStatusPanelParams } from 'ag-grid-community';
import { CrossTabGridComponent } from './crosstab-grid.component';

@Component({
    selector: 'crosstab-status-bar',
    templateUrl: '../crosstab-grid/crosstab-status-bar.component.html'
})
export class CrossTabStatusBarComponent {

    private params: IStatusPanelParams;
    
    public visible = true;

    constructor(public gridComponent: CrossTabGridComponent) { }

    agInit(params: IStatusPanelParams): void {
        this.params = params;
    }

    renderPieChart(): void {
        this.gridComponent.pieChart();
    }

    renderBarChart(): void {
        this.gridComponent.stackedBarChart();
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    isVisible(): boolean {
        return this.visible;
    }
}
