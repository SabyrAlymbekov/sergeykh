import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPassword({
                                   className,
                                   ...props
                               }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex items-center justify-center min-h-screen", className)}
            {...props}
        >
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email and we&apos;ll send you a code to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Code
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Remembered your password?{" "}
                    <a href="/login" className="underline underline-offset-4">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    )
}
