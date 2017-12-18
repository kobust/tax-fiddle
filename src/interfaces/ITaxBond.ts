export enum BondType {
    levelDebt = 1,
    levelPrincipal,
}

export interface ITaxBond {
    name: string;
    bondType: BondType;
    startYear: number;
    principal: number;
    interestRate: number;
    term: number;
    enabled: boolean;
}
