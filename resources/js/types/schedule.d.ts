import { User } from ".";

// resources/js/Types/schedule.d.ts
export interface Schedule {
    id: number;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    mata_pelajarans: {
        id: number;
        nama_mapel: string;
        kode_mapel: string;
    };
    guru: User;
    kelas: {
        id: number;
        nama_kelas: string;
    };
}

export interface FilterOptions {
    hari: string[];
    kelas: { id: number; nama_kelas: string }[];
    guru: { id: number; nama: string }[];
    mapel: { id: number; nama_mapel: string }[];
}

export type ScheduleFormData = {
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    mapel_id: number;
    guru_id: number;
    kelas_id: number;
};
