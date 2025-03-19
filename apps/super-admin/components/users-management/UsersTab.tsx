"use client"

import React from 'react'

import ContentLayout from './ContentLayout'
import { Button } from '@workspace/ui/components/button'

import MastersTable from "@/components/users-management/mastersTable";
import {ContentLayoutBg} from "@/constants/constants";
import CuratorsTable from "@/components/users-management/curatorsTable";
import OperatorsTable from "@/components/users-management/operatorsTable";

type UsersTypeT = 'curator' | 'master' | 'operator';

// interface UsersTabProps {
//     status: 'curator' | 'master';
// }

// Вспомогательная функция для капитализации строки
const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const UsersTab = () => {
    // Определяем список вкладок в зависимости от статуса
    const availableTabs: UsersTypeT[] = ['curator', 'master', 'operator'];

    // Гарантируем, что availableTabs[0] существует, используя !
    const [usersType, setUsersType] = React.useState<UsersTypeT>(availableTabs[0]!);

    const handleClick = (type: UsersTypeT) => {
        setUsersType(type);
    };

    const renderContent = () => {
        switch (usersType) {
            case 'curator':
                return <CuratorsTable/>;
            case "master":
                return <MastersTable/>;
            case "operator":
                return <OperatorsTable/>;
            default:
                return null;
        }
    };


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
                            {tab === 'master'
                                ? "Masters"
                                : tab === 'curator'
                                    ? "Curators"
                                    : tab === "operator"
                                        ? "Operators" : capitalize(tab)}
                        </Button>
                    ))}
                </div>
            }
            bg={
                typeof window !== 'undefined' && window.innerWidth < 768
                    ? ContentLayoutBg.Transperent
                    : ContentLayoutBg.Black
            }
        >
            {renderContent()}
        </ContentLayout>
    );
};

export default UsersTab;
