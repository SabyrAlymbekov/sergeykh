"use client"

import * as React from "react"
import {Button} from "@workspace/ui/components/button"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion"
import {ArrowDown, ArrowUp} from "lucide-react";
import {Contact} from "@shared/constants/types";

// Определение типа контакта


// Пример начальных данных (при необходимости замените на реальные данные)
const initialData: Contact[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `User ${i + 1}`,
  number: `+1 555-000-${i + 1}`,
  date: new Date(2023, (i % 12), ((i % 28) + 1)).toISOString(),
}))

export function TableOfCalls() {
  // Объявляем все состояния локально внутри компонента
  const [data, setData] = React.useState<Contact[]>(initialData)
  const [calledContacts, setCalledContacts] = React.useState<Contact[]>([])
  // Явно задаём тип состояния сортировки как SortingState
  const [sorting, setSorting] = React.useState<SortingState>([])
  // Если потребуется, можно также явно задать тип для columnVisibility:
  const [columnVisibility, setColumnVisibility] = React.useState({})


  const columnsTaken: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "number",
      header: "Number",
      cell: ({ row }) => <div className="lowercase">{row.getValue("number")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        const current = column.getIsSorted()
        return (
            <div
                className="flex items-center cursor-pointer select-none w-32"
                onClick={() => {
                  if (current === "asc") {
                    column.toggleSorting(true)
                  } else {
                    column.toggleSorting(false)
                  }
                }}
            >
              <span className="flex-1">Date</span>
              <span className="ml-1 w-4 h-4 flex items-center justify-center">
              {current === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
              ) : current === "desc" ? (
                  <ArrowDown className="h-4 w-4" />
              ) : (
                  <ArrowUp className="h-4 w-4 opacity-0" />
              )}
            </span>
            </div>
        )
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = new Date(rowA.getValue(columnId) as string).getTime()
        const b = new Date(rowB.getValue(columnId) as string).getTime()
        return a > b ? 1 : a < b ? -1 : 0
      },
      cell: ({ row }) => {
        const dateValue = row.getValue("date") as string
        return <div>{new Date(dateValue).toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
          <Button
              variant="outline"
              size="sm"
              onClick={() => markAsCalled(row.original.id)}
          >
            Прозвонён
          </Button>
      ),
    },
  ]



  const table = useReactTable({
    data,
    columns: columnsTaken, // Используем стандартное свойство "columns"
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  const markAsCalled = (id: string) => {
    setData((prev) => {
      const contact = prev.find((c) => c.id === id)
      if (contact) {
        setCalledContacts((prevCalled) => [
          ...prevCalled.filter((c) => c.id !== contact.id),
          contact,
        ])
      }
      return prev.filter((contact) => contact.id !== id)
    })
  }

  return (
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <div className="flex items-center py-4">
            <Input
                placeholder="Filter names..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                          </TableHead>
                      ))}
                    </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                      ))}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-md border px-4">
            <Accordion type="multiple">
              <AccordionItem value="called-contacts">
                <AccordionTrigger>Прозвоненные контакты</AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Number</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calledContacts.map((contact, index) => (
                            <TableRow key={`${contact.id}-${index}`}>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.number}</TableCell>
                              <TableCell>
                                {new Date(contact.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="flex items-center gap-2 text-green-600">
                                {contact.status} Прозвонён
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
  )
}
