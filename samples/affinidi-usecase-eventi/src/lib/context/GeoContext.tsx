import { Dispatch, SetStateAction, createContext } from "react";

export interface GeoInfo {
    name: string;
    currency: string;
    currencySymbol: string;
    currencyRate: number;
}

export const GeoDefaultValue = {
    name: "USA",
    currency: "USD",
    currencySymbol: "$",
    currencyRate: 1,
}

export const GeoContext =  createContext<[GeoInfo, Dispatch<SetStateAction<GeoInfo>>]>([GeoDefaultValue, () => {}]);
