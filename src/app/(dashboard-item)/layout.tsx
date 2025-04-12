import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <Sidebar />
            </div>
            <div className="flex-grow p-0 md:overflow-y-auto md:p-0">
                <Header />
                {children}
                <Footer />
            </div>
        </div>

    </section>

}