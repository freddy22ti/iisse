import { FormEventHandler, useState } from "react"
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { FileDown, ChevronDownIcon } from 'lucide-react';
import { InputFileHolder } from "./InputFileHolder";
import { TableSelector } from "@/Components/selectors/TableSelector";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ADDITIONAL_TABLE, TABLE_WITHOUT_YEAR } from "@/const";
import axios from "axios";


export const AddTemplateButton = (
    {
        listTables
    }: {
        listTables: string[]
    }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, reset } = useForm({
        table_name: '',
        file: null as File | null,
    })

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!data.table_name || !data.file) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (data.file.type !== "text/csv") {
            toast.error("Please upload a valid CSV file.");
            return;
        }

        setLoading(true);

        try {
            const table = data.table_name === 'kuisioner' ? 'ekonomi' : data.table_name;

            const formData = new FormData();
            formData.append('table_name', table);
            formData.append('file', data.file);

            const response = await axios.post(route('input-data.upload-template'), formData);

            if (response.status === 201) {
                const responseMessage = response.data?.message || 'File uploaded successfully.'
                toast.success(responseMessage)
                reset();
                setOpen(false);
            } else {
                toast.error('An error occurred while uploading.');
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    const handleDialogClose = (open: boolean) => {
        if (!loading) {
            setOpen(open);
            setData('file', null)
        }
    };


    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white">
                    <FileDown className='me-2' size={18} />
                    <span>Add CSV Template</span>
                    <ChevronDownIcon className='ms-2' />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">
                        Add CSV Templates
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mb-5 flex">
                        <div className="ms-auto">
                            <TableSelector
                                onSelectChange={(value) => setData('table_name', value)}
                                listTables={listTables}
                                selectedTable={data.table_name}
                                isDisabled={loading}
                                filterTable={TABLE_WITHOUT_YEAR}
                                additionalTable={ADDITIONAL_TABLE}
                            />
                        </div>
                    </div>

                    <InputFileHolder
                        data={data.file}
                        handleDataChange={(file) => setData('file', file)}
                        loading={loading} />

                    <DialogFooter className='flex justify-center'>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                            >
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading}
                            className='bg-[#258eff] text-white'
                        >
                            {loading ? 'Loading...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}
