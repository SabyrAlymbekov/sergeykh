"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Calendar } from "@workspace/ui/components/calendar"
import { Textarea } from "@workspace/ui/components/textarea"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

const FormSchema = z.object({
    number: z.string().min(10, { message: "Введите корректный номер телефона." }),
    name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
    tariff: z.string().min(1, { message: "Тарифный план обязателен." }),
    address: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов." }),
    age: z.coerce.number({ invalid_type_error: "Введите число" }).min(0, { message: "Возраст должен быть положительным числом." }),
    equipmentType: z.string().min(1, { message: "Тип оборудования обязателен." }),
    price: z.coerce.number({ invalid_type_error: "Введите число" }).min(0, { message: "Цена должна быть положительной." }),
    promotions: z.string().min(1, { message: "Поле «Акции» обязательно для заполнения." }),
    status: z.enum(["мастер", "оператор"], { required_error: "Выберите статус" }),
    deadline: z.date(),
})

export function OrderFormComponent() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            number: "",
            name: "",
            tariff: "",
            address: "",
            age: 0,
            equipmentType: "",
            price: 0,
            promotions: "",
            status: "мастер",
            deadline: new Date(),
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("success", data)
        toast.success("Форма успешно отправлена!", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Номер телефона</FormLabel>
                            <FormControl>
                                <Input placeholder="+7 XXX-XX-XX-XX" {...field} />
                            </FormControl>
                            <FormDescription>Введите ваш контактный номер телефона.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Полное имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите ваше имя" {...field} />
                            </FormControl>
                            <FormDescription>Введите ваше полное имя.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tariff"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тарифный план</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Опишите ваш тарифный план..." {...field} />
                            </FormControl>
                            <FormDescription>Укажите детали вашего тарифного плана.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Адрес</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите адрес" {...field} />
                            </FormControl>
                            <FormDescription>Введите адрес доставки или объект.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Возраст</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Введите возраст" {...field} />
                            </FormControl>
                            <FormDescription>Введите ваш возраст.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="equipmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тип оборудования</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите тип оборудования" {...field} />
                            </FormControl>
                            <FormDescription>Укажите тип оборудования для заказа.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Цена</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Введите цену" {...field} />
                            </FormControl>
                            <FormDescription>Укажите стоимость заказа.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="promotions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Акции</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите акции" {...field} />
                            </FormControl>
                            <FormDescription>Укажите действующие акции или скидки.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Статус</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="мастер">Мастер</SelectItem>
                                        <SelectItem value="оператор">Оператор</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Срок исполнения</FormLabel>
                            <br />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : "Выберите дату"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Выберите дату выполнения заказа.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Отправить</Button>
            </form>
        </Form>
    )
}
