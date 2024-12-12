import { toast } from 'sonner';
import { useState, FormEventHandler } from 'react';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { TableSelector } from '@/Components/selectors/TableSelector';
import { FileDown, ChevronDownIcon } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { InputFileHolder } from './InputFileHolder';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import { ADDITIONAL_TABLE, TABLE_WITHOUT_YEAR } from '@/const';

export const ImportFileButton = ({ listTables }: { listTables: string[] }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { data, setData, reset } = useForm({
        table_name: '',
        file: null as File | null,
        sure: false,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!data.table_name || !data.file || !data.sure) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (data.file.type !== "text/csv") {
            toast.error("Please upload a valid CSV file.");
            return;
        }

        setLoading(true);

        try {
            let table;
            switch (data.table_name) {
                case 'kuisioner':
                    table = 'ekonomi';
                    break;
                case 'pm25':
                    table = 'pm25 kecamatan';
                    break;
                default:
                    table = data.table_name;
                    break;
            }


            const formData = new FormData();
            formData.append('table_name', table);
            formData.append('file', data.file);

            const response = await axios.post(route('input-data.add-data'), formData);

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
            setLoading(false);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!loading) {
            setOpen(open);
            reset();
        }
    };

    const handleDownload = async (templateName: string) => {
        try {
            const fileUrl = `/storage/templates/csv/${templateName}.csv`;
            const response = await axios.get(fileUrl, { responseType: "blob" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(response.data);
            link.download = `${templateName}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("File download failed:", error);
            toast.error("Failed to download template.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white">
                    <FileDown className="me-2" size={18} />
                    <span>Import</span>
                    <ChevronDownIcon className="ms-2" />
                </Button>
            </DialogTrigger>

            <DialogContent aria-describedby="upload csv form">
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">
                        Import file by CSV
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="mb-5 flex">
                        <div>
                            <Button
                                type="button"
                                variant="link"
                                disabled={!data.table_name}
                                onClick={() => handleDownload(data.table_name)}
                                className="ps-0"
                            >
                                Download Template
                            </Button>
                        </div>
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
                        loading={loading}
                    />

                    <div className="mb-5 flex items-center">
                        <Checkbox
                            id="sure"
                            onCheckedChange={(checked) => setData('sure', checked as boolean)}
                            disabled={loading}
                            className="rounded-full h-4 w-4"
                        />
                        <label htmlFor="sure" className="ms-2 text-sm">
                            Are You Sure?
                        </label>
                    </div>

                    <DialogFooter className="flex justify-center">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading || !data.file || !data.table_name || !data.sure}
                            className="bg-[#258eff] text-white"
                        >
                            {loading ? 'Uploading...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
