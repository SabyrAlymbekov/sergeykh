export type Status = "В работе" | "Ожидание" | "Завершено";

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  client: string;
  address: string;
  problem: string;
  cost: string;
  executionTime: string;
  master: string;
  status: Status;
  contact: string;
  actions: React.ReactNode;
};
