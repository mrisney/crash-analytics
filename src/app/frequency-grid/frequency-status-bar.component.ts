import { Component } from '@angular/core';
import { IStatusPanelParams } from 'ag-grid-community';
import { FrequencyGridComponent } from './frequency-grid.component';

@Component({
    selector: 'frequency-status-bar',
    templateUrl: '../frequency-grid/frequency-status-bar.component.html'
})
export class FrequencyStatusBarComponent {

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
