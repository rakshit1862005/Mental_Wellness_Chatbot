import Menu from "@/app/components/menu/Menu"; // Adjust the import path as needed

export default function AppLayout({ children }) {
    return (
        <div>
            <Menu />
            {children}
        </div>
    )
}
