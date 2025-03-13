
// 🔹 Действия в виде выпадающего меню
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import {Button} from "@workspace/ui/components/button";
import * as React from "react";

export const ActionsMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
  <Button variant="outline">Действия</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
    <DropdownMenuItem>Взять заказ</DropdownMenuItem>
<DropdownMenuItem>Подробнее</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
);
