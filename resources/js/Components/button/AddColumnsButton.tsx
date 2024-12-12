import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { TableSelector } from "@/Components/selectors/TableSelector";
import { FormEventHandler, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CirclePlus, Trash2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import { TABLE_WITHOUT_YEAR, ADDITIONAL_TABLE } from "@/const";

interface Column {
    name: string;
    type: string;
}

export const AddColumnsButton = ({ listTables }: { listTables: string[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [columns, setColumns] = useState<Column[]>([{ name: "", type: "" }]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data, setData, reset } = useForm({
        table_name: "",
        columns: [] as Column[],
    });

    // Sync `columns` state with form data
    useEffect(() => {
        setData("columns", columns);
    }, [columns]);

    // Form submission handler
    const submit: FormEventHandler = useCallback(async (e) => {
        e.preventDefault();

        if (!data.table_name || columns.some((col) => !col.name || !col.type)) {
            toast.error("Please complete all required fields.");
            return;
        }

        setLoading(true);
        
        let table: string
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

        try {
            const response = await axios.post(route("input-data.add-columns"), {
                table_name: table,
                columns: data.columns,
            });

            if (response.status === 201) {
                toast.success(response.data?.message || "Columns added successfully.");
                reset();
                setOpen(false);
            }
        } catch (error: any) {
            console.error(error)
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [data, columns]);

    // Handle column input changes
    const handleColumnChange = useCallback(
        (index: number, field: keyof Column, value: string) => {
            const updatedColumns = [...columns];
            updatedColumns[index][field] = value;
            setColumns(updatedColumns);
        },
        [columns]
    );

    // Add a new column
    const addNewColumn = useCallback(() => {
        setColumns((prev) => [...prev, { name: "", type: "" }]);
    }, []);

    // Remove a column
    const removeColumn = useCallback(
        (index: number) => {
            setColumns((prev) => prev.filter((_, i) => i !== index));
        },
        []
    );

    // Handle dialog close
    const handleDialogClose = useCallback(
        (open: boolean) => {
            if (!loading) {
                setOpen(open);
                reset();
            }
        },
        [loading]
    );

    // Check if the form is valid
    const isFormValid = (): boolean => {
        return !!data.table_name && columns.every((col) => col.name && col.type);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button>Add Attributes</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">Add Attributes</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="mb-5 flex">
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={addNewColumn}
                            className="mb-5 p-2 bg-green-500 hover:bg-green-600 flex items-center"
                        >
                            <CirclePlus color="#fff" size={18} />
                            <span className="ms-1 text-white">Add Column</span>
                        </Button>
                        <div className="ms-auto">
                            <TableSelector
                                isDisabled={loading}
                                listTables={listTables}
                                selectedTable={data.table_name}
                                onSelectChange={(value) => setData("table_name", value)}
                                filterTable={TABLE_WITHOUT_YEAR}
                                additionalTable={ADDITIONAL_TABLE}
                            />
                        </div>
                    </div>

                    {/* Input fields for columns */}
                    {columns.map((col, index) => (
                        <div key={index} className="mb-5 grid gap-2 grid-cols-9">
                            <Input
                                type="text"
                                placeholder="Column Name"
                                value={col.name}
                                onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                                className="col-span-4"
                                disabled={loading}
                            />
                            <Select
                                onValueChange={(value) => handleColumnChange(index, "type", value)}
                                value={col.type}
                                disabled={loading}
                            >
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="string">String</SelectItem>
                                    <SelectItem value="integer">Integer</SelectItem>
                                </SelectContent>
                            </Select>
                            {columns.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeColumn(index)}
                                    variant="destructive"
                                    className="h-full col-span-1 p-1"
                                >
                                    <Trash2 />
                                </Button>
                            )}
                        </div>
                    ))}

                    <DialogFooter className="flex justify-center">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading || !isFormValid()}
                            className="bg-[#258eff] text-white"
                        >
                            {loading ? "Loading..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
