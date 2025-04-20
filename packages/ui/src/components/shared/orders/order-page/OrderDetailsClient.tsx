"use client";

import React, { useState, useEffect } from "react";
import type { Order } from "@shared/constants/orders";
import { API } from "@shared/constants/constants";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import {ActionsMenu} from "@shared/constants/actionMenu";

interface Props {
  id: string;
}

export default function OrderDetailsClient({ id }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [newMasterId, setNewMasterId] = useState("");

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [warrantyMasterId, setWarrantyMasterId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Неавторизованный");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API}/api/orders/${id}/`, {
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
      }).then(async (res) => {
        if (!res.ok) throw new Error("Не удалось загрузить заказ");
        return (await res.json()) as Order;
      }),
      fetch(`${API}/api/user/`, {
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
      }).then(async (res) => {
        if (!res.ok) throw new Error("Не удалось загрузить данные пользователя");
        return (await res.json()) as { id: number; role: string };
      }),
    ])
      .then(([orderData, userData]) => {
        setOrder(orderData);
        setUserRole(userData.role);
        setCurrentUserId(userData.id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAssignSubmit = async () => {
    if (!order) return;
    const token = localStorage.getItem("token");
    // Парсим ID мастера из поля ввода
    const masterIdNum = parseInt(newMasterId, 10);
    if (isNaN(masterIdNum)) {
      console.warn("Некорректный ID мастера");
      return;
    }

    try {
      // ВНИМАНИЕ: новый URL с двумя параметрами в пути
      const res = await fetch(
        `${API}/assign/${order.id}/${masterIdNum}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Не удалось назначить мастера");
      const updated = (await res.json()) as Order;
      setOrder(updated);
      setIsAssignOpen(false);
      setNewMasterId("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMaster = async () => {
    if (!order || !order.assigned_master) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/assign/${order.id}/remove/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
      });
      setOrder({ ...order, assigned_master: null } as Order);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTransferSubmit = async () => {
    if (!order) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/orders/${order.id}/transfer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ warranty_master_id: parseInt(warrantyMasterId, 10) }),
      });
      setOrder({ ...order, status: 'назначен' } as Order);
      setIsTransferOpen(false);
      setWarrantyMasterId("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteOrder = async () => {
    if (!order) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/assign/${order.id}/remove/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ status: 'завершен' }),
      });
      setOrder({ ...order, status: 'завершен' } as Order);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-4 text-center">Загрузка заказа…</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;
  if (!order) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Номер заказа', value: order.id },
    { label: 'Дата создания', value: new Date(order.created_at).toLocaleString() },
    { label: 'Клиент', value: order.client_name },
    { label: 'Телефон', value: order.client_phone },
    { label: 'Адрес', value: order.address },
    { label: 'Описание', value: order.description },
    { label: 'Итоговая стоимость', value: `${order.final_cost} ₸` },
    { label: 'Мастер', value: order.assigned_master ?? 'Не назначен' },
    { label: 'Статус', value: order.status },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-medium">Детали заказа #{order.id}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Поле</TableHead>
            <TableHead>Значение</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ label, value }) => (
            <TableRow key={label}>
              <TableCell>{label}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(userRole === 'admin' || userRole === 'curator') && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button>Назначить мастера</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Назначить мастера</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Введите ID мастера"
                value={newMasterId}
                onChange={(e) => setNewMasterId(e.target.value)}
                className="mb-4"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button onClick={handleAssignSubmit}>Подтвердить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleRemoveMaster}
            disabled={!order.assigned_master}
          >
            Убрать мастера
          </Button>

          <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Передать гарантийному мастеру</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Передать гарантийному мастеру</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Введите ID гарантийного мастера"
                value={warrantyMasterId}
                onChange={(e) => setWarrantyMasterId(e.target.value)}
                className="mb-4"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleTransferSubmit}>
                  Передать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={handleCompleteOrder}>
            Завершить заказ
          </Button>
        </div>
      )}
      

      <div className="mt-4 flex justify-end">
        <ActionsMenu order={order} />
      </div>
    </div>
  );
}
