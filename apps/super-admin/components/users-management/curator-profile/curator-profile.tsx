"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog";
import { HistoryPayments } from "@shared/finances/chartFinances/historyPayments";
import { Master } from "@shared/constants/types";
import { API } from "@shared/constants/constants";
import MastersTable from "@/components/users-management/mastersTable";

interface CuratorProfileProps {
  id: string;
}

type ApiCurator = {
  id: string;
  email: string;
  name: string;
  masters: Master[];
};

type BalanceResponse = {
  balance: number;
};

const CuratorProfile: React.FC<CuratorProfileProps> = ({ id }) => {
  // — все хуки идут здесь в одном блоке —
  const [curatorInfo, setCuratorInfo] = useState<ApiCurator | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // функция для загрузки баланса
  const fetchBalance = async () => {
    setLoadingBalance(true);
    try {
      const res = await axios.get<BalanceResponse>(`${API}/balance/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Ошибка при получении баланса", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  // эффект: загрузка профиля и баланса при mount и id change
  useEffect(() => {
    setLoadingProfile(true);
    setError(null);

    // 1) профиль
    axios
      .get<ApiCurator>(`${API}/users/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setCuratorInfo(res.data);
        setEditedName(res.data.name);
      })
      .catch(() => setError("Не удалось загрузить данные куратора"))
      .finally(() => setLoadingProfile(false));

    // 2) баланс
    fetchBalance();
  }, [id]);

  // CRUD‑функции
  const handleTopUp = () => {
    const t = localStorage.getItem("token") || "";
    axios
      .post(
        `${API}/balance/${id}/top-up/`,
        { amount: topUpAmount },
        { headers: { Authorization: `Token ${t}` } }
      )
      .then(() => {
        setTopUpAmount("");
        fetchBalance();
      })
      .catch(console.error);
  };

  const handleWithdraw = () => {
    const t = localStorage.getItem("token") || "";
    axios
      .post(
        `${API}/balance/${id}/deduct/`,
        { amount: withdrawAmount },
        { headers: { Authorization: `Token ${t}` } }
      )
      .then(() => {
        setWithdrawAmount("");
        fetchBalance();
      })
      .catch(console.error);
  };

  const handleSave = () => {
    const t = localStorage.getItem("token") || "";
    axios
      .patch(
        `${API}/users/${id}/`,
        { name: editedName },
        { headers: { Authorization: `Token ${t}` } }
      )
      .then((res) => {
        setCuratorInfo((prev) =>
          prev ? { ...prev, name: res.data.name } : prev
        );
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleDeleteAccount = async () => {
    const t = localStorage.getItem("token") || "";
    try {
      await axios.delete(`${API}/users/${id}/`, {
        headers: { Authorization: `Token ${t}` },
      });
      setDeleteDialogOpen(false);
      setCuratorInfo(null);
      console.log("Аккаунт куратора удалён");
    } catch (err) {
      console.error("Ошибка при удалении аккаунта:", err);
    }
  };
  // — конец хуков и функций —

  if (loadingProfile) return <div>Загрузка профиля...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!curatorInfo) return <div>Куратор не найден</div>;

  return (
    <div className="flex flex-col mt-5 gap-5">
      <h1 className="text-xl text-center md:text-2xl mb-5 font-bold">
        Профиль куратора {curatorInfo.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        {/* Баланс и операции */}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl text-gray-400">Баланс</h2>
          {loadingBalance ? (
            <span>Загрузка...</span>
          ) : (
            <span className="text-5xl font-bold">{balance} ₸</span>
          )}
          <div className="flex gap-5">
            {/* Пополнить */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-[100px]">
                  Пополнить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Пополнить баланс</DialogTitle>
                </DialogHeader>
                <Input
                  type="number"
                  placeholder="Сумма"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full my-4"
                />
                <DialogFooter className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Отмена</Button>
                  </DialogClose>
                  <Button onClick={handleTopUp}>ОК</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Снять */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-[100px]">
                  Снять
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Снять средства</DialogTitle>
                </DialogHeader>
                <Input
                  type="number"
                  placeholder="Сумма"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full my-4"
                />
                <DialogFooter className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Отмена</Button>
                  </DialogClose>
                  <Button onClick={handleWithdraw}>ОК</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* История платежей */}
        <div className="rounded-xl h-min-max border px-5 py-7">
          <HistoryPayments userId={id} />
        </div>

        {/* Редактирование имени */}
        {/*<ChartBalanceProfile/>*/}
      </div>

      {/* Таблица мастеров */}
      <MastersTable mastersData={curatorInfo.masters} />

      {/* Удаление */}
      <div className="flex justify-center mt-10">
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          Удалить аккаунт
        </Button>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить?</DialogTitle>
          </DialogHeader>
          <p>Это действие необратимо.</p>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CuratorProfile;