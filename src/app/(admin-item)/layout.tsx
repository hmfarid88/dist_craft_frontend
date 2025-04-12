import Navbar from "./admin-components/Navbar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <div className="flex min-h-screen  md:flex-row md:overflow-hidden">
            <div className="flex-grow p-0 md:overflow-y-auto md:p-0">
                <Navbar />
                {children}
            </div>
        </div>

    </section>

}