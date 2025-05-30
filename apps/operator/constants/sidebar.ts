import { Home, Headset, ChartColumn,BookPlus,  UserRound, CalendarCheck, Settings, ChartNoAxesCombined } from 'lucide-react';

export const sidebar_items = [
    {
      name: "Основные",
      list: [
        {
          title: "Главная",
          url: "/",
          icon: Home,
        }
      ]
    },
    {
        name: "Инструменты",
        list: [
          {
                title: "Не обзвоненные",
                url: "/not_called",
                icon: Headset,
            },
            {
                title: "Форма для заказа",
                url: "/form_for_order",
                icon: BookPlus,
            },
            {
                title: "Финансы",
                url: "/finance",
                icon: ChartColumn,
            },
            {
                title: "Позвонить",
                url: "/call",
                icon: ChartColumn,
            },
        ]
    },
    // {
    //     name: "Информация",
    //     list: [
    //         {
    //             title: "График работы",
    //             url: "/schedule",
    //             icon: CalendarCheck
    //         }, {
    //             title: "Профиль",
    //             url: "/profile",
    //             icon: UserRound
    //         }, {
    //             title: "Рейтинг",
    //             url: "/leaderboard",
    //             icon: ChartNoAxesCombined
    //         }, {
    //             title: "Настройки",
    //             url: "/settings",
    //             icon: Settings
    //         }
    //     ]
    // }
]