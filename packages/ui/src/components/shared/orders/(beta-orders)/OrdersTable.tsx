"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Minus, Plus, X } from "lucide-react"; // <-- Иконка X
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog";

import { Checkbox } from "@workspace/ui/components/checkbox";

import { OrdersDataTableProps } from "@shared/constants/orders";
import ActiveOrders from "@shared/orders/ActiveOrders";

/**
 * Расширенный интерфейс OrdersDataTableProps:
 * export interface OrdersDataTableProps {
 *   data: any[];
 *   columns: ColumnDef<any, any>[];
 *   status?: string;
 *   isEdit?: boolean;
 *   onSelectedChange?: (selected: any[]) => void;
 * }
 */

export function OrdersDataTable({
                                  data,
                                  columns,
                                  status,
                                  isEdit = false,
                                  onSelectedChange = () => {},
                                }: OrdersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    orderNumber: false,
    date: true,
    client: true,
    contact: false,
    address: false,
    problem: false,
    cost: true,
    executionTime: false,
    master: false,
    status: true,
    actions: false,
  });

  // Локально храним массив заказов, чтобы можно было «убирать» заказы
  const [localData, setLocalData] = React.useState<any[]>(() => data);

  // Режим удаления
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);

  // Состояние для выбранных заказов (режим редактирования)
  const [selectedOrders, setSelectedOrders] = React.useState<any[]>([]);

  const router = useRouter();

  const table = useReactTable({
    data: localData, // <-- Используем локальный массив
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
  });

  // Обработчик переключения режима удаления
  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  // Удалить заказ из localData
  const handleRemoveOrder = (orderId: string) => {
    setLocalData((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Обработчик клика по строке (только если не режим редактирования и не режим удаления)
  const handleRowClick = (id: string) => {
    if (!isEdit && !isDeleteMode) {
      router.push(`/orders/${id}`);
    }
  };

  // Обработчик переключения чекбокса для режима редактирования
  const handleCheckboxChange = (order: any, checked: boolean) => {
    setSelectedOrders((prev) => {
      const updated = checked
          ? [...prev, order]
          : prev.filter((o) => o.id !== order.id);

      console.log("Новые выбранные заказы (сразу после чекбокса):", updated);
      onSelectedChange(updated);

      return updated;
    });
  };

  return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
              placeholder="Найти заказы..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
          />

          {status === "curator" && (
              <div className="flex gap-2 ml-4">
                {/* Кнопка «-»: включает/выключает режим удаления */}
                <Button
                    variant={isDeleteMode ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleDeleteMode}
                >
                  <Minus />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full md:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Добавить заказ</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                      {/* Здесь ActiveOrders */}
                      <ActiveOrders
                          isActiveEdit={true}
                          onSelectedChange={onSelectedChange}
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                      </DialogClose>
                      <Button>Добавить</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Столбцы <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => (
                  <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {isEdit && <TableHead className="w-10 text-center">#</TableHead>}
                      {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                      ))}
                      {/* Если включён режим удаления, добавим ещё один столбец под кнопку удаления */}
                      {isDeleteMode && (
                          <TableHead className="w-10 text-center">Удалить</TableHead>
                      )}
                    </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const rowOrder = row.original;
                      return (
                          <TableRow
                              key={row.id}
                              className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                  (isEdit || isDeleteMode) ? "cursor-default" : ""
                              }`}
                              onClick={() => handleRowClick(rowOrder.id)}
                          >
                            {/* Режим редактирования (чекбоксы) */}
                            {isEdit && (
                                <TableCell className="text-center">
                                  <Checkbox
                                      checked={selectedOrders.some((o) => o.id === rowOrder.id)}
                                      onCheckedChange={(checked) =>
                                          handleCheckboxChange(rowOrder, !!checked)
                                      }
                                  />
                                </TableCell>
                            )}
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                            {/* Режим удаления (красная кнопка с крестиком) */}
                            {isDeleteMode && (
                                <TableCell className="text-center">
                                  <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => handleRemoveOrder(rowOrder.id)}
                                  >
                                    <X />
                                  </Button>
                                </TableCell>
                            )}
                          </TableRow>
                      );
                    })
                ) : (
                    <TableRow>
                      <TableCell
                          colSpan={
                              columns.length +
                              (isEdit ? 1 : 0) +
                              (isDeleteMode ? 1 : 0)
                          }
                          className="h-24 text-center"
                      >
                        Пусто.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
          >
            Предыдущий
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
          >
            Следующий
          </Button>
        </div>
      </div>
  );
}
