import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { FormEventHandler } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Input } from "@/Components/ui/input"
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';

import { Separator } from '@/Components/ui/separator';

import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { User } from '@/types/index'


const InputField = ({
    name,
    label,
    placeholder,
    value,
    error,
    type = "text",
    onChange,
}: {
    name: string;
    label: string;
    placeholder: string;
    value: string;
    error: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div>
        <InputLabel htmlFor={name} value={label} />
        <TextInput
            id={name}
            type={type}
            className="mt-1 block w-full"
            defaultValue={value}
            onChange={onChange}
            placeholder={placeholder}
        />
        {error && <InputError className="mt-2" message={error} />}
    </div>
);

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; auth: any }>) {
    const user: User = usePage().props.auth.user;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            email: user.email,
            country: user.country,
            city: user.city,
            address: user.address,
            postal_code: user.postal_code,
            profile_picture: user.profile_picture,
        });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Profile Updated Successfully!');
        }
    }, [recentlySuccessful])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const { data: profileImage,
        setData: setProfileImage,
        post,
        processing: imageProcessing,
        delete: deleteImage } = useForm<{
            profile_picture: File | null;
        }>({
            profile_picture: null
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage('profile_picture', e.target.files[0])

        }
    };

    useEffect(() => {
        if (profileImage.profile_picture != null) {
            // Send the request to update the profile picture
            post('/profile-image', {
                onSuccess: () => {
                    toast.success('Profile Image Uploaded Successfully')
                },
                onError: (errors) => {
                    // Handle validation errors if needed
                    toast.error('Something went wrong')
                    console.error(errors)
                },
            });
        }
    }, [profileImage.profile_picture])

    const handleDeleteFile = () => {
        deleteImage('/profile-image', {
            onSuccess: () => {
                toast.success('Profile Image Deleted Successfully')
            },
            onError: () => {
                toast.error('Something went wrong')
            },
        });
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h2 className='mb-5 text-xl font-bold'>
                            Personal Information
                        </h2>
                        <Separator className='mb-5' />
                        <div className="mt-2 mb-5 flex">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={user.profile_picture ? `/storage/${user.profile_picture}` : ""}
                                    className='object-cover' />
                                <AvatarFallback />
                            </Avatar>
                            <div className="ms-5">
                                <p className="text-xs text-gray-600 mb-2">
                                    We only support JPG, JPEG, or PNG.
                                </p>
                                <Input
                                    id="avatar"
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange} />
                                {/* Button that triggers file input click */}
                                <div className="flex">
                                    <Button
                                        onClick={handleButtonClick}
                                        disabled={imageProcessing}>
                                        Upload your image
                                    </Button>
                                    <Button
                                        onClick={handleDeleteFile}
                                        variant="ghost"
                                        className="ms-2"
                                        disabled={imageProcessing || user.profile_picture == null}>
                                        Delete Image
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4 gap-y-6">
                                <InputField
                                    name="first_name"
                                    label="First Name"
                                    placeholder="First Name"
                                    value={data.first_name}
                                    error={errors?.first_name || ''}
                                    onChange={(e) => setData('first_name', e.target.value)} // Tambahkan onChange
                                />

                                <InputField
                                    name="last_name"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    value={data.last_name}
                                    error={errors?.last_name || ''}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                <InputField
                                    name="phone_number"
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    value={data.phone_number}
                                    error={errors?.phone_number || ''}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                />
                                <InputField
                                    type='email'
                                    name="email"
                                    label="email"
                                    placeholder="test@gmail.com"
                                    value={data.email}
                                    error={errors?.email || ''}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                            </div>
                            <h2 className="text-xl font-medium mt-4">Personal Address</h2>
                            <div className="grid grid-cols-2 gap-4 gap-y-6">
                                <InputField
                                    name="country"
                                    label="country"
                                    placeholder="country"
                                    value={data.country}
                                    error={errors?.country || ''}
                                    onChange={(e) => setData('country', e.target.value)}
                                />
                                <InputField
                                    name="city"
                                    label="city"
                                    placeholder="City"
                                    value={data.city}
                                    error={errors?.city || ''}
                                    onChange={(e) => setData('city', e.target.value)}
                                />
                                <InputField
                                    name="address"
                                    label="address"
                                    placeholder="Address"
                                    value={data.address}
                                    error={errors?.address || ''}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputField
                                    name="postalCode"
                                    label="postalCode"
                                    placeholder="Postal Code"
                                    value={data?.postal_code || ''}
                                    error={errors?.postal_code || ''}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                />
                            </div>

                            <div className="flex mt-4">
                                <Button type="submit" className="ms-auto" disabled={processing}>{processing ? "Submitting..." : "Submit"}</Button>
                            </div>
                        </form>

                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
