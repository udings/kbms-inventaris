"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function NewItem() {
  const [nama_aset, setNamaAset] = useState("");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("Disimpan");
  const [kondisi, setKondisi] = useState("Baik");
  const [kelayakan, setKelayakan] = useState("Layak");
  const [tahun_perolehan, setTahunPerolehan] = useState("");
  const [sumber_perolehan, setSumberPerolehan] = useState("");
  const [jumlah_unit, setJumlahUnit] = useState(1);
  const [penanggung_jawab, setPenanggungJawab] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const router = useRouter();



  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const fetchUserRole = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const role = res.data.user?.role;
      if (role) {
      localStorage.setItem("role", role);
      } else {
        console.warn("Role tidak ditemukan dari /api/auth/me");
        alert("Gagal mendapatkan role. Silakan login ulang.");
        router.push("/login");
      }


      if (role !== "developer") {
        alert("Anda tidak memiliki akses untuk menambahkan item.");
        router.push("/not-authorized");
      }
    } catch (err) {
      console.error("Gagal ambil data user:", err);
      router.push("/login");
    }
  };

  fetchUserRole();
}, [router]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "unsigned_preset"); // Ganti sesuai preset Cloudinary Anda

      try {
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dptgahuw9/image/upload",
          data
        );
        imageUrl = cloudinaryRes.data.secure_url;
      } catch (err) {
        console.error("Gagal upload gambar:", err);
        alert("Gagal upload gambar.");
        return;
      }
    }

    if (!nama_aset || !kategori || !lokasi || !tahun_perolehan || !penanggung_jawab) {
      alert("Mohon lengkapi semua data wajib.");
      return;
    }

    const payload = {
      nama_aset,
      kategori,
      lokasi,
      status,
      kondisi,
      kelayakan,
      tahun_perolehan: parseInt(tahun_perolehan, 10),
      sumber_perolehan,
      jumlah_unit: parseInt(jumlah_unit, 10),
      penanggung_jawab,
      keterangan,
      image: imageUrl,
    };

    try {
      const token = localStorage.getItem("token");

await axios.post("/api/items", payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});


      alert("Item berhasil ditambahkan.");
      router.push("/item-list");
    } catch (error) {
      console.error("Gagal menambahkan item:", error);
      if (error.response) {
        alert(`Gagal menambahkan item: ${error.response.data.message || 'Kesalahan server'}`);
      } else {
        alert("Terjadi kesalahan saat mengirim data.");
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Tambah Data Aset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Nama Aset *</label>
          <input type="text" value={nama_aset} onChange={(e) => setNamaAset(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
  <label className="block text-sm font-medium">Kategori *</label>
  <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full border p-2 rounded">
    <option value="">-- Pilih Kategori --</option>
    <option value="Kostum & Aksesoris">Kostum & Aksesoris</option>
    <option value="Alat Musik Tradisional">Alat Musik Tradisional</option>
    <option value="Properti Pertunjukkan">Properti Pertunjukkan</option>
    <option value="Peralatan Elektronik">Peralatan Elektronik</option>
    <option value="Perlengkapan Panggung & Dekorasi">Perlengkapan Panggung & Dekorasi</option>
    <option value="Dokumentasi & Arsip">Dokumentasi & Arsip</option>
    <option value="Peralatan Latihan">Peralatan Latihan</option>
    <option value="Peralatan Administrasi">Peralatan Administrasi</option>
    <option value="Peralatan Kerajinan & Seni Rupa">Peralatan Kerajinan & Seni Rupa</option>
    <option value="Alat Games">Alat Games</option>
  </select>
</div>


        <div>
          <label className="block text-sm font-medium">Lokasi *</label>
          <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 rounded">
            <option value="Digunakan">Digunakan</option>
            <option value="Disimpan">Disimpan</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Hilang">Hilang</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Kondisi</label>
          <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} className="w-full border p-2 rounded">
            <option value="Baik">Baik</option>
            <option value="Buruk">Buruk</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Kelayakan</label>
          <select value={kelayakan} onChange={(e) => setKelayakan(e.target.value)} className="w-full border p-2 rounded">
            <option value="Layak">Layak</option>
            <option value="Tidak Layak">Tidak Layak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tahun Perolehan *</label>
          <input type="number" value={tahun_perolehan} onChange={(e) => setTahunPerolehan(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Sumber Perolehan</label>
          <input type="text" value={sumber_perolehan} onChange={(e) => setSumberPerolehan(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Jumlah Unit</label>
          <input type="number" value={jumlah_unit} min="1" onChange={(e) => setJumlahUnit(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Penanggung Jawab *</label>
          <input type="text" value={penanggung_jawab} onChange={(e) => setPenanggungJawab(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Keterangan</label>
          <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Gambar</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Tambah Item
        </button>
      </form>
    </div>
  );
}

export default NewItem;
