"use client"; // Tambahkan ini karena pakai useRouter

import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/background.jpg')` }} // pastikan file ini ada di /public
    >
      <div className="flex flex-col items-center gap-4 bg-white bg-opacity-80 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Ini Tampilan Utama</h1>
        
        <button
          onClick={() => router.push("/item-list")}
          className="w-32 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Aset KBMS
        </button>

        <button
          onClick={() => handleExternalLink("https://linktr.ee/kbms_diaspora2025")}
          className="w-32 h-10 bg-indigo-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Linktree KBMS
        </button>
      </div>
    </div>
  );
}

export default Home;
