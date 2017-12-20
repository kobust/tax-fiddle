import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { TaxCalcComponent } from "../tax-calc";
import { TaxConfig } from "../tax-config";
import { HttpClient } from "@angular/common/http";
import { IfObservable } from "rxjs/observable/IfObservable";
import { Observable } from "rxjs/Observable";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { IYearData } from "../interfaces/IYearData";
import { HouseholdImpactChartComponent } from "./householdImpactChart";
import { isDefined } from "@angular/compiler/src/util";
import { YearData } from "../tax-yearData";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [TaxCalcComponent, HttpClient]
})
export class AppComponent implements OnInit {
  _yearlyData: IYearData[];
  _dataSource: MatTableDataSource<IYearData>;
  _configs = new Array<TaxConfig>();
  _customConfig = new TaxConfig();
  _title = "Attleboro Property Tax Estimation";
  _householdImpactChart: HouseholdImpactChartComponent;

  constructor(private _calc: TaxCalcComponent, private _http: HttpClient) {
    this._householdImpactChart = new HouseholdImpactChartComponent(this._calc);
    this.targetHomeValue = this._config.homeAssessedValue;
    this._dataSource = new MatTableDataSource(
      this._calc.generateTable(true, this.currentConfig)
    );
  }

  // ------------------------
  //   Properties
  // ------------------------
  _config = new TaxConfig();
  get currentConfig(): TaxConfig {
    return this._config;
  }
  set currentConfig(value: TaxConfig) {
    value.homeAssessedValue = this._config.homeAssessedValue;
    this._config.deserialize(value);
    this._config.parent = this;

    this.calculate();
  }

  get targetHomeValue(): number {
    return this._config.homeAssessedValue;
  }
  set targetHomeValue(value: number) {
    this._config.homeAssessedValue = value;
    this.calculate();
  }

  get totalBondPrincipal(): number {
    let sum = 0;
    for (const bond of this._config.bonds) {
      if (bond.enabled) {
        sum += bond.principal;
      }
    }
    return sum;
  }

  get totalBondPayments(): number {
    let sum = 0;
    for (const bond of this._config.bonds) {
      if (bond.enabled) {
        sum += bond.getTotalCost();
      }
    }
    return sum;
  }

  get bondPaymentAverage(): number {
    let sum = 0;
    for (const year of this._yearlyData) {
      if (year.bondRequirement > 0) {
        sum += year.homeBondPayment;
      }
    }
    return this.bondYearsBase > 0 ? sum / this.bondYearsBase : 0;
  }

  get bondPaymentPeak(): IYearData {
    let max = 0;
    let tempYear: IYearData;
    for (const year of this._yearlyData) {
      if (year.homeBondPayment > max) {
        max = year.homeBondPayment;
        tempYear = year;
      }
    }
    return tempYear;
  }

  get bondYears(): number {
    let years = 0;
    for (const year of this._yearlyData) {
      if (year.homeBondPayment > 0) {
        years += 1;
      }
    }
    return years;
  }

  get bondYearsBase(): number {
    let mostSmall = 9999;
    let mostBig = 2018;
    let found = false;
    for (const bond of this._config.bonds) {
      if (bond.enabled && bond.startYear + bond.term >= mostBig) {
        mostBig = bond.startYear + bond.term;
      }
      if (bond.enabled && bond.startYear <= mostSmall) {
        mostSmall = bond.startYear;
        found = true;
      }
    }
    if (!found) {
      return 0;
    }
    return mostBig - mostSmall;
  }

  get bondPaymentTotal(): number {
    let sum = 0;
    for (const year of this._yearlyData) {
      sum += year.homeBondPayment;
    }
    return sum;
  }

  // ------------------------
  //   Const definitions
  // ------------------------
  bondTypes = [
    { value: 1, viewValue: "Level Debt" },
    { value: 2, viewValue: "Level Principal" }
  ];

  displayedHouseholdColumns = [
    "year",
    "homeTarget",
    "homeTargetTaxBillWithoutBond",
    "homeTargetTaxBillDiff",
    "homeTargetTaxBill",
    "homeYearOverYearIncreasePercent",
    "bondRequirement"
  ];

  displayedMuniColumns = [
    "year",
    "cipTotalAssessed",
    "cipNewAssessedGrowth",
    // 'cipPercent',
    "cipShiftedPercent",
    "cipTaxRateWithBond",
    "roTotalAssessed",
    "roNewAssessedGrowth",
    // 'roPercent',
    "roShiftedPercent",
    "roTaxRateWithBond",
    // 'totalAssessed',
    "levyLimit",
    "levyLimitGrowthPercent",
    "debtExclusionGrowthDifference",
    "shift",
    // 'mrf',
    "rawBondRequirement",
    "bondRequirement"
  ];

  // ------------------------
  //   Helpers
  // ------------------------
  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs() {
    this._http.get("./assets/tax-configs.json").subscribe(data => {
      const newConfigs = Array<TaxConfig>();
      for (const config of data["configs"]) {
        newConfigs.push(new TaxConfig().deserialize(config.config));
      }
      this._configs = newConfigs;
      this.currentConfig = newConfigs[0];
      this.currentConfig.debtServiceCommitment = 0.0;
    });
  }

  calculate(): void {
    this._yearlyData = this._calc.generateTable(true, this.currentConfig);
    this._dataSource = new MatTableDataSource(this._yearlyData);
    this._householdImpactChart.update(this._yearlyData, this.currentConfig);
  }
}
