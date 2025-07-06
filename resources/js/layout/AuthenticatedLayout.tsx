import React, { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Head } from "@inertiajs/react";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Hand } from "lucide-react";
interface AuthtenticatedLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: React.ReactNode;
}
export default function AuthenticatedLayout({
    children,
    title,
    breadcrumbs,
}: AuthtenticatedLayoutProps) {
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
            <ToasterSonner />
            <SidebarProvider>
                <Head title={title || "Admin Panel"} />
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader title={title} />
                    {breadcrumbs && (
                        <div className="@container/main px-4 mt-2">
                            {breadcrumbs}
                        </div>
                    )}
                    <div className="@container/main px-4 py-6 flex flex-1 flex-col gap-2">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
