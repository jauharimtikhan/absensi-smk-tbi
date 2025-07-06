import { ProfileGuru } from "./../pages/pengguna/penggunaTypes";
import { KelasResponseType } from "@/pages/kelas";
import { MapelResponseType } from "@/pages/mapel";
import { UsersType } from "@/pages/pengguna";
import { ToastOptions } from "react-toastify";

export interface User {
    id: number;
    username: string;
    role: "super-admin" | "guru" | "bk";
    profile_guru?: ProfileGuru;
    kelas?: KelasResponseType[];
    mata_pelajarans?: MapelResponseType[];
    api_token: string;
}

export interface AlertType extends ToastOptions {
    message?: string;
    type?: "success" | "error";
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    alert?: AlertType;
};

export interface BaseResponsePagination<TData> {
    data: TData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export type ResponseExportedData = {
    nama_siswa: string;
    nis: string;
    jml: {
        sakit: number;
        alpa: number;
        izin: number;
        telat: number;
    };
    guru?: UsersType;
    jenis_absen?: string;
    mapel?: MapelResponseType;
    kelas: KelasResponseType;
};
