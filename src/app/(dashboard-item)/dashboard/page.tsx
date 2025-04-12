"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import Linechart from "@/app/components/Linechart";
import HomeSummary from "../../components/HomeSummary";

export default function Home() {

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row  gap-5 p-4 items-center justify-center">
          <HomeSummary />
        </div>
        <div className="flex flex-col md:flex-row  gap-5 p-5">
          <div className="flex flex-col items-center justify-center">
            <div className="p-5 uppercase text-sm font-semibold"><h4>Current Month Sales Progress</h4></div>
            <div>
              <Areachart />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="p-5 uppercase text-sm font-semibold"><h4>Last Six Month Sales Analysis</h4></div>
            <div><Barchart /></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="p-5 uppercase text-sm font-semibold"><h4>Last 12 Month Profit-Loss Analysis</h4></div>
          <div><Linechart /></div>
        </div>
      </div>
    </main>
  );
}
