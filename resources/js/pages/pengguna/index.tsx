import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { BaseResponsePagination, PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { FolderKanban, Plus, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { MapelResponseType } from "../mapel";
import { KelasResponseType } from "../kelas";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type UsersType = {
    id: number;
    username: string;
    role: "super-admin" | "guru";
    kelas?: KelasResponseType[];
    mata_pelajarans?: MapelResponseType[];
    created_at: string;
    updated_at: string;
    profile_guru?: {
        id: number;
        nama_guru: string;
        no_telp: string;
        user_id: number;
        alamat: string;
        created_at: string;
        updated_at: string;
    };
};

interface UserIndexProps extends PageProps {
    users: BaseResponsePagination<UsersType>;
}

export default function UserIndex({ alert, users, auth }: UserIndexProps) {
    useToast(alert);
    const [selectedData, setSelectedData] = useState<UsersType | undefined>(
        undefined
    );

    const columns: ColumnDef<UsersType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = users.current_page - 1; // 0-based
                const pageSize = users.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "username",
            header: "Username",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const { role } = row.original;
                return <Badge variant="outline">{role.toUpperCase()}</Badge>;
            },
        },
        {
            accessorKey: "aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const { id, role } = row.original;
                const isOnline = id === auth.user.id ? true : false;
                const isGuru = role === "guru" ? true : false;
                return (
                    <DataTableActionColumn>
                        <>
                            {isGuru && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.get(
                                            route("user.manage.kelas.mapel", id)
                                        )
                                    }
                                >
                                    <FolderKanban />
                                    Kelola Siswa
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => {
                                    router.get(route("user.show", id));
                                }}
                            >
                                <Settings2 />
                                Update
                            </DropdownMenuItem>

                            {!isOnline
                                ? auth.user.role === "super-admin" && (
                                      <DropdownMenuItem onClick={() => {}}>
                                          <Trash2 className="text-red-500" />
                                          Hapus
                                      </DropdownMenuItem>
                                  )
                                : null}
                        </>
                    </DataTableActionColumn>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout title="Pengguna">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Data Pengguna</h1>
                <Button
                    type="button"
                    onClick={() => router.get(route("user.create"))}
                    variant={"secondary"}
                >
                    <Plus />
                    Buat Pengguna Baru
                </Button>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={users.data}
                    last_page={users.last_page}
                    current_page={users.current_page}
                    total={users.total}
                    per_page={users.per_page}
                    links={users.links}
                />
            </div>
        </AuthenticatedLayout>
    );
}
