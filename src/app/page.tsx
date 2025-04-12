import { FcHeatMap } from "react-icons/fc";
import Login from "./components/Login";

const page = () => {
    return (
        <div className='container-2xl'>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center h-screen p-5">
                <div className="flex items-center justify-center bg-base-100">
                    <div>
                        <FcHeatMap size={50} className='bnt btn-ghost rounded-md border border-cyan-500' /><span className='text-3xl font-extrabold font-sans'>BILLING</span> <span className='text-3xl font-extrabold text-accent font-sans'>CRAFT</span>
                        <p className='text-xs tracking-widest font-bold text-pretty'>SIMPLIFY YOUR BUSINESS</p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="card  max-w-sm w-full shadow-lg shadow-slate-700 bg-base-100">
                        <div className="card-title justify-center font-extrabold pt-5">LOG IN</div>
                        <div className="card-body">
                            <Login />
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )

}

export default page
