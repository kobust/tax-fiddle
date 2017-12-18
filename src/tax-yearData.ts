import { IYearData } from './interfaces/IYearData';
import { IYearInputData } from './interfaces/IYearInputData';
import { TaxConfigService } from './tax-config.service';

export class YearData implements IYearData {
    private _currentYear: IYearInputData;
    private _previousYear: IYearInputData;
    private _config: TaxConfigService;

    constructor(currentYear: IYearInputData, previousYear: IYearInputData, config: TaxConfigService) {
      this._currentYear = currentYear;
      this._previousYear = previousYear;
      this._config = config;
    }

    generateNextYearInput(config: TaxConfigService): IYearInputData {
      // let newInput = this._currentYear;
      const newInput = Object.assign({}, this._currentYear);
      newInput.cipNewAssessedGrowth = newInput.cipTotalAssessed * (config.cipNewGrowthRate);
      newInput.cipTotalAssessed = newInput.cipTotalAssessed * (1 + config.cipGrowthRate);

      newInput.roTotalAssessed = newInput.roTotalAssessed * (1 + config.roGrowthRate);
      newInput.roNewAssessedGrowth = newInput.roTotalAssessed * (config.roNewGrowthRate);
      newInput.homeTarget = newInput.homeTarget * (1 + config.homeGrowthRate);

      newInput.priorYearLevyLimit = this.levyLimit;
      newInput.priorYearCipTaxRate = this.cipTaxRate;
      newInput.priorYearRoTaxRate = this.roTaxRate;
      newInput.priorYearRoTaxRateWithBond = this.roTaxRateWithBond;
      newInput.priorYearCipTaxRateWithBond = this.cipTaxRateWithBond;
      newInput.year = newInput.year + 1;
      newInput.shift = config.shift;
      newInput.sumDebtExclusionGrowthDifference = this.sumDebtExclusionGrowthDifference;
      return newInput;
    }

    get cipTotalAssessed(): number {
      return this._currentYear.cipTotalAssessed;
    }
    get cipNewAssessedGrowth(): number {
      return this._currentYear.cipNewAssessedGrowth;
    }
    get mrf(): number {
      return this.roShiftedPercent / this.roPercent;
    }
    get totalAssessed(): number {
      return this.cipTotalAssessed + this.roTotalAssessed;
    }
    get cipTaxRate(): number {
      return 1000 * (this.cipShiftedPercent * this.levyLimit) / this.cipTotalAssessed;
    }
    get cipTaxRateWithBond(): number {
      return 1000 * (this.cipShiftedPercent * this.levyLimitWithBond) / this.cipTotalAssessed;
    }
    get roTotalAssessed(): number {
      return this._currentYear.roTotalAssessed;
    }
    get roNewAssessedGrowth(): number {
      return this._currentYear.roNewAssessedGrowth;
    }
    get roTaxRateWithBond(): number {
      return 1000 * (this.roShiftedPercent * this.levyLimitWithBond) / this.roTotalAssessed;
    }
    get roTaxRate(): number {
      return 1000 * (this.roShiftedPercent * this.levyLimit) / this.roTotalAssessed;
    }
    get levyLimit(): number {
      let newLimit = this._currentYear.priorYearLevyLimit * 1.025;
      newLimit += this.cipNewAssessedGrowth * (this._currentYear.priorYearCipTaxRateWithBond / 1000);
      newLimit += this.roNewAssessedGrowth * (this._currentYear.priorYearRoTaxRateWithBond / 1000);
      return newLimit;
    }
    get levyLimitGrowthPercent(): number {
      return (this.levyLimit - this._currentYear.priorYearLevyLimit) / this._currentYear.priorYearLevyLimit;
    }
    get levyLimitWithBond(): number {
      return this.levyLimit + this.bondRequirement;
    }
    get shift(): number {
      return this._currentYear.shift;
    }
    get cipPercent(): number {
      return this.cipTotalAssessed / this.totalAssessed;
    }
    get cipShiftedPercent(): number {
      return this.cipPercent * this.shift;
    }
    get roPercent(): number {
      return this.roTotalAssessed / this.totalAssessed;
    }
    get roShiftedPercent(): number {
      return 1 - this.cipShiftedPercent;
    }
    get homeTarget(): number {
      return this._currentYear.homeTarget;
    }
    get homeTargetTaxBill(): number {
      return this.homeTarget * this.roTaxRateWithBond / 1000;
    }
    get homeTargetTaxBillWithoutBond(): number {
      return this.homeTarget * this.roTaxRate / 1000;
    }
    get homeBondPayment(): number {
      return this.homeTargetTaxBill - this.homeTargetTaxBillWithoutBond;
    }
    get homeYearOverYearIncrease(): number {
      if (this._previousYear.homeTarget === 0) { return 0; }
      return this.homeTargetTaxBill - (this._previousYear.homeTarget * this._currentYear.priorYearRoTaxRateWithBond / 1000);
    }
    get homeYearOverYearIncreasePercent(): number {
      const increase = this.homeYearOverYearIncrease;
      return increase / (this._previousYear.homeTarget * this._currentYear.priorYearRoTaxRateWithBond / 1000);
    }
    get sumDebtExclusionGrowthDifference(): number {
      return this._currentYear.sumDebtExclusionGrowthDifference + this.debtExclusionGrowthDifference;
    }
    get debtExclusionGrowthDifference(): number {
      let newGrowth = 0;
      newGrowth += this.cipNewAssessedGrowth * (this._currentYear.priorYearCipTaxRate / 1000);
      newGrowth += this.roNewAssessedGrowth * (this._currentYear.priorYearRoTaxRate / 1000);

      let newGrowthWithBond = 0;
      newGrowthWithBond += this.cipNewAssessedGrowth * (this._currentYear.priorYearCipTaxRateWithBond / 1000);
      newGrowthWithBond += this.roNewAssessedGrowth * (this._currentYear.priorYearRoTaxRateWithBond / 1000);

      return newGrowthWithBond - newGrowth;
    }
    get bondRequirement(): number {
      if (!this._config.enableBondPaymentRecycling) {
        return this._currentYear.bondRequirement;
      }
      if (this.sumDebtExclusionGrowthDifference > this._currentYear.bondRequirement) {
        return 0;
      }
      return this._currentYear.bondRequirement - this.sumDebtExclusionGrowthDifference;
    }
    get rawBondRequirement(): number {
      return this._currentYear.bondRequirement;
    }
    get year(): number {
      return this._currentYear.year;
    }
  }
