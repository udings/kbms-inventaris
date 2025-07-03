function NotAuthorized() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">403 - Akses Ditolak</h1>
      <p className="mt-2">Anda tidak memiliki hak akses untuk halaman ini.</p>
    </div>
  );
}

export default NotAuthorized;
