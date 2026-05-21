import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LocationTabs } from "@/components/LocationTabs" // Mengimpor komponen dari langkah 1

export const metadata = {
  title: 'Location Data | Ngekoz Admin',
}

async function getCities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, { cache: "no-store" })
    if (!res.ok) return []
    const json = await res.json()
    // Pastikan menangkap dari array yang tepat (menghindari error paginate)
    return json.data?.data || json.data || []
  } catch (error) {
    return []
  }
}

async function getDistricts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts`, { cache: "no-store" })
    if (!res.ok) return []
    const json = await res.json()
    // Pastikan menangkap dari array yang tepat (menghindari error paginate)
    return json.data?.data || json.data || []
  } catch (error) {
    return []
  }
}

export default async function LocationDataPage() {
  const cities = await getCities()
  const districts = await getDistricts()

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6 w-full animate-in fade-in duration-500">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Location Data</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kelola data Kota dan Kecamatan.
                  </p>
                </div>
              </div>

              {/* Memanggil Komponen yang memuat Search, Tabs, dan Tabel */}
              <LocationTabs cities={cities} districts={districts} />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}