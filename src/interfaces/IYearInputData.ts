
export interface IYearInputData {
    year: number;
    cipTotalAssessed: number;
    cipNewAssessedGrowth: number;

    roTotalAssessed: number;
    roNewAssessedGrowth: number;

    priorYearLevyLimit: number;
    priorYearRoTaxRate: number;
    priorYearRoTaxRateWithBond: number;
    priorYearCipTaxRate: number;
    priorYearCipTaxRateWithBond: number;

    shift: number;

    homeTarget: number;
    homeAverage: number;

    bondRequirement: number;
    sumDebtExclusionGrowthDifference: number;
  }
