import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { CrossTabGridComponent } from './crosstab-grid/crosstab-grid.component';
import { ImpactGridComponent } from './impact-grid/impact-grid.component';
import { FrequencyGridComponent } from './frequency-grid/frequency-grid.component';
import { FrequencyStatusBarComponent } from './frequency-grid/frequency-status-bar.component';
import { ImpactStatusBarComponent } from './impact-grid/impact-status-bar.component';
import { CrossTabStatusBarComponent } from './crosstab-grid/crosstab-status-bar.component';
import 'ag-grid-enterprise';

import { LicenseManager } from 'ag-grid-enterprise';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('yestae');

@NgModule({
    declarations: [
        CrossTabGridComponent,
        FrequencyGridComponent,
        ImpactGridComponent,
        FrequencyGridComponent,
        FrequencyStatusBarComponent,
        ImpactStatusBarComponent,
        CrossTabStatusBarComponent

    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxTypeaheadModule,
        AgChartsAngularModule,
        AgGridModule.withComponents([FrequencyStatusBarComponent,ImpactStatusBarComponent,CrossTabStatusBarComponent])

    ],
    providers: [CrossTabGridComponent, ImpactGridComponent, FrequencyGridComponent],
    entryComponents: [CrossTabGridComponent, ImpactGridComponent, FrequencyGridComponent, FrequencyStatusBarComponent,ImpactStatusBarComponent,CrossTabStatusBarComponent]
})
export class AppModule implements DoBootstrap {

    constructor(private injector: Injector) {
        
        const el = createCustomElement(FrequencyGridComponent, {
            injector: this.injector
        });
        customElements.define('frequency-analysis', el);

        const el2 = createCustomElement(ImpactGridComponent,
            { injector: this.injector });
        customElements.define('impact-analysis', el2);

        const el3 = createCustomElement(CrossTabGridComponent,
            { injector: this.injector });
        customElements.define('crosstab-analysis', el3);
    }

    ngDoBootstrap() {
    }
}