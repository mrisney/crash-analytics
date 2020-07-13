import { Component } from '@angular/core';
import { IStatusPanelParams } from 'ag-grid-community';
import { FrequencyGridComponent } from '../frequency-grid/frequency-grid.component';

@Component({
    selector: 'status-bar',
    templateUrl: '../status-bar-panel/status-bar-panel.component.html'
})
export class StatusBarPanelComponent {

    private params: IStatusPanelParams;
    
    public visible = true;

    constructor(public gridComponent: FrequencyGridComponent) { }

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
