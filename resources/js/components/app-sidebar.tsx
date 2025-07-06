import * as React from "react";
import {
    ClipboardList,
    DollarSign,
    FolderIcon,
    LayoutDashboardIcon,
    UsersIcon,
    Settings2,
    WalletMinimal,
    GlobeLock,
    Info,
    Siren,
    LibraryBig,
    School,
    Users,
    GraduationCap,
    ShieldUser,
    CalendarDays,
    BookDown,
    CalendarCheck,
    FileUser,
    Trophy,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Link, usePage } from "@inertiajs/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const userData = usePage().props.auth.user;
    const data = {
        navMain: [
            {
                title: "Beranda",
                url: route("home.index"),
                icon: LayoutDashboardIcon,
                active: route().current("home.*"),
                role: ["super-admin", "guru", "bk"],
            },
            {
                title: "Mata Pelajaran",
                url: route("mapel.index"),
                icon: LibraryBig,
                active: route().current("mapel.*"),
                role: ["super-admin"],
            },
            {
                title: "Jadwal KBM",
                url: route("jadwalkbm.index"),
                icon: CalendarCheck,
                active: route().current("jadwalkbm.*"),
                role: ["super-admin", "bk"],
            },
            {
                title: "Kelas",
                url: route("kelas.index"),
                icon: School,
                active: route().current("kelas.*"),
                role: ["super-admin"],
            },
            {
                title: "Jurusan",
                url: route("jurusan.index"),
                icon: GraduationCap,
                active: route().current("jurusan.*"),
                role: ["super-admin"],
            },
            {
                title: "Siswa",
                url: route("siswa.index"),
                icon: Users,
                active: route().current("siswa.*"),
                role: ["super-admin", "bk"],
            },
            {
                title: "Pengguna",
                url: route("user.index"),
                icon: ShieldUser,
                active: route().current("user.*"),
                role: ["super-admin"],
            },
        ],
        navSetings: [
            {
                name: "Absensi",
                url: route("absensi.index"),
                active: route().current("absensi.*"),
                icon: CalendarDays,
                role: ["super-admin", "guru", "bk"],
            },
            {
                name: "Pelanggaran",
                url: route("pelanggaran.index"),
                active: route().current("pelanggaran.*"),
                icon: FileUser,
                role: ["super-admin", "bk"],
            },
            {
                name: "Prestasi",
                url: route("prestasi.index"),
                active: route().current("prestasi.*"),
                icon: Trophy,
                role: ["super-admin", "bk"],
            },
            {
                name: "Rekab",
                url: "",
                active: route().current("laporan.*"),
                icon: BookDown,
                role: ["super-admin", "guru", "bk"],
                subItems: [
                    {
                        name: "Mingguan",
                        url: route("laporan.mingguan"),
                        active: route().current("laporan.mingguan"),
                        role: ["super-admin", "bk"],
                    },
                    {
                        name: "Bulanan",
                        url: route("laporan.bulanan"),
                        active: route().current("laporan.bulanan"),
                        role: ["super-admin", "bk"],
                    },
                    {
                        name: "Semester",
                        url: route("laporan.semester"),
                        active: route().current("laporan.semester"),
                        role: ["super-admin", "bk", "guru"],
                    },
                ],
            },
        ],
    };
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex justify-between items-center gap-2">
                            <SidebarMenuButton
                                asChild
                                className="data-[slot=sidebar-menu-button]:!p-1.5"
                            >
                                <Link href={route("home.index")}>
                                    <span className="text-base font-semibold">
                                        ABSENSI SMK TBI
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                            <ModeToggle />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.navSetings} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
