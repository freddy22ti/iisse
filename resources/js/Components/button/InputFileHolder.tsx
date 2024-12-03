import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { Input } from '@/Components/ui/input';
import { SiGoogledocs } from "react-icons/si";
import { IoIosAddCircle } from "react-icons/io";

export const InputFileHolder = ({
    data,
    handleDataChange,
    loading,
}: {
    data: File | null;
    handleDataChange: (newFile: File | null) => void;
    loading: boolean;
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Fungsi utilitas untuk memvalidasi file
    const isValidCSV = (file: File) => file.type === "text/csv";

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && isValidCSV(file)) {
            handleDataChange(file);
        } else {
            toast.error("Please upload a valid CSV file");
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isValidCSV(file)) {
            handleDataChange(file);
        } else {
            toast.error("Please upload a valid CSV file");
            handleDataChange(null);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Gaya dinamis
    const containerClass = `mb-5 border-2 rounded-lg p-5 flex flex-col items-center justify-center space-y-6 cursor-pointer h-[300px] ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
    }`;

    // Placeholder text
    const placeholderText = data?.name
        ? data.name
        : "Select a CSV file to upload or drag and drop it here";

    return (
        <div
            className={containerClass}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
        >
            <SiGoogledocs color="#258eff" size={40} className="opacity-60" />
            <IoIosAddCircle color="#258eff" size={32} className="opacity-60" />
            <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                disabled={loading}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <p className="text-center text-gray-500 text-md">{placeholderText}</p>
        </div>
    );
};
