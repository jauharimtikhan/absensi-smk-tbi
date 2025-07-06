import { OptionsSelect2 } from "@/pages/absensi/absensiTypes";
import { router } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan tanda hubung
        .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
        .replace(/--+/g, "-"); // Hapus duplikat tanda hubung
}

export function generateRandomPassword(length: number = 6): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomChar = characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
        password += randomChar;
    }

    return password;
}

export const translatedMonth: Record<number, string> = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "Mei",
    5: "Jun",
    6: "Jul",
    7: "Agt",
    8: "Sep",
    9: "Okt",
    10: "Nov",
    11: "Des",
};

export const STATUSABSENSI: OptionsSelect2[] = [
    {
        label: "Hadir",
        value: "hadir",
    },
    {
        label: "Alpa",
        value: "alpa",
    },
    {
        label: "Izin",
        value: "izin",
    },
    {
        label: "Sakit",
        value: "sakit",
    },
    {
        label: "Telat",
        value: "telat",
    },
];

/**
 * Memformat nomor telepon Indonesia
 * @param phoneNumber Nomor telepon yang akan diformat (boleh mengandung spasi, tanda hubung, dll)
 * @returns Nomor telepon yang sudah diformat sesuai standar Indonesia
 */
export function formatIndonesianPhoneNumber(phoneNumber: string): string {
    // Hapus semua karakter non-digit
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Cek panjang nomor minimal
    // if (cleaned.length < 9) {
    //     throw new Error("Nomor telepon terlalu pendek");
    // }

    // Cek apakah nomor sudah mengandung kode negara
    if (cleaned.startsWith("62")) {
        // Format: +62 xxx xxxx xxxx...
        const rest = cleaned.substring(2);
        return `+62 ${splitNumberGroups(rest)}`;
    }
    // Cek jika nomor diawali dengan 0
    else if (cleaned.startsWith("0")) {
        // Format: +62 xxx xxxx xxxx... (dihilangkan angka 0 pertama)
        const rest = cleaned.substring(1);
        return `+62 ${splitNumberGroups(rest)}`;
    }
    // Untuk nomor tanpa kode negara atau prefix
    else {
        return `+62 ${splitNumberGroups(cleaned)}`;
    }
}

/**
 * Membagi nomor menjadi kelompok-kelompok angka
 * @param number String angka yang akan dibagi
 * @returns String dengan format kelompok angka dipisahkan spasi
 */
function splitNumberGroups(number: string): string {
    const chunks: string[] = [];

    // Mulai dari awal string
    let index = 0;

    // Kelompok pertama selalu 3 digit (kode operator)
    if (number.length > 0) {
        chunks.push(
            number.substring(index, Math.min(index + 3, number.length))
        );
        index += 3;
    }

    // Kelompok berikutnya masing-masing 4 digit
    while (index < number.length) {
        chunks.push(number.substring(index, index + 4));
        index += 4;
    }

    return chunks.join(" ");
}
