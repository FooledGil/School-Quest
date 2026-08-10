<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\Schedule;
use App\Models\PiketSchedule;
use App\Models\PiketMember;
use App\Models\Quest;
use App\Models\Achievement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // ADMINS
        User::create(['name' => 'Admin Sekolah', 'email' => 'admin@schoolquest.id', 'password' => Hash::make('admin123'), 'role' => 'admin']);
        User::create(['name' => 'Guru Piket', 'email' => 'guru@schoolquest.id', 'password' => Hash::make('guru123'), 'role' => 'admin']);

        // STUDENTS FROM PDF (220 Students across 5 Classes)
        $students = [
            // --- RUANG 11 (X-MPLB 1) ---
            ['nisn' => '0117148583', 'name' => 'AISYAH', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0112413356', 'name' => 'ALIA RAHMAWATI GUNAWAN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0107094516', 'name' => 'AMANDA AMELIA PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0115300239', 'name' => 'AMELIA PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0104452254', 'name' => 'DARA ANNISA RAMADHANI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0117309491', 'name' => 'DAVINA JULYAN NOOR WAHID', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0114643174', 'name' => 'DEDE ASRI SAFITRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0106486784', 'name' => 'ELSA NURHIDAYAT', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0105470789', 'name' => 'FANI NASWA RAHMANIAH', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0111021684', 'name' => 'GHINA DZAKWAN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0102580835', 'name' => 'HANUM KIRANA PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0103322092', 'name' => 'KEISYA MAHIRA PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0102341519', 'name' => 'KEYLA PUTRI PRANATA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0116123701', 'name' => 'KHANSA CIBILLA AZ ZAHRAN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0109411960', 'name' => 'MARVELL GARCIA NANDA AGAM', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0111320578', 'name' => 'MAULIADIVA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0109167586', 'name' => 'MILEVA MELISENDA ADNI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0105541279', 'name' => 'MIZQI KHANSA MAHARDHIKA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0106972435', 'name' => 'NABILA AUFA AGUSTIN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0109095935', 'name' => 'NABILA AULIA ZAHRA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0104267281', 'name' => 'NADIRA RAISA SHAMILA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0114730562', 'name' => 'NAISYA RESFIORI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0112579809', 'name' => 'NANDA KHOIRUNNISA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0112565950', 'name' => 'NASYA KINANTI LESTARI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0112473270', 'name' => 'NAYLA SABILLA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0108038895', 'name' => 'PANJI SETIAWAN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0116312564', 'name' => 'PARAMITHA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0118490560', 'name' => 'RADEN SABRINA MAHARANI PUTRI SOERYADI NINGRAT', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0118545832', 'name' => 'RAIN KALEA INDRYASKA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0115790343', 'name' => 'RAIS AGNA MUNAWAR', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0103917052', 'name' => 'RAISYA SALSABILA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0094547104', 'name' => 'RAMDAN', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0102534954', 'name' => 'RAVA DWI ANASTASYA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0101416056', 'name' => 'SAFA JULIANA MOCHTAR', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0119769506', 'name' => 'SAFIRA FEBRYANTI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0113754143', 'name' => 'SHIFA CAHAYA KAMILA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0116308395', 'name' => 'SIFA DITIANI PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0107975252', 'name' => 'TALITHA AMANDA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0119714431', 'name' => 'TANIA ISNAENI PUTRI', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0092613939', 'name' => 'TIRTA WELAS TANDANG', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0115908461', 'name' => 'VALERIE SYAUQIA FAUSTINE', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0112873580', 'name' => 'VEVIERA AZAHRA', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0109960797', 'name' => 'VINA YUSTI FAUZIAH', 'class' => 'X-MPLB 1', 'exp' => 0],
            ['nisn' => '0115809729', 'name' => 'YULIANTI', 'class' => 'X-MPLB 1', 'exp' => 0],

            // --- RUANG 12 (X-MPLB 2) ---
            ['nisn' => '0103742689', 'name' => 'ANGGI SYAHPUTRI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106330592', 'name' => 'ASYFA NOER RAHMANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0115221502', 'name' => 'AULIA NURWULAN', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0116109070', 'name' => 'AURORA GANTARI ASMARANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0115354722', 'name' => 'DELFINO RIZMAULIDAN ADIGRAHA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0104531343', 'name' => 'DENAYA NAZAH AISYARAH', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0114675075', 'name' => 'DEWI FARHANA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106231060', 'name' => 'FINA NAZWA RAHMA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0109912183', 'name' => 'GANJAR PUTRA GUMILANG', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0103663723', 'name' => 'JANE AL ZENA PONGO', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0108590793', 'name' => 'KAILA NURCAHYANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0112456266', 'name' => 'KHANSA NAFISAH', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0118313116', 'name' => 'KHEYRA AULIA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0101830611', 'name' => 'M. FIKRI NURZAINI SALAM', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0111900838', 'name' => 'MOCH ZILBRAN ALFHARIZI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0104171543', 'name' => 'MOCHAMAD FAHRI HUSAENI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0103546103', 'name' => 'MUHAMMAD ARI NUGRAHA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106068031', 'name' => 'NAYSILA ASRI NOVIANTI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0105893670', 'name' => 'NAZLA RAMADHANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0105962496', 'name' => 'NESA AGUSTRIANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0107192202', 'name' => 'NESYA ASTIANTI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0101784270', 'name' => 'NINDA NUR ASARIFUDIN', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0119751677', 'name' => 'NOVI ARIYANTI MUSTOPA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0108396143', 'name' => 'NURSIFA AMELIA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106382283', 'name' => 'PUTRA PRATAMA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0102008487', 'name' => 'PUTRI OKTAVIANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0105421363', 'name' => 'RAYA RAMADHANI SAFITRI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0104251140', 'name' => 'RAZKIA RAMDIANA MAULANA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0116142587', 'name' => 'RENA APRILIA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0105803994', 'name' => 'RINA AULIA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0107662223', 'name' => 'RINI AUDI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0108840351', 'name' => 'RISCHA JULIANTY', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0108663707', 'name' => 'RIZQITA APRILLIA ANISA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0107440503', 'name' => 'SILVA SAFIRA AULIA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0119940776', 'name' => 'SITI NAFISYA PUTRI NOOR', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0107350595', 'name' => 'SITI NURFAJRIYAH', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106900955', 'name' => 'SYAKILA WARDA ANJANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0107358541', 'name' => 'TOMY TAUPIK RAHMAN', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0106182069', 'name' => 'TYARA DWI PUTRI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0115730906', 'name' => 'VIRA ALTHOFUNNISA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0115190212', 'name' => 'VIRLI APRILIANI', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0109699362', 'name' => 'VITA MEILANY', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0105918046', 'name' => 'VITRI MELANI NUGRAHA', 'class' => 'X-MPLB 2', 'exp' => 0],
            ['nisn' => '0108488884', 'name' => 'ZIDNI SALIM BRIK BAJRI', 'class' => 'X-MPLB 2', 'exp' => 0],

            // --- RUANG 13 (X-PM 1) ---
            ['nisn' => '0108842745', 'name' => 'AANDINI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0101137098', 'name' => 'ADHILLA NOVISHA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0118453911', 'name' => 'AFDAL CAHYA RAJAB', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0106626474', 'name' => 'AFIAH NURFADILAH', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0107607752', 'name' => 'AFIZA QANITA EL FASHA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0108664503', 'name' => 'AINUNNISA JELIKA DAMAYANTI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104854049', 'name' => 'AIRA OKTAVIANI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104574913', 'name' => 'ALDO PUTRA PRATAMA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0112970516', 'name' => 'ALISHBA NUR AZMAH HARAHAP', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104473734', 'name' => 'BUNGA RAFIILIA SALSABIL', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0105598614', 'name' => 'CAHAYA WULAN TIKA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0107087773', 'name' => 'DEA TRIWAHYUNI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0105944154', 'name' => 'DEFARA PUTRI KIRANA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0111563722', 'name' => 'DENOVA DWI JAYANTI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0118543412', 'name' => 'EDO SAPUTRA PRATAMA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0109790704', 'name' => 'EPA ROSITA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104042192', 'name' => 'HANDINI DWI ARYANTI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0105906119', 'name' => 'HANI OKTAPIANI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0119364183', 'name' => 'JAIDI NUR ROHMAN', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0108602787', 'name' => 'KAIFA MARWAH', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0114731941', 'name' => 'KARISA NAYA PUTRI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '3111595947', 'name' => 'KAYLA MARITZA SALSABILA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0094285560', 'name' => 'KEYNAS SHIFA PURNAMA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104478828', 'name' => 'M. SANDI ANUGRAH', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0107827267', 'name' => 'MALA NURPANJANI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0115513148', 'name' => 'NABIL RAYYA SILVIA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0112488850', 'name' => 'NADIA AVIZAH AZAHRA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0102126514', 'name' => 'NAFISAH KHOIRUNNISA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0096392285', 'name' => 'NAYLA APRILIANI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0106550426', 'name' => 'RADILLA ALIFA PUTRI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0103802470', 'name' => 'RAFFI HAMDANI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0109572245', 'name' => 'RAFI SURYA GUMELAR', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0112018104', 'name' => 'RAISYA INTAN QIRANIA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0104343432', 'name' => 'SAEFUL FAHRI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0114882322', 'name' => 'SAFITRI NURMALA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '3108479730', 'name' => 'SALMA AULIA MALIK', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0101761642', 'name' => 'SALSA SABILA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0116824187', 'name' => 'SALWA ANANTA PUTRI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0105467864', 'name' => 'SALWA NURFADILAH', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0108556571', 'name' => 'SARAH AZZAHRA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0117072793', 'name' => 'TANTRI APRILYANTI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0112715674', 'name' => 'TASYA NUR APRILIYANTI', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0108099640', 'name' => 'ZAHIRA ERVRITA CLARISA', 'class' => 'X-PM 1', 'exp' => 0],
            ['nisn' => '0106136781', 'name' => 'ZAHRA AVINA', 'class' => 'X-PM 1', 'exp' => 0],

            // --- RUANG 14 (X-PM 2) ---
            ['nisn' => '0127520447', 'name' => 'ALYA NUR MAULIDA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0113117086', 'name' => 'ALYA RIZKI MAULIDA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0117121751', 'name' => 'ALYASYFA FAUZIAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0105812939', 'name' => 'ALYSSA NUR SHAFIRA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0108383031', 'name' => 'AMANDA AGRA DISASTRA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0105309679', 'name' => 'AMELIA RAHMATIN', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0102749875', 'name' => 'ANDHIRA RAMDHAN DHARMADI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0103139951', 'name' => 'ANDINI AIRIN ALI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '3117671624', 'name' => 'CHANTIKA JASMINE THUFAILLAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0117091843', 'name' => 'CITRA AYU NABILLA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0107164257', 'name' => 'DESWITA MAHARANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0104794282', 'name' => 'DETIANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0106108727', 'name' => 'DEVINNA SHINTYA SARI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0102805087', 'name' => 'DHIYA RAHMA HANNIYAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0108488518', 'name' => 'FITRIA ANDJANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0112221165', 'name' => 'FRIZKA ALFIONITA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0105714754', 'name' => 'HANNA NASILA RAMADHANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0107451974', 'name' => 'KEYSHA DWI ANANDHA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0104601044', 'name' => 'KEYSHA RIZKI SEPTIYANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0111967782', 'name' => 'KHALISA AIDA SHAFIRA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0116758050', 'name' => 'LAILA ZAHRA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0116238867', 'name' => 'MEISYA PUTRI ANDERI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0117688613', 'name' => 'MELIA SRI RAHMASARI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0119127123', 'name' => 'NAYLA DERI SAFITRI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0108131847', 'name' => 'NAZWA AL RITAZ MECCA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0119592302', 'name' => 'NAZWA NURSIFA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0104420484', 'name' => 'NISA APRILIA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0112991443', 'name' => 'QISWA ALIFA MERYANDANY', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0112455530', 'name' => 'RAUDHA REVI RISGRIANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0108520819', 'name' => 'RAYNA JULIA MAVICA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0101230487', 'name' => 'RAYSHA MASSAHID SENTONO', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0115312791', 'name' => 'RD NISRINA ATHIRAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0119888336', 'name' => 'RESTI CAHYANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0104125984', 'name' => 'SARAH NUR SALSABILA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0101908063', 'name' => 'SARAH OKTAPIANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0101081572', 'name' => 'SATRIA RESTU RIADI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0102674753', 'name' => 'SEKAR GHIANTY', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0117021602', 'name' => 'SELLY APRILIANI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0118365157', 'name' => 'SHAILA NURHALIJAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0108317893', 'name' => 'SHELA ISAURA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0104629544', 'name' => 'TRI SAKTI', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0095668623', 'name' => 'YANTI NURCAHYA', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0106728951', 'name' => 'ZALFA ALFIYAH', 'class' => 'X-PM 2', 'exp' => 0],
            ['nisn' => '0103686129', 'name' => 'ZALFA ASHFIYA', 'class' => 'X-PM 2', 'exp' => 0],

            // --- RUANG 15 (X-PM 3) ---
            ['nisn' => '3115272065', 'name' => "ANINDYA LUTHFATUS SA`DIYYAH", 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0115645186', 'name' => 'AQILLAH ZULFIANA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0115097324', 'name' => 'ASHYFA AZAHRA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0107746400', 'name' => 'AURA SAVA RADITYA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0104342917', 'name' => 'AUREL RAM ZHULYESFA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0125928421', 'name' => 'AZ ZAHRA PUTRI ARIYANTI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0093018555', 'name' => 'AZKA ALFARIZI ALIMUDIN', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0107153580', 'name' => 'AZKA ALLANA FAUZAN', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0119965211', 'name' => 'CLARISSA ISKANDAR', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0116267488', 'name' => 'CYNTIA RAHMA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0107187530', 'name' => 'DIANA ZULVA NURAFNI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0101068092', 'name' => 'DIAS SAPUTRA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0114720977', 'name' => 'DTRI NUR MAULANA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0105815220', 'name' => 'DWI AYU LISTIAWATI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109558448', 'name' => 'IMELIA RACHMA DANIEZ', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0101575979', 'name' => 'INTAN NURUL AINI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109614123', 'name' => 'KHALISTA JULIANTI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109129054', 'name' => 'KHANIA GILDA RIYANA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0105919466', 'name' => 'KHANSA ALIFAH AZZAHRA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0104505773', 'name' => 'MEYLAN PUTRI ENGGAL ARDANI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0106724648', 'name' => 'MOZZA APRILLIA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0101871977', 'name' => 'MUTIARA ZUHRIATUL HAFIDZ', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '3100980098', 'name' => 'NISA AULIA RAMADHANI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109758107', 'name' => 'NURUL LATIFAH', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0118405939', 'name' => 'NURYAMAN', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0101217195', 'name' => 'PUTRI ELLENA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109082581', 'name' => 'PUTRI KARTIKA AMELLIANI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0117670710', 'name' => 'RESYA AMALIA PUTRI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0109623768', 'name' => 'RHESMA NOVIYANTI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0119446341', 'name' => 'RIPA PUTRI NURHAYATI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0111995868', 'name' => 'RISKI ELDIANSA PILIANG', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0105361122', 'name' => 'RIZAL AL - FARISI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '3101890263', 'name' => 'RIZKY NUR FADILAH', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0114245657', 'name' => 'RUBY PUTRI ANJANI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0106308647', 'name' => 'RUMAISYA FADHILAH RAMADHANI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0105913598', 'name' => 'SITI NURWATI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0118487841', 'name' => 'SITI RAHMA DHIYA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0114756254', 'name' => 'SOFIA SUMBINGAH', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0117356264', 'name' => 'SYAHRIANI AGRIL', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0116630984', 'name' => 'SYAHRIL AWALI LESMANA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0101719563', 'name' => 'SYIFA LUMATUTS TSURAYA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0108625892', 'name' => 'ZASKIYA AZZAHRA RIANDINI', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0111302611', 'name' => 'ZIPANA MAULIDINA', 'class' => 'X-PM 3', 'exp' => 0],
            ['nisn' => '0102180770', 'name' => 'ZIVANA NAJLA NURFAJRIA', 'class' => 'X-PM 3', 'exp' => 0],
        ];

        $studentModels = [];
        foreach ($students as $s) {
            $studentModels[] = User::create([
                'nisn' => $s['nisn'],
                'name' => $s['name'],
                'password' => $password,
                'role' => 'student',
                'class' => $s['class'],
                'exp' => $s['exp'],
                'level' => floor(sqrt($s['exp'] / 100)) + 1,
            ]);
        }

        // SUBJECTS
        $subjectsData = [
            ['name' => 'Matematika', 'code' => 'MAT', 'icon' => '📐', 'color' => '#ef4444'],
            ['name' => 'B.Indonesia', 'code' => 'BIN', 'icon' => '📖', 'color' => '#3b82f6'],
            ['name' => 'IPA', 'code' => 'IPA', 'icon' => '🔬', 'color' => '#10b981'],
            ['name' => 'B.Inggris', 'code' => 'ENG', 'icon' => '💬', 'color' => '#8b5cf6'],
            ['name' => 'IPS', 'code' => 'IPS', 'icon' => '🌍', 'color' => '#f59e0b'],
            ['name' => 'Seni Budaya', 'code' => 'SBD', 'icon' => '🎨', 'color' => '#ec4899'],
            ['name' => 'PPKN', 'code' => 'PKN', 'icon' => '🤝', 'color' => '#14b8a6'],
            ['name' => 'Penjaskes', 'code' => 'PJK', 'icon' => '⚽', 'color' => '#f97316'],
            ['name' => 'Agama', 'code' => 'AGM', 'icon' => '🕌', 'color' => '#06b6d4'],
            ['name' => 'Prakarya', 'code' => 'PRK', 'icon' => '✂️', 'color' => '#64748b'],
        ];

        $subjects = [];
        foreach ($subjectsData as $sd) {
            $subjects[$sd['name']] = Subject::create($sd);
        }

        // SCHEDULES FOR ALL 5 CLASSES
        $classes = ['X-MPLB 1', 'X-MPLB 2', 'X-PM 1', 'X-PM 2', 'X-PM 3'];
        $scheduleData = [
            1 => [ // Senin
                ['sub' => 'Matematika', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'B.Indonesia', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'IPA', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            2 => [ // Selasa
                ['sub' => 'B.Inggris', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'IPS', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'Seni Budaya', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            3 => [ // Rabu
                ['sub' => 'Matematika', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'PPKN', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'Penjaskes', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            4 => [ // Kamis
                ['sub' => 'B.Indonesia', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'IPA', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'B.Inggris', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            5 => [ // Jumat
                ['sub' => 'Agama', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'Prakarya', 'start' => '09:15:00', 'end' => '10:45:00'],
            ],
        ];

        foreach ($classes as $c) {
            foreach ($scheduleData as $day => $lessons) {
                foreach ($lessons as $l) {
                    Schedule::create([
                        'day_of_week' => $day,
                        'subject_id' => $subjects[$l['sub']]->id,
                        'class' => $c,
                        'time_start' => $l['start'],
                        'time_end' => $l['end'],
                    ]);
                }
            }
        }

        // PIKET SCHEDULES FOR ALL 5 CLASSES
        foreach ($classes as $classIndex => $c) {
            for ($day = 1; $day <= 5; $day++) {
                $ps = PiketSchedule::create([
                    'day_of_week' => $day,
                    'class' => $c,
                    'group_name' => 'Kelompok ' . chr(65 + (($day - 1) % 4)),
                ]);

                // Assign 3 random students from that class
                $classStudents = collect($studentModels)->where('class', $c);
                if ($classStudents->count() > 0) {
                    $selected = $classStudents->random(min(3, $classStudents->count()));
                    foreach ($selected as $st) {
                        PiketMember::create([
                            'piket_schedule_id' => $ps->id,
                            'user_id' => $st->id,
                        ]);
                    }
                }
            }
        }

        // ADDITIONAL QUESTS
        $quests = [
            ['Bersihkan Lapangan Sekolah', 'medium', 80, 'piket', '🧹'],
            ['Bersosialisasi dengan 3 Orang Baru', 'easy', 40, 'social', '👥'],
            ['Bantu Guru Membawa Buku ke Perpustakaan', 'easy', 35, 'social', '📚'],
            ['Ikut Kegiatan Ekstrakurikuler', 'medium', 70, 'activity', '🏃'],
            ['Rapikan Rak Buku Perpustakaan', 'easy', 45, 'piket', '📚'],
            ['Menjadi Mentor Teman Sebaya', 'hard', 150, 'social', '👨‍🏫'],
            ['Buat Poster Motivasi untuk Kelas', 'medium', 60, 'creative', '🎨'],
            ['Organisir Kegiatan Kebersihan Lingkungan', 'hard', 120, 'piket', '🌱'],
        ];

        foreach ($quests as $q) {
            Quest::create([
                'title' => $q[0],
                'description' => 'Deskripsi untuk quest ' . $q[0],
                'type' => 'additional',
                'category' => $q[3],
                'exp_reward' => $q[2],
                'difficulty' => $q[1],
                'icon' => $q[4],
                'is_active' => true,
            ]);
        }

        // ACHIEVEMENTS
        $achievements = [
            ['First Quest', 'Selesaikan 1 quest', '🎯', 'total_quests', 1, 50],
            ['Speed Runner', 'Selesaikan 5 quest dalam 1 hari', '⚡', 'daily_quests', 5, 100],
            ['On Fire', '7 hari streak beruntun', '🔥', 'streak', 7, 150],
            ['Quest Master', 'Selesaikan total 50 quest', '👑', 'total_quests', 50, 200],
            ['Subject Expert', 'Selesaikan semua main quest dalam seminggu', '🧠', 'subject_expert', 1, 250],
            ['Cleaning Hero', 'Selesaikan 10 quest piket', '✨', 'category_piket', 10, 100],
            ['Social Butterfly', 'Selesaikan 5 quest sosial', '🦋', 'category_social', 5, 100],
            ['Legendary', 'Capai level 10', '🌟', 'level', 10, 500],
        ];

        foreach ($achievements as $a) {
            Achievement::create([
                'name' => $a[0],
                'description' => $a[1],
                'icon' => $a[2],
                'requirement_type' => $a[3],
                'requirement_value' => $a[4],
                'exp_bonus' => $a[5],
            ]);
        }
    }
}
