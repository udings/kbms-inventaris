import { useNavigate } from "react-router-dom";

function ItemDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Ini Halaman Detail Barang</h1>
        <button
          onClick={() => navigate("/")}
          className="w-40 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}

export default ItemDetail;
