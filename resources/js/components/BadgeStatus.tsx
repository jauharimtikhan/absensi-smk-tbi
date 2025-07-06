import { Badge } from "@/components/ui/badge";
import React from "react";

type StatusType = "hadir" | "alpa" | "izin" | "sakit" | "telat";

interface BadgeStatusProps {
    status: StatusType;
}

const statusColorMap: Record<StatusType, string> = {
    hadir: "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer",
    alpa: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 cursor-pointer",
    izin: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer",
    sakit: "bg-yellow-400 text-white hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 cursor-pointer",
    telat: "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 cursor-pointer",
};

export default function BadgeStatus({ status }: BadgeStatusProps) {
    return (
        <Badge className={statusColorMap[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
