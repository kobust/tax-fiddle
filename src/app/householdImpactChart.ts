import { YearData } from '../tax-yearData';
import { TaxConfigService } from '../tax-config.service';
import { Component } from '@angular/core';
import { TaxCalcService } from '../tax-calc.service';
import { IYearData } from '../interfaces/IYearData';

@Component({
    providers: [TaxCalcService]
})
export class HouseholdImpactChartComponent {
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartData: Array<any> = [];
    public lineChartLabels: Array<any> = [];

    constructor(private _calc: TaxCalcService) {
    }

    public lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: true,
        legend: { position: 'bottom' },
        title: {
            display: true,
            text: 'Bond Impact on Annual Household Tax Bill'
        }
    };

    public lineChartColors: Array<any> = [
        { // pink - bottom
            backgroundColor: '#ea80fc',
            borderColor: '#c51162',
            pointBackgroundColor: '#f8bbd0',
            pointBorderColor: '#c51162',
            pointHoverBackgroundColor: '#c51162',
            pointHoverBorderColor: '#f8bbd0'
        },
        { // deep purple - middle
            backgroundColor: '#b388ff',
            borderColor: '#6200ea',
            pointBackgroundColor: '#d1c4e9',
            pointBorderColor: '#6200ea',
            pointHoverBackgroundColor: '#6200ea',
            pointHoverBorderColor: '#b388ff'
        },
        { // Indigo blue - top
            backgroundColor: '#8c9eff',
            borderColor: '#304ffe',
            pointBackgroundColor: '#c5cae9',
            pointBorderColor: '#304ffe',
            pointHoverBackgroundColor: '#8c9eff',
            pointHoverBorderColor: '#304ffe'
        },
    ];

    getAnnualPaymentsNoBond(config: TaxConfigService): Array<number> {
        const _bondPayments = new Array<number>();
        const tempYears = this._calc.generateTable(false, config);
        for (const y of tempYears) {
            _bondPayments.push(y.homeTargetTaxBillWithoutBond);
        }
        return _bondPayments;
    }

    // lineChart
    update(yearData: IYearData[], config: TaxConfigService): void {
        this.lineChartLabels.length = 0;
        const _bondPayments = new Array<number>();
        const _totalPayments = new Array<number>();

        for (const y of yearData) {
            this.lineChartLabels.push(y.year);
            _bondPayments.push(y.homeBondPayment);
            _totalPayments.push(y.homeTargetTaxBill);
        }

        this.lineChartData = [
            { data: _bondPayments, label: 'Bond Payments' },
            { data: this.getAnnualPaymentsNoBond(config), label: 'Tax Bill (w/o bond)' },
            { data: _totalPayments, label: 'Total Tax Bill' }
        ];
    }
}
