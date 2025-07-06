import ExcelPreviewModal from "@/components/ExcelPreviewModal";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import {
    Command,
    Plus,
    Settings2,
    Sheet,
    SquareDashedKanban,
    Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, router } from "@inertiajs/react";
import { BaseResponsePagination, PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ButtonForm from "@/components/button-form";
import ModalConfirm from "@/components/ModalConfirm";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export type SiswaResponseType = {
    id: number;
    nama_lengkap: string;
    status: "aktif" | "do" | "tanpa_keterangan";
    jenis_kelamin?: "L" | "P";
    nis: string;
    jurusan: string;
    kelas?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

interface SiswaIndexProps extends PageProps {
    students: BaseResponsePagination<SiswaResponseType>;
}

export default function SiswaIndex({ alert, students }: SiswaIndexProps) {
    useToast(alert);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [openModalDeletePermanen, setOpenModalDeletePermanen] =
        useState<boolean>(false);
    const [openModalUploadExcel, setOpenModalUploadExcel] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingSearchResetFilter, setLoadingResetFilter] = useState(false);
    const [updatedData, setUpdatedData] = useState<
        SiswaResponseType | undefined
    >(undefined);
    const [searchParams, setSearchParams] = useState({
        type: "nis",
        q: "",
        trashed: "" as "only" | "with",
    });

    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

    const handleSearch = () => {
        router.get(route("siswa.index"), searchParams, {
            preserveState: true,
            replace: true,
            onStart: () => setLoadingSearch(true),
            onFinish: () => setLoadingSearch(false),
        });
    };

    const columns: ColumnDef<SiswaResponseType>[] = [
        {
            id: "select",
            header: ({ table }) => {
                if (
                    table
                        .getCoreRowModel()
                        .flatRows.find(
                            (row) =>
                                row.original.deleted_at === null ||
                                row.original.deleted_at === undefined
                        )
                ) {
                    return "#";
                } else {
                    return (
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() &&
                                    "indeterminate")
                            }
                            onCheckedChange={(value) => {
                                table.toggleAllPageRowsSelected(!!value);
                            }}
                            aria-label="Select all"
                        />
                    );
                }
            },
            cell: ({ row }) => {
                if (
                    row.original.deleted_at === null ||
                    row.original.deleted_at === undefined
                ) {
                    return;
                }
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                        }}
                        aria-label="Select row"
                    />
                );
            },
        },
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = students.current_page - 1; // 0-based
                const pageSize = students.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "nis",
            header: "NIS",
        },
        {
            accessorKey: "nama_lengkap",
            header: "Nama Lengkap",
        },
        {
            accessorKey: "jenis_kelamin",
            header: ({}) => {
                return <div className="text-center">Jenis Kelamin</div>;
            },
            cell: ({ row }) => {
                const { jenis_kelamin } = row.original;
                if (!jenis_kelamin) {
                    return "-";
                }
                return (
                    <div className="text-center">
                        {jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan"}
                    </div>
                );
            },
        },
        {
            accessorKey: "kelas",
            header: "Kelas",
        },
        {
            accessorKey: "jurusan",
            header: "Jurusan",
        },
        {
            accessorKey: "aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <DataTableActionColumn>
                        <>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route("siswa.edit", id))
                                }
                            >
                                <Settings2 />
                                Update
                            </DropdownMenuItem>

                            {row.original.deleted_at ? (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setUpdatedData(row.original);
                                        setOpenModalDeletePermanen(true);
                                    }}
                                >
                                    <Trash2 className="text-red-500" />
                                    Hapus Permanen
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setUpdatedData(row.original);
                                        setOpenModalDelete(true);
                                    }}
                                >
                                    <Trash2 className="text-red-500" />
                                    Hapus
                                </DropdownMenuItem>
                            )}
                        </>
                    </DataTableActionColumn>
                );
            },
        },
    ];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                handleSearch();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [searchParams]);

    return (
        <AuthenticatedLayout title="Siswa">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <h1 className="text-2xl font-semibold mb-3 lg:mb-0">
                    Data Siswa
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() =>
                            setOpenModalUploadExcel(!openModalUploadExcel)
                        }
                    >
                        <Sheet />
                        Upload Data Excel
                    </Button>
                    <Button
                        onClick={() => router.get(route("siswa.create"))}
                        type="button"
                        variant={"secondary"}
                    >
                        <Plus />
                        Tambah Data Siswa
                    </Button>
                </div>
            </div>
            <div className="mt-6 grid gird-cols-1 lg:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1">
                        <Select
                            defaultValue="nis"
                            onValueChange={(value) =>
                                setSearchParams({
                                    ...searchParams,
                                    type: value,
                                })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Cari Data Siswa Berdasarkan" />
                            </SelectTrigger>
                            <SelectContent className="flex flex-1">
                                <SelectGroup>
                                    <SelectItem value="nis">NIS</SelectItem>
                                    <SelectItem value="nama_siswa">
                                        Nama Siswa
                                    </SelectItem>
                                    <SelectItem value="kelas">Kelas</SelectItem>
                                    <SelectItem value="jurusan">
                                        Jurusan
                                    </SelectItem>
                                    <SelectItem value="status">
                                        Status
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"icon"}
                                variant={
                                    searchParams.trashed === "only"
                                        ? "destructive"
                                        : "outline"
                                }
                                onClick={() =>
                                    setSearchParams({
                                        ...searchParams,
                                        trashed:
                                            searchParams.trashed === "only"
                                                ? "with"
                                                : "only",
                                    })
                                }
                            >
                                <Trash2
                                    className={
                                        searchParams.trashed === "only"
                                            ? "text-white dark:text-white"
                                            : "text-gray-700 dark:text-white"
                                    }
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Cari Data Di Sampah?</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div>
                    <Input
                        placeholder={`Cari data siswa berdasarkan ${searchParams.type.replaceAll(
                            "_",
                            " "
                        )}`}
                        value={searchParams.q}
                        onChange={(e) =>
                            setSearchParams({
                                ...searchParams,
                                q: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <ButtonForm
                        loading={loadingSearch}
                        onClick={handleSearch}
                        className="w-full"
                        label="Cari Data"
                        variant="secondary"
                    />
                    <ButtonForm
                        loading={loadingSearchResetFilter}
                        onClick={() => {
                            setSearchParams({
                                q: "",
                                type: "nis",
                                trashed: "with",
                            });
                            router.get(
                                route("siswa.index"),
                                {},
                                {
                                    preserveState: false,
                                    replace: true,
                                    onStart: () => setLoadingResetFilter(true),
                                    onFinish: () =>
                                        setLoadingResetFilter(false),
                                }
                            );
                        }}
                        className="w-full"
                        label="Reset Filter"
                        variant="destructive"
                    />
                </div>
            </div>
            <div className="mt-6">
                {selectedRowIds.length > 0 && (
                    <div className="mb-4 flex items-center justify-between p-4 bg-muted rounded-md">
                        <p className="text-sm">
                            {selectedRowIds.length} data siswa dipilih.
                        </p>
                        <Button
                            variant="default"
                            onClick={() => {
                                router.post(
                                    route("siswa.restore-bulk"),
                                    {
                                        ids: selectedRowIds,
                                    },
                                    {
                                        onSuccess: () => setSelectedRowIds([]),
                                    }
                                );
                            }}
                        >
                            Restore Data
                        </Button>
                    </div>
                )}
                <DataTable
                    data={students.data}
                    columns={columns}
                    current_page={students.current_page}
                    last_page={students.last_page}
                    total={students.total}
                    per_page={students.per_page}
                    path="siswa.index"
                    onRowSelectionChange={(rows) => {
                        if (rows.find((row) => row.deleted_at === null)) {
                            toast.error("Data belum berada didalam sampah!");
                            return;
                        }
                        const ids = rows.map((r: SiswaResponseType) => r.id);
                        setSelectedRowIds(ids);
                    }}
                    links={students.links}
                />
            </div>

            <Dialog
                open={openModalUploadExcel}
                onOpenChange={setOpenModalUploadExcel}
            >
                <DialogContent
                    disableOutsideClick={true}
                    className="max-w-5xl max-h-[90vh] overflow-auto "
                >
                    <DialogHeader>
                        <DialogTitle>Upload excel data siswa</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                            <span className="text-red-400 text-left">
                                Pastikan format file excel sesuai dengan contoh
                                format yang sudah ditentukan. Silahkan download
                                template excel dengan menekan tombol disamping.
                            </span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        download={true}
                                        href={route("download.excel.format")}
                                    >
                                        <SquareDashedKanban className="hover:text-blue-600" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download Template Excel Data Siswa</p>
                                </TooltipContent>
                            </Tooltip>
                        </DialogDescription>
                    </DialogHeader>
                    <ExcelPreviewModal />
                </DialogContent>
            </Dialog>

            <ModalConfirm
                description="Data yang anda hapus dapat anda pulihkan kembali!"
                open={openModalDelete}
                onClose={setOpenModalDelete}
                deleteUrl="siswa.destroy"
                idData={updatedData?.id}
            />
            <ModalConfirm
                open={openModalDeletePermanen}
                onClose={setOpenModalDeletePermanen}
                deleteUrl="siswa.force.destroy"
                idData={updatedData?.id}
            />
        </AuthenticatedLayout>
    );
}
