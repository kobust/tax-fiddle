import { ITaxBond, BondType } from '../interfaces/ITaxBond';
import { ISerializable } from '../interfaces/ISerializable';


export class TaxBond implements ITaxBond, ISerializable<TaxBond> {

  _name: string;
  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
  }

  _bondType: BondType;
  get bondType(): BondType { return this._bondType; }
  set bondType(value: BondType) {
    this._bondType = value;
    this._propChange(() => {this._bondType = value; });
  }

  _startYear: number;
  get startYear(): number { return this._startYear; }
  set startYear(value: number) {
    this._propChange(() => {this._startYear = value; });
  }

  _principal: number;
  get principal(): number { return this._principal; }
  set principal(value: number) {
    this._propChange(() => {this._principal = value; });
  }

  _interestRate: number;
  get interestRate(): number { return this._interestRate; }
  set interestRate(value: number) {
    this._propChange(() => {this._interestRate = value; });
  }

  _term: number;
  get term(): number { return this._term; }
  set term(value: number) {
    this._propChange(() => {this._term = value; });
  }

  _enabled: boolean;
  get enabled(): boolean { return this._enabled; }
  set enabled(value: boolean) {
    this._propChange(() => {this._enabled = value; });
  }

  parent: any;
  _propChange(setFn: Function) {
    if (this.parent !== undefined)       {
        this.parent.propChange(setFn);
    }
  }

  deserialize(input) {
    this._name = input._name;
    this._bondType = input._bondType;
    this._startYear = input._startYear;
    this._principal = input._principal;
    this._interestRate = input._interestRate;
    this._term = input._term;
    this._enabled = input._enabled;
    return this;
  }

  getTotalCost(): number {
    if (this.bondType === BondType.levelDebt) {
      return this.term * this._getLevelDebtAnnualCost();
    } else if (this.bondType === BondType.levelPrincipal) {
      let sum = 0;
      for (let i = this.startYear; i < this.startYear + this.term; i++) {
        sum += this._getLevelPrincipalAnnualCost(i);
      }
      return sum;
    } else {
      throw new TypeError('Unexpected bond type');
    }
  }

  getCost(year: number): number {
    if (!this.enabled) { return 0; }
    if ((year < this.startYear) || (year >= this.startYear + this.term)) {
      return 0;
    }
    if (this.bondType === BondType.levelDebt) {
      return this._getLevelDebtAnnualCost();
    } else if (this.bondType === BondType.levelPrincipal) {
      return this._getLevelPrincipalAnnualCost(year);
    } else {
      throw new TypeError('Unexpected bond type');
    }
  }

  _getLevelPrincipalAnnualCost(year: number): number {
    const principalPayment = this.principal / this.term;
    const remainingPrincipal = this.principal - (year - this.startYear) * principalPayment;
    const interest = remainingPrincipal * this.interestRate;
    return principalPayment + interest;
  }

  _getLevelDebtAnnualCost(): number {
    // see https://www.wikihow.com/Calculate-Mortgage-Payments
    const paymentsPerYear = 2;
    const r = this.interestRate / paymentsPerYear;
    const p = this.principal;
    const n = this.term * paymentsPerYear; // twice per year
    const m = p * (r * (1 + r) ** n) / ((1 + r) ** n - 1);
    return m * paymentsPerYear;
  }
}
