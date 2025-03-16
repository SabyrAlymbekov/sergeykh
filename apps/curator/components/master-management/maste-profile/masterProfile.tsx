import React from 'react';
import { mastersData } from "@shared/constants/masterMangementConstants";
import { Master } from "@shared/constants/types";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns } from "@shared/constants/orders";

const MasterProfile = ({ id }: { id: string }) => {
    // Выводим в консоль параметр и массив мастеров для отладки
    console.log("URL param id:", JSON.stringify(id));

    // Если mastersData не массив, преобразуем его в массив.
    const mastersArray: Master[] = Array.isArray(mastersData)
        ? mastersData
        : Object.values(mastersData);

    console.log("Masters data:", mastersArray);
    console.log("Masters IDs:", mastersArray.map(master => master.id));

    // Находим мастера по id, используя trim() для устранения лишних пробелов.
    const master = mastersArray.find((master: Master) =>
        master.id.toString().trim() === id.trim()
    );
    console.log("Found master:", master);

    if (!master) {
        return <div>Мастер не найден</div>;
    }

    return (
        <div>
            <h1>Профиль мастера {master.name}</h1>
            <OrdersDataTable data={master.orders} columns={columns} />
        </div>
    );
};

export default MasterProfile;
