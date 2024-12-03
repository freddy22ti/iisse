import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form"
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { User } from "@/types/index";
import { DialogDescription } from "@radix-ui/react-dialog";

const FormSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export const AddUserButton = ({ onUserAdded }: { onUserAdded: (user: User) => void }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Prevent closing the dialog if loading is true
    const handleDialogClose = (open: boolean) => {
        if (!loading) {
            setOpen(open);
        }
    };

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setLoading(true)
        try {
            const response = await axios.post(route('manage-user.add'), {
                email: values.email,
                password: values.password,
            });

            if (response.status === 201) {
                toast.success('User added successfully!');
                // user
                const data = JSON.parse(response.request.response)
                const user: User = {
                    id: data.user.id,
                    first_name: '',
                    last_name: '',
                    email: data.user.email,
                    phone_number: '',
                    country: '',
                    city: '',
                    address: '',
                    postal_code: '',
                    profile_picture: '',
                }
                onUserAdded(user)

                setOpen(false);
                form.reset(); // Reset form after successful submission
            }
        } catch (e: any) {
            const msg = e.response.statusText
            if (msg == 'Unprocessable Content') {
                toast.error('Email has already taken!');
            } else {
                toast.error('Failed to add user!');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button>
                    Add User
                </Button>
            </DialogTrigger>

            <DialogContent aria-describedby="Form Add User">
                <DialogHeader>
                    <DialogTitle className='text-center'>Add User</DialogTitle>
                </DialogHeader>
                <DialogDescription />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-5">

                            <div className="mb-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mb-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

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
                                type='submit'
                                disabled={loading}
                                className='bg-[#258eff] text-white'
                            >
                                {loading ? 'Loading...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
