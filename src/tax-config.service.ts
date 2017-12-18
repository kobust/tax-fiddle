import { Component } from '@angular/core';
import { TaxBond } from './tax-bond.service';
import { EventEmitter } from 'events';

interface Serializable<T> {
  deserialize(input: Object): T;
}

export class TaxConfigService implements Serializable<TaxConfigService> {

  constructor() {
    this._homeAssessedValue = 270700;
    this._bonds = new Array<TaxBond>();
  }

  _enableBondPaymentRecycling: boolean;
  get enableBondPaymentRecycling(): boolean { return this._enableBondPaymentRecycling; }
  set enableBondPaymentRecycling(value: boolean) {
    this.propChange(() => {this._enableBondPaymentRecycling = value; });
  }

  _homeGrowthRate: number;
  get homeGrowthRate(): number { return this._homeGrowthRate; }
  set homeGrowthRate(value: number) {
    this.propChange(() => {this._homeGrowthRate = value; });
  }

  _bonds: Array<TaxBond>;
  get bonds(): Array<TaxBond> { return this._bonds; }
  set bonds(value: Array<TaxBond>) {
    this.propChange(() => {this._bonds = value; });
  }

  _shift: number;
  get shift(): number { return this._shift; }
  set shift(value: number) {
    this.propChange(() => {this._shift = value; });
  }

  _name: string;
  get name(): string { return this._name; }
  set name(value: string) {
    this.propChange(() => {this._name = value; });
  }

  _homeAssessedValue: number;
  get homeAssessedValue(): number { return this._homeAssessedValue; }
  set homeAssessedValue(value: number) {
    this._homeAssessedValue = value;
 }

  _cipNewGrowthRate: number;
  get cipNewGrowthRate(): number { return this._cipNewGrowthRate; }
  set cipNewGrowthRate(value: number) {
    this.propChange(() => {this._cipNewGrowthRate = value; });
  }

  _roNewGrowthRate: number;
  get roNewGrowthRate(): number { return this._roNewGrowthRate; }
  set roNewGrowthRate(value: number) {
    this.propChange(() => {this._roNewGrowthRate = value; });
  }

  _cipGrowthRate: number;
  get cipGrowthRate(): number { return this._cipGrowthRate; }
  set cipGrowthRate(value: number) {
    this.propChange(() => {this._cipGrowthRate = value; });
  }

  _roGrowthRate: number;
  get roGrowthRate(): number { return this._roGrowthRate; }
  set roGrowthRate(value: number) {
    this.propChange(() => {this._roGrowthRate = value; });
  }

  parent: any;
  propChange(setFn: Function) {
    setFn();
    if (this.parent !== undefined) {
        this.parent.calculate();
    }
  }

  deserialize(input) {
    this._name = input._name;
    this._cipNewGrowthRate = input._cipNewGrowthRate;
    this._cipGrowthRate = input._cipGrowthRate;

    this._roGrowthRate = input._roGrowthRate;
    this._roNewGrowthRate = input._roNewGrowthRate;
    this._homeGrowthRate = input._homeGrowthRate;

    this._shift = input._shift;
    this._enableBondPaymentRecycling = input._enableBondPaymentRecycling;

    this._bonds.length = 0;
    for (let i = 0; i < input._bonds.length; i++) {
      const b = new TaxBond().deserialize(input._bonds[i]);
      b.parent = this;
      this._bonds.push(b);
    }
    return this;
  }
}
