"use client";

import React from "react";
import ContentLayout from "./ContentLayout";
import { Button } from "@workspace/ui/components/button";

import MastersTable from "@/components/users-management/mastersTable";
import CuratorsTable from "@/components/users-management/curatorsTable";
import OperatorsTable from "@/components/users-management/operatorsTable";
import { ContentLayoutBg } from "@/constants/constants";
import axios from "axios";
import { API } from "@shared/constants/constants";

type UsersTypeT = "curator" | "master" | "operator";

// Функция для капитализации строки
const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const UsersTab = () => {
    // Состояние для всех пользователей, полученных с API
    const [staffData, setStaffData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    // Запрос данных при монтировании компонента
    React.useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`${API}/get-all-staff-users/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
            })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setStaffData(response.data);
                } else {
                    console.error("Unexpected response data:", response.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching staff users:", error);
                setLoading(false);
            });
    }, []);

    // Фильтруем данные для каждой роли
    const mastersData = React.useMemo(
        () => staffData.filter((user) => user.role === "master"),
        [staffData]
    );
    const curatorsData = React.useMemo(
        () => staffData.filter((user) => user.role === "curator"),
        [staffData]
    );
    const operatorsData = React.useMemo(
        () => staffData.filter((user) => user.role === "operator"),
        [staffData]
    );

    // Доступные вкладки (роли)
    const availableTabs: UsersTypeT[] = ["curator", "master", "operator"];
    const [usersType, setUsersType] = React.useState<UsersTypeT>(availableTabs[0]!);

    const handleClick = (type: UsersTypeT) => {
        setUsersType(type);
    };

    // В зависимости от выбранной вкладки возвращаем соответствующий компонент с данными
    const renderContent = () => {
        switch (usersType) {
            case "curator":
                return <CuratorsTable curatorsData={curatorsData} />;
            case "master":
                return <MastersTable mastersData={mastersData} />;
            case "operator":
                return <OperatorsTable operatorsData={operatorsData} />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ContentLayout
            title={
                <div className="flex flex-row gap-3">
                    {availableTabs.map((tab) => (
                        <Button
                            key={tab}
                            variant={usersType === tab ? "default" : "outline"}
                            onClick={() => handleClick(tab)}
                        >
                            {tab === "master"
                                ? "Masters"
                                : tab === "curator"
                                    ? "Curators"
                                    : tab === "operator"
                                        ? "Operators"
                                        : capitalize(tab)}
                        </Button>
                    ))}
                </div>
            }
            bg={
                typeof window !== "undefined" && window.innerWidth < 768
                    ? ContentLayoutBg.Transperent
                    : ContentLayoutBg.Black
            }
        >
            {renderContent()}
        </ContentLayout>
    );
};

export default UsersTab;
