import { OrderLog, TransactionLog } from '../types/logs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class LogsService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async getOrderLogs(): Promise<OrderLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/orders/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order logs:', error);
      throw error;
    }
  }

  static async getTransactionLogs(): Promise<TransactionLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/transactions/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction logs:', error);
      throw error;
    }
  }

  static async getOrderLogsByOrderId(orderId: number): Promise<OrderLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/orders/${orderId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order logs by order ID:', error);
      throw error;
    }
  }

  static async getTransactionLogsByUserId(userId: number): Promise<TransactionLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/transactions/user/${userId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction logs by user ID:', error);
      throw error;
    }
  }

  static async getOrderLogById(logId: number): Promise<OrderLog> {
    const response = await fetch(`${API_BASE_URL}/logs/orders/log/${logId}/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order log: ${response.statusText}`);
    }

    return response.json();
  }

  static async getTransactionLogById(logId: number): Promise<TransactionLog> {
    const response = await fetch(`${API_BASE_URL}/logs/transactions/log/${logId}/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction log: ${response.statusText}`);
    }

    return response.json();
  }

  // Helper function to format action names for display
  static formatActionName(action: string): string {
    const actionMap: Record<string, string> = {
      'created': 'Создан',
      'status_changed': 'Изменен статус',
      'master_assigned': 'Назначен мастер',
      'master_removed': 'Снят мастер',
      'transferred': 'Передан',
      'completed': 'Завершен',
      'deleted': 'Удален',
      'updated': 'Обновлен',
      'cost_updated': 'Обновлена стоимость',
      'approved': 'Одобрен',
    };
    return actionMap[action] || action;
  }

  // Helper function to format transaction types for display
  static formatTransactionType(type: string): string {
    const typeMap: Record<string, string> = {
      'balance_top_up': 'Пополнение баланса',
      'balance_deduct': 'Списание с баланса',
      'profit_distribution': 'Распределение прибыли',
      'master_payment': 'Оплата мастеру',
      'curator_salary': 'Зарплата куратора',
      'company_income': 'Доход компании',
    };
    return typeMap[type] || type;
  }
}
