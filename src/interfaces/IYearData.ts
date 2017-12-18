export interface IYearData {
    year: number;
    cipTotalAssessed: number;
    cipNewAssessedGrowth: number;
    cipPercent: number;
    cipShiftedPercent: number;
    cipTaxRate: number;
    cipTaxRateWithBond: number;

    roTotalAssessed: number;
    roNewAssessedGrowth: number;
    roPercent: number;
    roShiftedPercent: number;
    roTaxRate: number;
    roTaxRateWithBond: number;

    totalAssessed: number;
    levyLimit: number;
    levyLimitGrowthPercent: number;
    levyLimitWithBond: number;
    shift: number;
    mrf: number;

    homeTarget: number;
    homeTargetTaxBill: number;
    homeTargetTaxBillWithoutBond: number;
    homeYearOverYearIncrease: number;
    homeYearOverYearIncreasePercent: number;
    bondRequirement: number;
    homeBondPayment: number;

    sumDebtExclusionGrowthDifference: number;
    debtExclusionGrowthDifference: number;
  }
