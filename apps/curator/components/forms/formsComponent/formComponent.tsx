"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

const AccountSchema = z.object({
    firstName: z.string().min(1, { message: "Введите имя." }),
    lastName: z.string().min(1, { message: "Введите фамилию." }),
    login: z.string().min(1, { message: "Введите логин." }),
    password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов." }),
    status: z.enum(["мастер", "оператор"], { required_error: "Выберите статус." }),
})

export function AccountFormComponent() {
    const form = useForm<z.infer<typeof AccountSchema>>({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            login: "",
            password: "",
            status: "мастер",
        },
    })

    const [showPassword, setShowPassword] = useState(false)

    // Функция генерации случайного пароля из 16 символов
    const generateRandomPassword = () => {
        const length = 16
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
        let result = ""
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        return result
    }

    const handleGeneratePassword = () => {
        form.setValue("password", generateRandomPassword())
    }

    const onSubmit = (data: z.infer<typeof AccountSchema>) => {
        console.log("Account created:", data)
        toast.success("Аккаунт успешно создан!", {
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
                {/* Имя */}
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите имя" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Фамилия */}
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите фамилию" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Логин */}
                <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите логин" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Пароль */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Введите пароль"
                                        {...field}
                                    />
                                </FormControl>
                                <Button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Скрыть" : "Показать"}
                                </Button>
                                <Button type="button" onClick={handleGeneratePassword}>
                                    Сгенерировать
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Статус */}
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
                <Button type="submit">Создать аккаунт</Button>
            </form>
        </Form>
    )
}
