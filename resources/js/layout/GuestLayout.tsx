import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Hand } from "lucide-react";
import React, { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";

export default function GuestLayout({ children }: PropsWithChildren) {
    const isBrave = () => {
        // @ts-ignore
        return navigator.brave || navigator.userAgent.includes("Brave");
    };
    useEffect(() => {
        const inputs = document.querySelectorAll("input, textarea, select");

        inputs.forEach((input) => {
            input.addEventListener("focus", () => {
                setTimeout(() => {
                    input.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }, 300); // delay agar keyboard sudah muncul
            });
        });

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener("focus", () => {});
            });
        };
    }, []);
    useEffect(() => {
        const inputs = document.querySelectorAll("input, textarea, select");

        const onFocus = () => {
            document.body.style.paddingBottom = "300px";
        };

        const onBlur = () => {
            document.body.style.paddingBottom = "0px";
        };

        inputs.forEach((el) => {
            el.addEventListener("focus", onFocus);
            el.addEventListener("blur", onBlur);
        });

        return () => {
            inputs.forEach((el) => {
                el.removeEventListener("focus", onFocus);
                el.removeEventListener("blur", onBlur);
            });
        };
    }, []);

    if (isBrave()) {
        return (
            <div className="h-dvh flex items-center justify-center">
                <div className="bg-background p-4 w-fit rounded-lg shadow-lg">
                    <Hand className="text-red-500 justify-self-center items-self-center size-16" />
                    <h1 className="text-red-500 font-semibold text-2xl">
                        Anda Terdeteksi Menggunakan Browser Brave, Silahkan
                        Gunakan Browser Lain
                    </h1>
                </div>
            </div>
        );
    }
    return (
        <ThemeProvider defaultTheme="system" storageKey="absensi-theme">
            <TooltipProvider>
                <div className="w-full h-svh flex items-center justify-center">
                    {children}
                </div>
            </TooltipProvider>
        </ThemeProvider>
    );
}
