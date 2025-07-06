import { KelasResponseType } from "../kelas";
import { MapelResponseType } from "../mapel";
import { SiswaResponseType } from "../siswa";

export type DetailGuruType = {
    id: number;
    role: "super-admin" | "guru";
    username: string;
    profile_guru?: ProfileGuruType;
    kelas: KelasResponseType[];
    mata_pelajarans?: MapelResponseType[];
    siswa_grouped: {};
};

export type ProfileGuruType = {
    id: number;
    alamat?: string;
    nama_guru?: string;
    no_telp?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
};

export type SiswaGroupKelasType = {
    siswa_id: number;
    mapel_id: number;
    nama_lengkap: string;
    nis: string;
    kelas_nama: string;
    nama_mapel: string;
};

export type SiswaGroupedResponse = {
    success: boolean;
    data: GuruDetailWithGrouping;
};

export interface GuruDetailWithGrouping {
    id: number;
    username: string;
    mata_pelajarans: MataPelajaran[];
    kelas: Kelas[];
    profile_guru: ProfileGuru;
    siswa_grouped: SiswaGroupedMap;
    siswas: SiswaResponseType[];
}

export interface MataPelajaran {
    id: number;
    nama_mapel: string;
}

export interface Kelas {
    id: number;
    nama_kelas: string;
}

export interface ProfileGuru {
    id: number;
    nama_guru: string;
    no_telp: string;
    user_id: number;
    alamat: string;
    created_at: string;
    updated_at: string;
}

export type SiswaGroupedMap = {
    [mapel_id: number]: {
        [kelas_nama: string]: SiswaDetail[];
    };
};

export interface SiswaDetail {
    siswa_id: number;
    nama_lengkap: string;
    nis: string;
    kelas_nama: string;
    mapel_id: number;
    nama_mapel: string;
}
