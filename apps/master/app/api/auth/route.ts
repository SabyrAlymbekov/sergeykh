import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/auth/login",
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );

        return NextResponse.json({
            message: "Аутентификация успешна",
            token: response.data.token,
        });
    } catch (error) {
        // Если ошибка является ошибкой axios и в ответе присутствует статус
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                {
                    message: "Неверные данные",
                    error: error.response.data.error || error.response.data.message,
                },
                { status: error.response.status }
            );
        }
        // Общая обработка ошибок
        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        );
    }
}
