import { Injectable, Component } from "@angular/core";
import { TaxConfig } from "./tax-config";
import { TaxBond } from "./tax-bond";
import { IYearData } from "../interfaces/IYearData";
import { IYearInputData } from "../interfaces/IYearInputData";
import { YearData } from "./tax-yearData";
import { HttpClient } from "@angular/common/http";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Injectable()
@Component({
  providers: [HttpClient],
  template: 'NotUsed-TaxCalcComponent'
})
export class TaxCalcComponent {
  _yearlyInput = new Map<number, IYearInputData>();

  constructor(private _http: HttpClient) {
    this._loadYears();
  }

  _getBondStopYear(bonds: Array<TaxBond>): number {
    let mostBig = 2018;
    for (const bond of bonds) {
      if (bond.enabled && bond.startYear + bond.term >= mostBig) {
        mostBig = bond.startYear + bond.term;
      }
    }
    return mostBig;
  }

  _getBondYearCost(year: number, bonds: Array<TaxBond>): number {
    let sum = 0;
    for (const bond of bonds) {
      sum += bond.getCost(year);
    }
    return sum;
  }

  generateTable(includeBond: boolean, config: TaxConfig): IYearData[] {
    const result = new Array<IYearData>();
    const startYear = 2018;
    let stopYear = startYear;
    if (config.bonds) {
      stopYear = this._getBondStopYear(config.bonds) + 1;
    }

    let currentYearInput = this._yearlyInput.get(startYear);
    let lastYearInput = this._yearlyInput.get(startYear - 1);
    if (currentYearInput === undefined) {
      return result;
    }
    currentYearInput.homeTarget = config.homeAssessedValue;
    currentYearInput.bondRequirement = 0;

    let currentYear: number;
    for (currentYear = startYear; currentYear <= stopYear; currentYear++) {
      if (includeBond) {
        currentYearInput.bondRequirement = this._getBondYearCost(
          currentYear,
          config.bonds
        );
      }
      const currentYearData = new YearData(
        currentYearInput,
        lastYearInput,
        config
      );
      result.push(currentYearData);
      lastYearInput = currentYearInput;
      currentYearInput = currentYearData.generateNextYearInput(config);
    }

    let maxYear: IYearData;
    for (const year of result) {
      if (!maxYear) {
        maxYear = year;
      } else if (year.homeBondPayment > maxYear.homeBondPayment) {
        maxYear = year;
      }
    }
    maxYear.isPeakYear = true;
    return result;
  }

  _loadYears() {
    this._http.get("./assets/tax-data.json").subscribe(data => {
      for (const y of data["years"]) {
        this._yearlyInput.set(y.year, y);
      }
    });
  }
}
