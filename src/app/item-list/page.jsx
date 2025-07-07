"use client";
import { useEffect, useState } from "react";
import axios from "axios";

function ItemList() {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const opsi = {
    kondisi: ["Baik", "Buruk", "Rusak"],
    kelayakan: ["Layak", "Tidak Layak"],
    status: ["Disimpan", "Dipinjam", "Rusak"],
    penanggung_jawab: [...new Set(items.map(item => item.penanggung_jawab).filter(Boolean))]
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get("/api/items", { headers });
        console.log("API Response:", res.data); // Debug log
        setItems(res.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };
    fetchItems();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    if (!token) return alert("Anda harus login dulu.");
    try {
      await axios.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ Update state setelah delete berhasil
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Gagal menghapus item.");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!token) return alert("Anda harus login dulu.");
    try {
      const dataToSend = { ...editedItem, jumlah_unit: Number(editedItem.jumlah_unit) };
      delete dataToSend._id;

      const res = await axios.put(`/api/items/${editingId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Update response:", res.data); // Debug log
      
      // ✅ Update state setelah edit berhasil
      setItems(prev => prev.map(item => 
        item._id === editingId ? { ...item, ...dataToSend, _id: editingId } : item
      ));
      
      handleCancelEdit();
    } catch (err) {
      console.error("Error updating:", err);
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleChange = (e) => {
    setEditedItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const opsiKategori = ["Semua", ...new Set(items.map(item => item.kategori).filter(Boolean))];
  const filteredItems = selectedKategori === "Semua"
    ? items
    : items.filter(item => item.kategori === selectedKategori);

  // Debug log
  console.log("Filtered items:", filteredItems);
  console.log("Items with _id:", filteredItems.map((item, index) => ({
    index,
    _id: item._id,
    nama_aset: item.nama_aset
  })));

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold text-blue-600">In Stock</h1>
        <div className="space-x-2 flex flex-wrap">
          <button onClick={() => (window.location.href = "/")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Home</button>

          {token && (
            <>
              <button onClick={() => (window.location.href = "new-item")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Stock</button>
              <button onClick={() => { setEditMode((prev) => !prev); setDeleteMode(false); setEditingId(null); }} className={`${editMode ? "bg-yellow-500" : "bg-yellow-400"} text-white px-4 py-2 rounded hover:bg-yellow-600`}>
                {editMode ? "Exit Edit Mode" : "Edit Mode"}
              </button>
              <button onClick={() => { setDeleteMode((prev) => !prev); setEditMode(false); setEditingId(null); }} className={`${deleteMode ? "bg-red-500" : "bg-red-400"} text-white px-4 py-2 rounded hover:bg-red-600`}>
                {deleteMode ? "Exit Delete Mode" : "Delete Mode"}
              </button>
            </>
          )}

          {token ? (
            <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Logout</button>
          ) : (
            <button onClick={() => (window.location.href = "/login")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter Kategori:</label>
        <select value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="border px-2 py-1 rounded">
          {opsiKategori.map((kategori) => (
            <option key={kategori} value={kategori}>{kategori}</option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["Aksi", "Nama Barang", "Kategori", "Lokasi", "Kondisi", "Kelayakan", "Jumlah Unit", "Tahun", "Sumber", "Status", "Keterangan", "Penanggung Jawab", "Gambar"].map((head) => (
                <th key={head} className="py-2 px-4 text-center">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={`desktop-${item._id || index}`}>
                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    {editingId === item._id ? (
                      <>
                        <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Simpan</button>
                        <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Batal</button>
                      </>
                    ) : (
                      <>
                        {editMode && token && (
                          <button onClick={() => handleEditClick(item)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
                        )}
                        {deleteMode && token && (
                          <button onClick={() => handleDelete(item._id)} className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500">Delete</button>
                        )}
                      </>
                    )}
                  </div>
                </td>
                {["nama_aset", "kategori", "lokasi", "kondisi", "kelayakan", "jumlah_unit", "tahun_perolehan", "sumber_perolehan", "status", "keterangan", "penanggung_jawab"].map((field) => (
                  <td key={`${field}-${item._id || index}`} className="py-2 px-4 text-center">
                    {editingId === item._id ? (
                      field === "jumlah_unit" || field === "tahun_perolehan" ? (
                        <input type="number" name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full" />
                      ) : ["kondisi", "kelayakan", "status", "penanggung_jawab"].includes(field) ? (
                        <select name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full">
                          <option value="">-- Pilih --</option>
                          {opsi[field]?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full" />
                      )
                    ) : (
                      item[field]
                    )}
                  </td>
                ))}
                <td className="py-2 px-4 text-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nama_aset}
                      onClick={() => setSelectedImage(item.image)}
                      className="w-full h-40 object-cover rounded mt-2 cursor-pointer hover:scale-105 transition"/>
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredItems.map((item, index) => (
          <div key={`mobile-${item._id || index}`} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold text-lg">{item.nama_aset}</h2>
              <div className="flex gap-2">
                {editingId === item._id ? (
                  <>
                    <button onClick={handleSaveEdit} className="text-sm bg-green-500 text-white px-2 py-1 rounded">Simpan</button>
                    <button onClick={handleCancelEdit} className="text-sm bg-gray-400 text-white px-2 py-1 rounded">Batal</button>
                  </>
                ) : (
                  <>
                    {editMode && token && (
                      <button onClick={() => handleEditClick(item)} className="text-sm bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                    )}
                    {deleteMode && token && (
                      <button onClick={() => handleDelete(item._id)} className="text-sm bg-red-400 text-white px-2 py-1 rounded">Delete</button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="text-sm space-y-1">
              {["kategori", "lokasi", "kondisi", "kelayakan", "jumlah_unit", "tahun_perolehan", "sumber_perolehan", "status", "keterangan", "penanggung_jawab"].map((field) => (
                <div key={`mobile-field-${field}-${item._id || index}`}>
                  <strong>{field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</strong>{" "}
                  {editingId === item._id ? (
                    ["jumlah_unit", "tahun_perolehan"].includes(field) ? (
                      <input
                        type="number"
                        name={field}
                        value={editedItem[field] || ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : ["kondisi", "kelayakan", "status", "penanggung_jawab"].includes(field) ? (
                      <select
                        name={field}
                        value={editedItem[field] || ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="">-- Pilih --</option>
                        {opsi[field]?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={field}
                        value={editedItem[field] || ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    )
                  ) : (
                    item[field]
                  )}
                </div>
              ))}
            </div>

            {item.image && (
              <img
                src={item.image}
                alt={item.nama_aset}
                onClick={() => setSelectedImage(item.image)}
                className="w-full h-32 object-cover rounded mt-2 cursor-pointer hover:scale-105 transition"
              />
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-50"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemList;