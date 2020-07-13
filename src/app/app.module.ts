import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { ImpactGridComponent } from './impact-grid/impact-grid.component';
import { FrequencyGridComponent } from './frequency-grid/frequency-grid.component';
import { StatusBarPanelComponent } from './status-bar-panel/status-bar-panel.component';

import 'ag-grid-enterprise';

import { LicenseManager } from 'ag-grid-enterprise';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('yestae');

@NgModule({
    declarations: [
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
    providers: [ImpactGridComponent, FrequencyGridComponent],
    entryComponents: [ImpactGridComponent, FrequencyGridComponent, StatusBarPanelComponent]
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
    }

    ngDoBootstrap() {
    }
}