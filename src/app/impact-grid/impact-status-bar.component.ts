import { Component } from '@angular/core';
import { IStatusPanelParams } from 'ag-grid-community';
import { ImpactGridComponent } from './impact-grid.component';

@Component({
    selector: 'impact-status-bar',
    templateUrl: '../impact-grid/impact-status-bar.component.html'
})
export class ImpactStatusBarComponent {

    private params: IStatusPanelParams;
    
    public visible = true;

    constructor(public gridComponent: ImpactGridComponent) { }

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
