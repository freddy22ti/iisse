import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

interface GenericSelectorProps<T> {
    items: T[];
    selectedItem: T | null; // Allow null to indicate no selection
    onSelectItem: (item: T | null) => void; // Update to accept null
    placeholder?: string;
    itemDisplay?: (item: T) => string;  // Optional function for custom display of items
}

export const GenericSelector = <T,>({
    items,
    selectedItem,
    onSelectItem,
    placeholder = "Select an option...",
    itemDisplay = (item: T) => String(item),  // Default display logic
}: GenericSelectorProps<T>) => {
    const [open, setOpen] = useState(false);

    const handleSelectItem = (item: T) => {
        // Check if the item is already selected
        if (selectedItem === item) {
            onSelectItem(null); // Deselect item
        } else {
            onSelectItem(item); // Select new item
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] justify-between"
                >
                    {selectedItem ? itemDisplay(selectedItem) : placeholder}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9 border-0 focus:outline-none focus:ring-0" />
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={itemDisplay(item)}
                                    value={itemDisplay(item)}
                                    onSelect={() => handleSelectItem(item)}
                                >
                                    {itemDisplay(item)}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedItem === item ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
