import { PageProps } from "@/types";

// File terpisah: absensiTypes.ts
export interface AbsensiIndexProps extends PageProps {
    kelases: OptionsSelect2[];
    mapels: OptionsSelect2[];
    users: OptionsSelect2[];
    guruData: GuruData;
}

export type FormAbsensiType = {
    tanggal: string;
    kelas: string;
    mapel: string;
    jenis_absen: string;
    selected_siswa: {
        id_siswa: string;
        status_absen: string;
    }[];
    user_id: string;
};

export type OptionsSelect2 = {
    label: string;
    value: string;
};

export type GuruData = {
    id: number;
    kelas: KelasResponseType[];
    mata_pelajarans: MapelResponseType[];
    profile_guru?: {
        id: number;
        nama_guru: string;
        no_telp: string;
        user_id: number;
        alamat: string;
        created_at: string;
        updated_at: string;
    };
    role: "super-admin" | "guru";
    username: string;
};

export type SiswaResponseType = {
    id: number;
    nis: string;
    nama_lengkap: string;
    jenis_kelamin: string | null;
    jurusan: string;
};

export type KelasResponseType = {
    id: number;
    nama_kelas: string;
};

export type MapelResponseType = {
    id: number;
    nama_mapel: string;
};
