import { Injectable } from '@angular/core';
import { TaxBond } from './tax-bond.service';
import { IYearInputData } from './interfaces/IYearInputData';

@Injectable()
export class TaxDataService {
  initYearlyInput(): Map<number, IYearInputData> {
    const yearlyInput = new Map<number, IYearInputData>();
    yearlyInput.set(2016, {
      year: 2016,
      cipTotalAssessed: 747177282,
      cipNewAssessedGrowth: 10185130,
      roTotalAssessed: 3282673491,
      roNewAssessedGrowth: 19304300,

      priorYearCipTaxRate: 21.31,
      priorYearCipTaxRateWithBond: 21.31,
      priorYearRoTaxRate: 14.71,
      priorYearRoTaxRateWithBond: 14.71,
      priorYearLevyLimit: 62607068,

      shift: 1.335,
      homeTarget: 0,
      homeAverage: 260458,
      bondRequirement: 0,
      sumDebtExclusionGrowthDifference: 0,
    });
    yearlyInput.set(2017, {
      year: 2017,
      cipTotalAssessed: 772240864,
      cipNewAssessedGrowth: 26950445,
      roTotalAssessed: 3559600747,
      roNewAssessedGrowth: 48260544,

      priorYearCipTaxRate: 21.42,
      priorYearCipTaxRateWithBond: 21.42,
      priorYearRoTaxRate: 14.82,
      priorYearRoTaxRateWithBond: 14.82,
      priorYearLevyLimit: 64673256,

      shift: 1.31,
      homeTarget: 0,
      homeAverage: 280206,
      bondRequirement: 0,
      sumDebtExclusionGrowthDifference: 0,
    });
    yearlyInput.set(2018, {
      year: 2018,
      cipTotalAssessed: 810668422,
      cipNewAssessedGrowth: 38647590,
      roTotalAssessed: 3668756861,
      roNewAssessedGrowth: 48270819,

      priorYearCipTaxRate: 20.43,
      priorYearCipTaxRateWithBond: 20.43,
      priorYearRoTaxRate: 14.55,
      priorYearRoTaxRateWithBond: 14.55,
      priorYearLevyLimit: 67582586,

      shift: 1.28,
      homeTarget: 0,
      homeAverage: 286851,
      bondRequirement: 0,
      sumDebtExclusionGrowthDifference: 0,
    });
    return yearlyInput;
  }
}