"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

// --- KOMPONEN TAMBAH USER ---
export function AddUserButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        toast.success("Pengguna berhasil ditambahkan")
      } else {
        const errorData = await res.json()
        alert("Gagal menambahkan user: " + (errorData.message || "Cek kembali data Anda."))
      }
    } catch (error) {
      console.error("Fetch error:", error)
      alert("Terjadi kesalahan jaringan atau server tidak merespon.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Tambah User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Pengguna Baru</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Lengkapi data pengguna baru di bawah ini.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-username" className="text-muted-foreground dark:text-slate-300">Username *</Label>
              <Input id="new-username" name="username" placeholder="johndoe" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-fullname" className="text-muted-foreground dark:text-slate-300">Full Name *</Label>
              <Input id="new-fullname" name="full_name" placeholder="John Doe" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-email" className="text-muted-foreground dark:text-slate-300">Email *</Label>
              <Input id="new-email" name="email" type="email" placeholder="john@example.com" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-phone" className="text-muted-foreground dark:text-slate-300">Phone Number *</Label>
              <Input id="new-phone" name="phone_number" type="tel" placeholder="081234567890" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password" className="text-muted-foreground dark:text-slate-300">Password *</Label>
              <Input id="new-password" name="password" type="password" placeholder="••••••••" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-role" className="text-muted-foreground dark:text-slate-300">Role</Label>
              <Select name="role" defaultValue="user">
                <SelectTrigger id="new-role" className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="new-bio" className="text-muted-foreground dark:text-slate-300">Bio</Label>
              <Input id="new-bio" name="bio" placeholder="Deskripsi singkat..." className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="new-avatar" className="text-muted-foreground dark:text-slate-300">Profile Picture</Label>
              <Input id="new-avatar" name="profile_picture" type="file" accept="image/*" className="dark:bg-slate-900 dark:border-slate-700 cursor-pointer text-muted-foreground file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-muted/80" />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengguna"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- KOMPONEN AKSI EDIT & HAPUS USER ---
export function UserActions({ user }: { user: any }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const displayName = user.full_name || user.name || "Pengguna"

  // 1. Fungsi Handler Edit User (PUT via POST Spoofing)
  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsEditLoading(true)

    const formData = new FormData(e.currentTarget)
    // Trik Laravel Multipart: Sisipkan _method PUT karena browser tidak mendukung PUT murni dengan file upload
    formData.append("_method", "PUT")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "POST", // Tetap POST, dibaca PUT oleh Laravel berkat _method
        body: formData,
      })

      if (res.ok) {
        setIsEditDialogOpen(false)
        router.refresh() 
        toast.success("Data pengguna berhasil diperbarui")
      } else {
        const errorData = await res.json()
        alert("Gagal memperbarui data: " + (errorData.message || "Periksa kembali input Anda."))
      }
    } catch (error) {
      console.error("Edit fetch error:", error)
      alert("Terjadi kesalahan koneksi saat memperbarui data.")
    } finally {
      setIsEditLoading(false)
    }
  }

  // 2. Fungsi Handler Hapus User (DELETE)
  async function handleDeleteConfirm() {
    setIsDeleteLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
        toast.success("Pengguna berhasil dihapus")
      } else {
        const errorData = await res.json()
        alert("Gagal menghapus user: " + (errorData.message || "Izin ditolak."))
      }
    } catch (error) {
      console.error("Delete fetch error:", error)
      alert("Terjadi kesalahan koneksi saat menghapus data.")
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      
      {/* --- FORM EDIT USER --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-700 dark:hover:bg-slate-800">
            <Edit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Pengguna</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Perbarui informasi {displayName}. Kosongkan password jika tidak ingin mengubahnya.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username" className="text-muted-foreground dark:text-slate-300">Username</Label>
                <Input id="edit-username" name="username" defaultValue={user.username || ""} className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fullname" className="text-muted-foreground dark:text-slate-300">Full Name</Label>
                <Input id="edit-fullname" name="full_name" defaultValue={user.full_name || ""} className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-muted-foreground dark:text-slate-300">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={user.email || ""} className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone" className="text-muted-foreground dark:text-slate-300">Phone Number</Label>
                <Input id="edit-phone" name="phone_number" type="tel" defaultValue={user.phone_number || ""} className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password" className="text-muted-foreground dark:text-slate-300">Password Baru</Label>
                <Input id="edit-password" name="password" type="password" placeholder="Biarkan kosong jika tidak diubah" className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-muted-foreground dark:text-slate-300">Role</Label>
                <Select name="role" defaultValue={user.role || "user"}>
                  <SelectTrigger id="edit-role" className="dark:bg-slate-900 dark:border-slate-700">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="edit-bio" className="text-muted-foreground dark:text-slate-300">Bio</Label>
                <Input id="edit-bio" name="bio" defaultValue={user.bio || ""} className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="edit-avatar" className="text-muted-foreground dark:text-slate-300">Ganti Profile Picture</Label>
                <Input id="edit-avatar" name="profile_picture" type="file" accept="image/*" className="dark:bg-slate-900 dark:border-slate-700 cursor-pointer text-muted-foreground file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-muted/80" />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isEditLoading} className="w-full sm:w-auto">
                {isEditLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memperbarui...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG HAPUS USER --- */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="h-8 gap-1">
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {displayName}?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini permanen dan tidak dapat dibatalkan. Data pengguna akan hilang dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-slate-700 dark:hover:bg-slate-800">Batal</AlertDialogCancel>
            {/* Mengikat aksi konfirmasi hapus dengan fungsi handleDeleteConfirm */}
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isDeleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleteLoading ? "Menghapus..." : "Hapus Permanen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}