import { useContext, useState } from 'react';
import {
    ChevronLeft,
    Menu,
    LayoutDashboard,
    ArchiveRestore,
    ChartPie,
    Bookmark,
    ChevronRight,
    Users,
    HelpCircle
} from 'lucide-react'; // Importing Lucide icons
import { usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { PageProps } from '@/types/index';
import { SidebarContext } from '@/Layouts/AuthenticatedLayout';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const pages = [
    {
        name: 'Dashboard', link: 'dashboard', simbol: LayoutDashboard
    },
    {
        name: 'Input Data', link: 'input-data', simbol: ArchiveRestore
    },
    {
        name: 'Visualization', link: 'visualisasi', simbol: ChartPie
    },
    {
        name: 'Correlation', link: 'korelasi', simbol: Bookmark
    },
    // {
    //     name: 'Panduan', link: 'panduan', simbol: HelpCircle
    // },
];


export default function Sidebar() {
    const { appName, auth } = usePage<PageProps>().props;
    const userRole = auth.user.role;

    const [isOpen, setIsOpen] = useState(false); // For mobile sidebar
    const { isSidebarCollapsed, setIsSidebarCollapsed } = useContext(SidebarContext);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleMinimize = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleDownload = async () => {
        try {
            const fileUrl = `/storage/panduan/system-guide.pdf`;
    
            // Fetch the file as a blob
            const response = await axios.get(fileUrl, { responseType: "blob" });
    
            if (response.status === 200) {
                // Create a temporary link to trigger the download
                const link = document.createElement("a");
                link.href = URL.createObjectURL(response.data);
                link.download = "system-guide.pdf";  // Set correct file name
    
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.error("Failed to download file.");
            }
        } catch (error) {
            console.error("File download failed:", error);
            toast.error("Failed to download template.");
        }
    };

    return (
        <>
            {/* Sidebar toggle button for small screens */}
            <button
                aria-expanded={isOpen ? 'true' : 'false'}
                className="md:hidden fixed top-4 left-4 z-20 text-white bg-gray-800 p-2 rounded-md focus:outline-none transition-transform duration-300 ease-in-out"
                onClick={toggleSidebar}
            >
                <Menu size={24} /> {/* Menu icon for mobile screens */}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed bg-white shadow-md inset-y-0 left-0 transform z-30 transition-transform duration-300 ease-in-out py-6
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static ${isSidebarCollapsed ? 'w-[90px]' : 'w-[240px]'}`}
            >
                <div className={`flex items-center  justify-between`}>
                    <h2 className={`text-lg font-bold capitalize ${isSidebarCollapsed ? 'hidden' : 'block ps-4'}`}>
                        {appName}
                    </h2>

                    {/* Minimize button for desktop */}
                    <button
                        className={` bg-gray-200  focus:outline-none hidden md:block ${isSidebarCollapsed ? 'rounded-full p-2 m-auto' : 'rounded-l-lg px-1 py-2'}`}
                        onClick={toggleMinimize}  // Minimize action for desktop
                    >
                        {isSidebarCollapsed ?
                            <ChevronRight size={24} />
                            :
                            <ChevronLeft size={24} />
                        }
                    </button>
                </div>

                <nav className="mt-8">
                    <ul className="space-y-2 px-4">
                        {pages.map((page) => {
                            const Icon = page.simbol;  // Icon assigned to variable
                            return (
                                <li key={page.link} className="flex items-center">
                                    <NavLink
                                        key={page.link}
                                        href={route(page.link)}
                                        active={route().current(page.link)}
                                        className={`capitalize block px-4 py-2 flex items-center transition-all duration-300 mb-4
                                        ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <Icon className={`${isSidebarCollapsed ? 'mr-0' : 'mr-2'}`} size={20} />
                                        <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                            {page.name}
                                        </span>
                                    </NavLink>
                                </li>
                            );
                        })}

                        <li className="flex items-center">
                            <Button
                                variant="link"
                                onClick={handleDownload}
                                className={`capitalize block px-4 py-2 flex items-center transition-all duration-300 mb-4 text-black
                                        ${isSidebarCollapsed ? 'justify-center' : ''}`}
                            >
                                <HelpCircle className={`${isSidebarCollapsed ? 'mr-0' : 'mr-2'}`} size={20} />
                                <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                    Guide
                                </span>
                            </Button>
                        </li>

                        {userRole == 'super_admin' ?
                            <li className='flex items-center'>
                                <NavLink
                                    href={route('manage-user.index')}
                                    active={route().current('manage-user.index')}
                                    className={`capitalize block px-4 py-2 flex items-center transition-all duration-300 mb-4
                                        ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                >
                                    <Users className={`${isSidebarCollapsed ? 'mr-0' : 'mr-2'}`} size={20} />
                                    <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                        Manage User
                                    </span>
                                </NavLink>
                            </li> :
                            <>

                            </>}
                    </ul>
                </nav>
            </aside>

            {/* Overlay for small screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}
