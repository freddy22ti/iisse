import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { BiSolidDoughnutChart } from "react-icons/bi";
import { PageProps } from '@/types/index';

export default function Guest({ children }: PropsWithChildren) {
    const { appName } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white ">
            <div className="w-full flex flex-col px-24 py-12">
                <h1 className='text-3xl font-medium'>{appName}</h1>
                {/* form input */}
                <div className="sm:max-w-md h-full flex items-center justify-center">
                    <div className="w-full">
                        {children}
                    </div>
                </div>

            </div>

            <div className='hidden md:block w-full bg-primary'>
                <div className="h-full flex items-center justify-center flex-col">
                    <div className="relative flex flex-col items-center justify-center rounded-lg w-[300px] h-[300px] bg-[#416082] p-4 mb-10">
                        <div className="absolute top-0 p-4 w-full flex justify-between text-white">
                            <div className='font-bold'>
                                Analytics
                            </div>
                            <div className='flex'>
                                Month
                                <ChevronDown />
                            </div>
                        </div>
                        <BiSolidDoughnutChart color='white' size={160} />
                    </div>
                    <div className='text-white font-bold text-3xl text-center mb-5'>
                        The perfect analytics
                        <br />tools
                    </div>
                </div>
            </div>
        </div>
    );
}
