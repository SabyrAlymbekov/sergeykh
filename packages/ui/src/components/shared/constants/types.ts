import {Order} from "@shared/constants/orders";

export type Master = {
    id: string;
    name: string;
    balance: number;
    orders: Order[];
};
