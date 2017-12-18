import { Injectable, Component } from '@angular/core';
import { TaxDataService } from './tax-data.service';
import { TaxConfigService } from './tax-config.service';
import { TaxBond } from './tax-bond.service';
import { IYearData } from './interfaces/IYearData';
import { IYearInputData } from './interfaces/IYearInputData';
import { YearData } from './tax-yearData';

@Injectable()
export class TaxCalcService {

  _yearlyInput: Map<number, IYearInputData>;

  constructor() {
    const dataService = new TaxDataService();
    this._yearlyInput = dataService.initYearlyInput();
  }

  _getBondStopYear(bonds: Array<TaxBond>): number {
    let mostBig = 2018;
    for (const bond of bonds) {
      if (bond.enabled && (bond.startYear + bond.term >= mostBig)) {
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

  generateTable(includeBond: boolean, config: TaxConfigService): IYearData[] {
    const result = new Array<IYearData>();
    const startYear = 2018;
    let stopYear = startYear;
    if (config.bonds) {
      stopYear = this._getBondStopYear(config.bonds) + 1;
    }

    let currentYearInput = this._yearlyInput.get(startYear);
    let lastYearInput = this._yearlyInput.get(startYear - 1);

    currentYearInput.homeTarget = config.homeAssessedValue;
    currentYearInput.bondRequirement = 0;

    let currentYear: number;
    for (currentYear = startYear; currentYear <= stopYear; currentYear++) {
      if (includeBond) {
        currentYearInput.bondRequirement = this._getBondYearCost(currentYear, config.bonds);
      }
      const currentYearData = new YearData(currentYearInput, lastYearInput, config);
      result.push(currentYearData);
      lastYearInput = currentYearInput;
      currentYearInput = currentYearData.generateNextYearInput(config);
    }
    return result;
  }
}
