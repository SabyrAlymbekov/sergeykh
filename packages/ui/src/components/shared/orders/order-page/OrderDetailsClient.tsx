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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {ActionsMenu} from "@shared/constants/actionMenu";

interface Props {
  id: string;
}

interface Master {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export default function OrderDetailsClient({ id }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [newMasterId, setNewMasterId] = useState("");
  const [masters, setMasters] = useState<Master[]>([]);
  const [mastersLoading, setMastersLoading] = useState(false);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [warrantyMasterId, setWarrantyMasterId] = useState("");
  const [warrantyMasters, setWarrantyMasters] = useState<Master[]>([]);
  const [warrantyMastersLoading, setWarrantyMastersLoading] = useState(false);

  const fetchMasters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setMastersLoading(true);
    try {
      const res = await fetch(`${API}/users/masters/`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Token ${token}` 
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMasters(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке мастеров:", error);
    } finally {
      setMastersLoading(false);
    }
  };

  const fetchWarrantyMasters = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setWarrantyMastersLoading(true);
    try {
      const res = await fetch(`${API}/users/warranty-masters/`, {
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Token ${token}` 
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWarrantyMasters(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке гарантийных мастеров:", error);
    } finally {
      setWarrantyMastersLoading(false);
    }
  };

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
    if (!order || !newMasterId) return;
    const token = localStorage.getItem("token");
    const masterIdNum = parseInt(newMasterId, 10);
    if (isNaN(masterIdNum)) {
      console.warn("Некорректный ID мастера");
      return;
    }

    try {
      const res = await fetch(`${API}/assign/${order.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ assigned_master: masterIdNum }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Ошибка при назначении мастера:", err || res.statusText);
        throw new Error("Не удалось назначить мастера");
      }

      const updated = (await res.json()) as Order;
      setOrder(updated);
      setIsAssignOpen(false);
      setNewMasterId("");
    } catch (e) {
      console.error(e);
      // можно показать пользователю уведомление об ошибке
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
    if (!order || !warrantyMasterId) return;
    const token = localStorage.getItem("token");
    const warrantyMasterIdNum = parseInt(warrantyMasterId, 10);
    if (isNaN(warrantyMasterIdNum)) {
      console.warn("Некорректный ID гарантийного мастера");
      return;
    }

    try {
      await fetch(`${API}/orders/${order.id}/transfer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ warranty_master_id: warrantyMasterIdNum }),
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
          <Dialog open={isAssignOpen} onOpenChange={(open) => {
            setIsAssignOpen(open);
            if (open && masters.length === 0) {
              fetchMasters();
            }
          }}>
            <DialogTrigger asChild>
              <Button>Назначить мастера</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Назначить мастера</DialogTitle>
              </DialogHeader>
              <Select value={newMasterId} onValueChange={setNewMasterId}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder={mastersLoading ? "Загрузка..." : "Выберите мастера"} />
                </SelectTrigger>
                <SelectContent>
                  {masters.map((master) => (
                    <SelectItem key={master.id} value={master.id.toString()}>
                      {master.full_name} ({master.email}) - ID: {master.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button 
                  onClick={handleAssignSubmit}
                  disabled={!newMasterId || mastersLoading}
                >
                  Подтвердить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleRemoveMaster}
            disabled={!order.assigned_master}
          >
            Убрать мастера
          </Button>

          <Dialog open={isTransferOpen} onOpenChange={(open) => {
            setIsTransferOpen(open);
            if (open && warrantyMasters.length === 0) {
              fetchWarrantyMasters();
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="destructive">Передать гарантийному мастеру</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Передать гарантийному мастеру</DialogTitle>
              </DialogHeader>
              <Select value={warrantyMasterId} onValueChange={setWarrantyMasterId}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder={warrantyMastersLoading ? "Загрузка..." : "Выберите гарантийного мастера"} />
                </SelectTrigger>
                <SelectContent>
                  {warrantyMasters.map((master) => (
                    <SelectItem key={master.id} value={master.id.toString()}>
                      {master.full_name} ({master.email}) - ID: {master.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleTransferSubmit}
                  disabled={!warrantyMasterId || warrantyMastersLoading}
                >
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
