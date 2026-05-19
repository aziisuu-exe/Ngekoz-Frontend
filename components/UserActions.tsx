"use client";

import { useState } from "react";
import { Edit2, Trash2, X, Loader2, AlertTriangle, UserPlus, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name?: string;
  full_name?: string;
  username?: string;
  email: string;
  role: string;
}

// ----------------- KOMPONEN ACTION (EDIT & HAPUS) -----------------
export function UserActions({ user }: { user: UserData }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mengambil name atau full_name tergantung format database kamu
  const displayName = user.full_name || user.name || "";

  const [formData, setFormData] = useState({
    name: displayName,
    email: user.email,
    role: user.role || "user",
    password: "", // Dikosongkan, hanya diisi jika ingin ganti password
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

  const { password, ...restData } = formData;
  const payload = password ? formData : restData;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Gagal: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        setIsDeleteOpen(false);
        router.refresh();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditOpen(true)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit User">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus User">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* MODAL EDIT */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
              <button onClick={() => setIsEditOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Nama Lengkap *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Role *</label>
                <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:border-slate-900">
                  <option value="user">User Biasa</option>
                  <option value="owner">Owner Kos</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Kosongkan jika tidak ingin diubah" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-70">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isLoading && setIsDeleteOpen(false)}></div>
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 border-4 border-white shadow-sm ring-1 ring-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Hapus User?</h3>
            <p className="mb-6 text-sm text-slate-500">Yakin menghapus <strong className="text-slate-700">{displayName}</strong>? Data ini tidak dapat dikembalikan.</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setIsDeleteOpen(false)} disabled={isLoading} className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Batal</button>
              <button onClick={handleDelete} disabled={isLoading} className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-70">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ----------------- KOMPONEN TAMBAH USER -----------------
export function AddUserButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsOpen(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Gagal: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 shadow-sm">
        <UserPlus className="h-4 w-4" /> Tambah User
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Tambah Akun Baru</h3>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Nama Lengkap *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jhon Doe" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="jhondoe@email.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Role *</label>
                <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:border-slate-900">
                  <option value="user">User Biasa</option>
                  <option value="owner">Owner Kos</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-slate-900" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-70">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}