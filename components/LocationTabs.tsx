"use client"

import { useState } from "react"
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { AddCityButton, CityActions, AddDistrictButton, DistrictActions } from "@/components/LocationActions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const formatDate = (dateString: string) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function LocationTabs({ cities, districts }: { cities: any[], districts: any[] }) {
  // 1. State Pencarian
  const [citySearch, setCitySearch] = useState("")
  const [districtSearch, setDistrictSearch] = useState("")

  // 2. State Pagination
  const [cityPage, setCityPage] = useState(1)
  const [districtPage, setDistrictPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // --- LOGIKA FILTERING ---
  const filteredCities = cities?.filter(city => 
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  ) || []
  
  const filteredDistricts = districts?.filter(district => 
    district.name.toLowerCase().includes(districtSearch.toLowerCase()) || 
    (district.city?.name && district.city.name.toLowerCase().includes(districtSearch.toLowerCase()))
  ) || []

  // --- LOGIKA PAGINATION ---
  const totalCityPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE)
  const paginatedCities = filteredCities.slice((cityPage - 1) * ITEMS_PER_PAGE, cityPage * ITEMS_PER_PAGE)

  const totalDistrictPages = Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE)
  const paginatedDistricts = filteredDistricts.slice((districtPage - 1) * ITEMS_PER_PAGE, districtPage * ITEMS_PER_PAGE)

  // Fungsi saat mengetik di search bar (Otomatis kembali ke halaman 1)
  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitySearch(e.target.value)
    setCityPage(1)
  }

  const handleDistrictSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistrictSearch(e.target.value)
    setDistrictPage(1)
  }

  return (
    <Tabs defaultValue="cities" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
        <TabsTrigger value="cities">Kota</TabsTrigger>
        <TabsTrigger value="districts">Kecamatan</TabsTrigger>
      </TabsList>

      {/* ======================= TAB KOTA ======================= */}
      <TabsContent value="cities">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
          
          {/* Header Action */}
          <div className="flex items-center justify-between p-4 border-b gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama kota..."
                value={citySearch}
                onChange={handleCitySearch}
                className="pl-9 h-10 w-full bg-background border-input"
              />
            </div>
            <AddCityButton />
          </div>

          {/* Tabel Kota */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px] pl-4">NO</TableHead>
                  <TableHead>NAMA KOTA</TableHead>
                  <TableHead className="w-[200px]">DITAMBAHKAN PADA</TableHead>
                  <TableHead className="w-[120px] text-center">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {paginatedCities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {citySearch ? "Kota tidak ditemukan." : "Tidak ada data kota."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCities.map((city: any, index: number) => (
                  <TableRow key={city.id} className="group">
                    <TableCell className="pl-4 font-medium">
                      {/* Rumus nomor urut agar tidak reset di setiap halaman */}
                      {(cityPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 max-w-[150px] sm:max-w-[250px]">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-foreground">{city.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDate(city.created_at)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <CityActions city={city} />
                    </TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Pagination Kota */}
          {filteredCities.length > 0 && (
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium text-foreground">{(cityPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-medium text-foreground">{Math.min(cityPage * ITEMS_PER_PAGE, filteredCities.length)}</span> dari <span className="font-medium text-foreground">{filteredCities.length}</span> data
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCityPage(p => Math.max(1, p - 1))}
                  disabled={cityPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCityPage(p => Math.min(totalCityPages, p + 1))}
                  disabled={cityPage === totalCityPages || totalCityPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      {/* ======================= TAB KECAMATAN ======================= */}
      <TabsContent value="districts">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
          
          {/* Header Action */}
          <div className="flex items-center justify-between p-4 border-b gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari kecamatan atau kota..."
                value={districtSearch}
                onChange={handleDistrictSearch}
                className="pl-9 h-10 w-full bg-background border-input"
              />
            </div>
            <AddDistrictButton cities={cities} />
          </div>

          {/* Tabel Kecamatan */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px] pl-4">NO</TableHead>
                  <TableHead>NAMA KECAMATAN</TableHead>
                  <TableHead className="w-[200px]">KOTA</TableHead>
                  <TableHead className="w-[200px]">DITAMBAHKAN PADA</TableHead>
                  <TableHead className="w-[120px] text-center">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {paginatedDistricts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {districtSearch ? "Kecamatan tidak ditemukan." : "Tidak ada data kecamatan."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDistricts.map((district: any, index: number) => (
                  <TableRow key={district.id} className="group">
                    <TableCell className="pl-4 font-medium">
                      {/* Rumus nomor urut agar tidak reset di setiap halaman */}
                      {(districtPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 max-w-[150px] sm:max-w-[200px]">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-foreground truncate">{district.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[120px] sm:max-w-[180px] truncate">
                      {district.city?.name || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDate(district.created_at)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <DistrictActions district={district} cities={cities} />
                    </TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Pagination Kecamatan */}
          {filteredDistricts.length > 0 && (
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium text-foreground">{(districtPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-medium text-foreground">{Math.min(districtPage * ITEMS_PER_PAGE, filteredDistricts.length)}</span> dari <span className="font-medium text-foreground">{filteredDistricts.length}</span> data
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDistrictPage(p => Math.max(1, p - 1))}
                  disabled={districtPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDistrictPage(p => Math.min(totalDistrictPages, p + 1))}
                  disabled={districtPage === totalDistrictPages || totalDistrictPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}