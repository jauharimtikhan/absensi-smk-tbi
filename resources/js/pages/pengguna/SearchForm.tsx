import React from "react";
import { Select2 } from "@/components/select2";
import ButtonForm from "@/components/button-form";
import { Search } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface SearchFormProps {
    kelases: any[];
    mapels: any[];
    form: any;
    loading: boolean;
    onSearch: () => void;
}

export const SearchForm = React.memo(
    ({ kelases, mapels, form, loading, onSearch }: SearchFormProps) => (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Pilih Kelas & Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select2
                        options={kelases}
                        value={form.data.id_kelas}
                        onChange={(value) => form.setData("id_kelas", value)}
                        placeholder="Pilih Kelas"
                        searchable={false}
                    />
                    <Select2
                        options={mapels}
                        value={form.data.id_mapel}
                        onChange={(value) => form.setData("id_mapel", value)}
                        placeholder="Pilih Mata Pelajaran"
                        searchable={false}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <ButtonForm
                    label="Cari"
                    righticon={<Search size={16} />}
                    loading={loading}
                    onClick={onSearch}
                />
            </CardFooter>
        </Card>
    )
);
