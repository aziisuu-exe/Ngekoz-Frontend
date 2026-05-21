"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, PlusCircle, Loader2 } from "lucide-react"

export function AddCityButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name")
        }),
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        toast.success("Data Kota berhasil ditambahkan")
      } else {
        const errorData = await res.json()
        toast.error("Gagal menambahkan kota: " + (errorData.message || "Periksa kembali data Anda."))
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Kota</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Kota Baru</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Masukkan nama kota yang ingin ditambahkan.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="city-name" className="text-muted-foreground dark:text-slate-300">Nama Kota</Label>
              <Input id="city-name" name="name" required className="dark:bg-slate-900 dark:border-slate-700" />
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
                "Simpan Kota"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CityActions({ city }: { city: any }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsEditLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/${city.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name")
        }),
      })

      if (res.ok) {
        setIsEditDialogOpen(false)
        router.refresh()
        toast.success("Data Kota berhasil diperbarui")
      } else {
        const errorData = await res.json()
        toast.error("Gagal memperbarui data: " + (errorData.message || ""))
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsEditLoading(false)
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleteLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/${city.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
        toast.success("Data Kota berhasil dihapus")
      } else {
        const errorData = await res.json()
        toast.error("Gagal menghapus kota.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-700 dark:hover:bg-slate-800">
            <Edit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Kota</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Perbarui nama kota.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-city-name" className="text-muted-foreground dark:text-slate-300">Nama Kota</Label>
                <Input id="edit-city-name" name="name" defaultValue={city.name} required className="dark:bg-slate-900 dark:border-slate-700" />
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="h-8 gap-1">
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kota?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              Apakah Anda yakin ingin menghapus kota ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-slate-700 dark:hover:bg-slate-800">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
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

export function AddDistrictButton({ cities }: { cities: any[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          city_id: formData.get("city_id")
        }),
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
        toast.success("Data Kecamatan berhasil ditambahkan")
      } else {
        const errorData = await res.json()
        toast.error("Gagal menambahkan kecamatan.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Kecamatan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Tambah Kecamatan Baru</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Lengkapi data kecamatan di bawah ini.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="district-name" className="text-muted-foreground dark:text-slate-300">Nama Kecamatan</Label>
              <Input id="district-name" name="name" required className="dark:bg-slate-900 dark:border-slate-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city-id" className="text-muted-foreground dark:text-slate-300">Pilih Kota</Label>
              <Select name="city_id" required>
                <SelectTrigger id="city-id" className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectValue placeholder="Pilih Kota" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                    {cities?.length > 0 ? (
                        cities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                        ))
                    ) : (
                        <SelectItem value="0" disabled>Tidak ada data kota</SelectItem>
                    )}
                </SelectContent>
              </Select>
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
                "Simpan Kecamatan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DistrictActions({ district, cities }: { district: any, cities: any[] }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsEditLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts/${district.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          city_id: formData.get("city_id")
        }),
      })

      if (res.ok) {
        setIsEditDialogOpen(false)
        router.refresh()
        toast.success("Data Kecamatan berhasil diperbarui")
      } else {
        const errorData = await res.json()
        toast.error("Gagal memperbarui data.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsEditLoading(false)
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleteLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts/${district.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
        toast.success("Data Kecamatan berhasil dihapus")
      } else {
        const errorData = await res.json()
        toast.error("Gagal menghapus kecamatan.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 dark:border-slate-700 dark:hover:bg-slate-800">
            <Edit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Kecamatan</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Perbarui data kecamatan.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-district-name" className="text-muted-foreground dark:text-slate-300">Nama Kecamatan</Label>
                <Input id="edit-district-name" name="name" defaultValue={district.name} required className="dark:bg-slate-900 dark:border-slate-700" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-city-id" className="text-muted-foreground dark:text-slate-300">Pilih Kota</Label>
                <Select name="city_id" defaultValue={district.city_id?.toString()}>
                  <SelectTrigger id="edit-city-id" className="dark:bg-slate-900 dark:border-slate-700">
                    <SelectValue placeholder="Pilih Kota" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="h-8 gap-1">
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kecamatan?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              Apakah Anda yakin ingin menghapus kecamatan ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-slate-700 dark:hover:bg-slate-800">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
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