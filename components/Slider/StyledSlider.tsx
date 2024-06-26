"use client";
import Image from "next/image"
import Link from "next/link"
import React from 'react'

import {
XCircle
} from "lucide-react"

// import { usePathname } from "next/navigation";
import RoutingAutocomplete from "../Autocomplete/RoutingAutocomplete";

function StyledSlider({setRouting}: {setRouting: any}) {

return (
    <div className="flex min-h-screen w-full flex-col bg-muted/50">
        <aside className={`fixed rounded-r-sm inset-y-0 left-0 z-10 hidden flex-col border-r bg-white p-2 sm:flex transition-all duration-500 ease-in-out w-[350px]`}>
            <nav className="flex h-full w-full flex-col px-5">
                <div >
                        <>
                            <div className="flex w-full justify-end py-3" > <span className="mx-auto my-auto text-xl h-8 ">Routing</span>  <XCircle className="h-8 w-4 my-auto ml-14 text-red-500" onClick={() => setRouting(false)} /> </div>
                            <hr />

                        </>
                </div>
                
                <div className="my-3">
                    <label htmlFor="dropdown-example" className="block text-sm font-medium text-gray-700">
                        Start
                    </label>
                    <RoutingAutocomplete uniqueId={"start"}/>
                </div>
                <div className="my-3">
                    <label htmlFor="dropdown-example" className="block text-sm font-medium text-gray-700">
                        End
                    </label>
                    <RoutingAutocomplete uniqueId={"end"}/>
                </div>
                <div className="my-3">
                    <label htmlFor="dropdown-example" className="block text-sm font-medium text-gray-700">
                        Select Route Type
                    </label>
                    <select id="dropdown-example" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option>OSRM</option>
                        <option> GraphHopper</option>
                        <option> Valhalla</option>
                    </select>
                </div>
            </nav>
            
        </aside>

    </div>

)
}
export default StyledSlider