import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { AddUserButton } from '@/Components/button/AddUserButton'
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { Input } from "@/Components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet"
import { toast } from 'sonner';
import axios from 'axios';

import { User } from '@/types/index';
import { string } from 'zod';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"


export default function ManageUser({ users: initialUsers }: { users: any[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const columns: ColumnDef<User>[] = [
        {
            header: "Name",
            cell: ({ row }) => {
                const firstName = row.original.first_name ?? ""; // check for null or undefined
                const lastName = row.original.last_name ?? "";   // check for null or undefined
                return `${firstName} ${lastName}`;
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            header: "Action",
            cell: ({ row }) =>
                <div className='space-x-4'>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="bg-green-400 hover:bg-green-500">Detail</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Data User</SheetTitle>
                                <div className="">

                                    <div className="flex items-center justify-center my-5">
                                        <Avatar className='size-24'>
                                            <AvatarImage src={row.original.profile_picture} />
                                            <AvatarFallback />
                                        </Avatar>

                                    </div>
                                    {/* info user */}
                                    <div className="space-y-4">
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                First Name:
                                            </h2>
                                            <p>
                                                {row.original.first_name || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Last Name:
                                            </h2>
                                            <p>
                                                {row.original.last_name || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Email:
                                            </h2>
                                            <p>
                                                {row.original.email || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Phone Number:
                                            </h2>
                                            <p>
                                                {row.original.phone_number || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Country:
                                            </h2>
                                            <p>
                                                {row.original.country || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                City:
                                            </h2>
                                            <p>
                                                {row.original.city || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Address
                                            </h2>
                                            <p>
                                                {row.original.address || '-'}
                                            </p>
                                        </div>
                                        <div className="">
                                            <h2 className='text-lg font-bold'>
                                                Postal Code:
                                            </h2>
                                            <p>
                                                {row.original.postal_code || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* end info user */}
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this account
                                    from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className='bg-red-500 text-white hover:bg-red-700'
                                    onClick={() => handleDelete((row.original.id).toString())}>
                                    Delete Forever
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div >
        },
    ]

    const table = useReactTable({
        data: users, // Corrected 'users' to 'data'
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(
                route('manage-user.delete', id),
            )

            if (response.status === 200) {
                setUsers((prevUsers) => prevUsers.filter(user => user.id.toString() !== id));
                toast.success('User deleted successfully');
            }
        } catch {
            toast.error("Failed to delete user!")
        }
    };

    const handleAddUser = (newUser: User) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-5 flex">
                        <div className="ms-auto">
                            <AddUserButton onUserAdded={handleAddUser} />
                        </div>
                    </div>
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filter emails..."
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        {/* table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id} className='text-center'>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className='text-center'>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* end table */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
