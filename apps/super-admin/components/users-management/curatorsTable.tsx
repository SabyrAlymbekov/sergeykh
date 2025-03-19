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

// Импорт данных кураторов (предполагается, что они определены в masterMangementConstants)
import { curatorsData } from "@shared/constants/masterMangementConstants";

// Определяем столбцы для таблицы кураторов.
// В типе Curator: id, name, balance, masters (массив мастеров)
const columns = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "balance",
        header: "Balance",
        cell: (info: any) => info.getValue(),
    },
    {
        accessorKey: "masters",
        header: "Qnt of Masters",
        // Выводим количество мастеров
        cell: (info: any) => Array.isArray(info.getValue()) ? info.getValue().length : 0,
    },
];

const CuratorsTable = () => {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [selectedSearchColumn, setSelectedSearchColumn] = React.useState<string>("name");
    const [selectedSortLabel, setSelectedSortLabel] = React.useState("Сортировка");

    const table = useReactTable({
        data: curatorsData,
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

    // Обработчик сортировки
    const handleSortChange = (columnId: string, desc: boolean, label: string) => {
        setSorting([{ id: columnId, desc }]);
        setSelectedSortLabel(label);
    };

    // Опции для поиска
    const searchOptions = [
        { id: "id", label: "ID" },
        { id: "name", label: "Name" },
        { id: "balance", label: "Balance" },
        { id: "masters", label: "Qnt of Masters" },
    ];

    // Обновление фильтра при изменении поискового запроса
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        setColumnFilters([{ id: selectedSearchColumn, value }]);
    };

    // При выборе новой колонки для поиска очищаем фильтр
    const handleSearchColumnChange = (columnId: string) => {
        setSelectedSearchColumn(columnId);
        setSearchInput("");
        setColumnFilters([]);
    };

    return (
        <div className="w-full">
            {/* Верхняя панель: поиск, управление столбцами и сортировкой */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
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
                    {/* Управление видимостью столбцов */}
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
                    {/* Сортировка */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {selectedSortLabel} <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleSortChange("name", false, "Имя A-Z")}
                            >
                                Имя A-Z
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("name", true, "Имя Z-A")}
                            >
                                Имя Z-A
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("balance", false, "Баланс ↑")}
                            >
                                Баланс ↑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("balance", true, "Баланс ↓")}
                            >
                                Баланс ↓
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("masters", false, "Мастера ↑")}
                            >
                                Мастера ↑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleSortChange("masters", true, "Мастера ↓")}
                            >
                                Мастера ↓
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
                                        onClick={() => router.push(`/curator-management/${row.original.id}`)}
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
                                        Нет кураторов.
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

export default CuratorsTable;
