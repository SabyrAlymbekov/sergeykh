"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    flexRender,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { mastersData, useColumns } from "@shared/constants/masterMangementConstants";

const MasterTable = () => {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [selectedSearchColumn, setSelectedSearchColumn] = React.useState<string>("name");
    const [selectedSortLabel, setSelectedSortLabel] = React.useState("Сортировка");

    const columns = useColumns();

    const table = useReactTable({
        data: mastersData,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 5 },
        },
    });

    // Обработчик сортировки (как и раньше)
    const handleSortChange = (columnId: string, desc: boolean, label: string) => {
        setSorting([{ id: columnId, desc }]);
        setSelectedSortLabel(label);
    };

    // Опции для выбора колонки поиска
    const searchOptions = [
        { id: "id", label: "ID" },
        { id: "name", label: "Name" },
        { id: "balance", label: "Balance" },
        { id: "orders", label: "Qnt of Orders" },
    ];

    // При изменении текста в поисковом поле обновляем фильтр для выбранной колонки
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        setColumnFilters([{ id: selectedSearchColumn, value }]);
    };

    // При выборе новой колонки для поиска очищаем поисковый запрос
    const handleSearchColumnChange = (columnId: string) => {
        setSelectedSearchColumn(columnId);
        setSearchInput("");
        setColumnFilters([]);
    };

    return (
        <div className="w-full">
            {/* Верхняя панель: слева – поиск по выбранной колонке, справа – управление столбцами и сортировкой */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    {/* Dropdown для выбора колонки поиска */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Искать по:{" "}
                                {searchOptions.find((opt) => opt.id === selectedSearchColumn)?.label}{" "}
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {searchOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => handleSearchColumnChange(option.id)}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        placeholder={`Введите запрос для ${
                            searchOptions.find((opt) => opt.id === selectedSearchColumn)?.label
                        }`}
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex space-x-2">
                    {/* Dropdown для управления видимостью столбцов */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
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
                    {/* Dropdown для сортировки */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {selectedSortLabel} <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSortChange("name", false, "Имя A-Z")}>
                                Имя A-Z
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("name", true, "Имя Z-A")}>
                                Имя Z-A
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("balance", false, "Баланс ↑")}>
                                Баланс ↑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("balance", true, "Баланс ↓")}>
                                Баланс ↓
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("orders", false, "Заказы ↑")}>
                                Заказы ↑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSortChange("orders", true, "Заказы ↓")}>
                                Заказы ↓
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSorting([]);
                                    setSelectedSortLabel("Сортировка");
                                }}
                            >
                                Сбросить сортировку
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px] rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => router.push(`/master-management/${row.original.id}`)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Нет мастеров.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Предыдущий
                </Button>
                <span className="text-sm text-muted-foreground">
          Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
        </span>
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
};

export default MasterTable;
