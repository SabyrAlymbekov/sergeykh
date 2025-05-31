// Types for logs data
export interface OrderLog {
  id: number;
  order: {
    id: number;
    description: string;
    status: string;
  };
  action: 'created' | 'status_changed' | 'master_assigned' | 'master_removed' | 'transferred' | 'completed' | 'deleted' | 'updated' | 'cost_updated' | 'approved';
  performed_by: {
    id: number;
    username?: string;
    email: string;
  };
  description: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface TransactionLog {
  id: number;
  user?: {
    id: number;
    username?: string;
    email: string;
  };
  transaction_type: 'balance_top_up' | 'balance_deduct' | 'profit_distribution' | 'master_payment' | 'curator_salary' | 'company_income';
  amount: string;
  description: string;
  order?: {
    id: number;
    description: string;
  };
  performed_by?: {
    id: number;
    username?: string;
    email: string;
  };
  created_at: string;
}

export interface LogsApiResponse<T> {
  data: T[];
  status: string;
}
