import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { CrossTabAnalysisComponent } from './crosstab-analysis/crosstab-analysis.component';
import { ImpactGridComponent } from './impact-grid/impact-grid.component';
import { FrequencyGridComponent } from './frequency-grid/frequency-grid.component';
import { StatusBarPanelComponent } from './status-bar-panel/status-bar-panel.component';

import 'ag-grid-enterprise';

import { LicenseManager } from 'ag-grid-enterprise';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('yestae');

@NgModule({
    declarations: [
        CrossTabAnalysisComponent,
        FrequencyGridComponent,
        ImpactGridComponent,
        FrequencyGridComponent,
        StatusBarPanelComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxTypeaheadModule,
        AgChartsAngularModule,
        AgGridModule.withComponents([StatusBarPanelComponent])

    ],
    providers: [CrossTabAnalysisComponent, ImpactGridComponent, FrequencyGridComponent],
    entryComponents: [CrossTabAnalysisComponent, ImpactGridComponent, FrequencyGridComponent, StatusBarPanelComponent]
})
export class AppModule implements DoBootstrap {

    constructor(private injector: Injector) {
        
        const el = createCustomElement(FrequencyGridComponent, {
            injector: this.injector
        });
        customElements.define('frequency-grid', el);

        const el2 = createCustomElement(ImpactGridComponent,
            { injector: this.injector });
        customElements.define('impact-grid', el2);

        const el3 = createCustomElement(CrossTabAnalysisComponent,
            { injector: this.injector });
        customElements.define('crosstab-analysis', el3);
    }

    ngDoBootstrap() {
    }
}