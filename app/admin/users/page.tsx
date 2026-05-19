import { Search, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";
import { AddUserButton, UserActions } from "@/components/UserActions";
import Link from "next/link";
import { Metadata } from 'next';

// Memanggil Komponen Shadcn UI yang baru saja kamu install
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: 'User Management | Ngekoz Admin',
};

// Fungsi fetch ke Backend Laravel
async function getUsers(page: number, query: string) {
  const params = new URLSearchParams({ page: page.toString() });
  if (query) params.append("search", query);
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?${params.toString()}`, { 
      cache: "no-store" 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gagal fetch API:", error);
    return null;
  }
}

// Fungsi bantu untuk format tanggal (Contoh: 30 Apr 2026)
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

export default async function UserManagementPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const response = await getUsers(currentPage, query);
  
  const data = response?.data?.data || response?.data || []; 
  const pagination = response?.data?.data ? response.data : {};
  const totalUsers = pagination.total || data.length || 0;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < (pagination.last_page || 1) ? currentPage + 1 : null;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola daftar pengguna, pencarian, dan hak akses.
          </p>
        </div>
        {/* Komponen Tombol dari UserActions.tsx milikmu */}
        <AddUserButton />
      </div>

      {/* CARD BUNGKUSAN UTAMA (Sesuai Desain Shadcn) */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
        
        {/* FILTER & SEARCH BAR */}
        <div className="flex items-center justify-between p-4 border-b gap-4 flex-wrap">
          <form method="GET" action="/admin/users" className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {/* Menggunakan Shadcn Input */}
            <Input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Cari nama atau email lalu tekan Enter..."
              className="pl-9 h-10 w-full bg-background border-input"
            />
          </form>
          <div className="text-sm text-muted-foreground font-medium px-2">
            Total: <span className="text-foreground">{totalUsers}</span> Pengguna
          </div>
        </div>

        {/* TABLE SECTION (Menggunakan Shadcn Table) */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[280px]">PENGGUNA</TableHead>
                <TableHead>BIO</TableHead>
                <TableHead>TELEPON</TableHead>
                <TableHead className="text-center">ROLE</TableHead>
                <TableHead>BERGABUNG</TableHead>
                <TableHead className="text-right">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {(!data || data.length === 0) ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                   Tidak ada data pengguna ditemukan.
                 </TableCell>
               </TableRow>
             ) : (
               data.map((item: any) => {
                 const displayName = item.full_name || item.name || "Anonim";
                 
                 return (
                   <TableRow key={item.id} className="group">
                     
                     {/* KOLOM PENGGUNA (AVATAR + NAMA + EMAIL) */}
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10 border shadow-xs">
                           <AvatarImage src={item.profile_picture || ""} alt={displayName} />
                           <AvatarFallback className="bg-muted text-muted-foreground">
                             <UserCircle className="h-6 w-6" />
                           </AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col">
                           <span className="font-semibold text-foreground">{displayName}</span>
                           <span className="text-xs text-muted-foreground">{item.email || item.username}</span>
                         </div>
                       </div>
                     </TableCell>

                     {/* KOLOM BIO */}
                     <TableCell className="text-muted-foreground">
                       <div className="max-w-[200px] truncate" title={item.bio || "-"}>
                         {item.bio || "-"}
                       </div>
                     </TableCell>

                     {/* KOLOM TELEPON */}
                     <TableCell className="text-muted-foreground">
                       {item.phone_number || "-"}
                     </TableCell>

                     {/* KOLOM ROLE DENGAN SHADCN BADGE */}
                     <TableCell className="text-center">
                       <Badge 
                         variant={item.role === 'admin' ? 'default' : item.role === 'owner' ? 'secondary' : 'outline'}
                         className={`font-semibold uppercase tracking-wider text-[10px] ${
                           item.role === 'owner' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 border-transparent' : 
                           item.role === 'user' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border-transparent' : 
                           ''
                         }`}
                       >
                         {item.role || 'user'}
                       </Badge>
                     </TableCell>
                     
                     {/* KOLOM BERGABUNG */}
                     <TableCell className="text-muted-foreground">
                        {formatDate(item.created_at)}
                     </TableCell>

                     {/* KOLOM AKSI (EDIT & DELETE) */}
                     <TableCell className="text-right">
                        <UserActions user={item} />
                     </TableCell>
                   </TableRow>
                 );
               })
             )}
           </TableBody>
          </Table>
        </div>

        {/* PAGINATION FOOTER */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-3">
            <div className="text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{pagination.from || 0}</span> - <span className="font-medium text-foreground">{pagination.to || 0}</span> dari <span className="font-medium text-foreground">{pagination.total || 0}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                href={prevPage ? `/admin/users?page=${prevPage}${query ? `&query=${query}` : ''}` : '#'}
                className={`inline-flex items-center justify-center p-2 rounded-md border text-sm font-medium transition-colors ${
                  prevPage ? "bg-background text-foreground hover:bg-muted" : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none opacity-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <Link 
                href={nextPage ? `/admin/users?page=${nextPage}${query ? `&query=${query}` : ''}` : '#'}
                className={`inline-flex items-center justify-center p-2 rounded-md border text-sm font-medium transition-colors ${
                  nextPage ? "bg-background text-foreground hover:bg-muted" : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none opacity-50"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}