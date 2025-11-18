'use client'
import Menu from "@/app/components/menu/Menu"; // Adjust the import path as needed
import {connectdb} from "@/dbconfig/dbconfig";
import {useEffect} from "react";

export default function AppLayout({ children }) {
    return (
        <div>
            <Menu />
            {children}
        </div>
    )
}
