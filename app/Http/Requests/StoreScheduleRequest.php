<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreScheduleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'hari' => ['required', 'string', Rule::in(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'ahad'])],
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'mapel_id' => 'required|exists:mapels,id',
            'guru_id' => 'required|exists:users,id',
            'kelas_id' => 'required|exists:kelas,id',
            'ruangan' => 'nullable|string|max:20',
        ];
    }

    public function messages()
    {
        return [
            'jam_selesai.after' => 'Waktu selesai harus setelah waktu mulai',
        ];
    }
}
