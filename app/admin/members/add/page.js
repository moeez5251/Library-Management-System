"use client"
import React, { useState, useEffect } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { Asterisk, CircleAlert, EyeIcon, EyeOff } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { validate } from 'react-email-validator';
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
const AddUser = () => {
    const [togglepassword, settogglepassword] = useState(false)
    const [user, setuser] = useState(true)
    const [MemberShip, setMemberShip] = useState("")
    const [role, setrole] = useState("Standard-User")
    const [disabledbtn, setdisabledbtn] = useState(true)
    const [inputs, setInputs] = useState({
        User_Name: '',
        Email: '',
        Membership_Type: MemberShip,
        Password: '',
        Role: role
    })
    useEffect(() => {
        setInputs({
            ...inputs,
            Membership_Type: MemberShip,
            Role: role
        })
        return () => {

        }
    }, [MemberShip, role])
    useEffect(() => {
        if (inputs.User_Name.trim() !== '' && inputs.Email.trim() !== '' && inputs.Password.trim() !== '' && MemberShip.trim() !== '' && role.trim() !== '') {
            setdisabledbtn(false)
        }
        else {
            setdisabledbtn(true)
        }
        return () => {

        }
    }, [inputs])

    const handleInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });

    }
    const handlecreateuser = async () => {
        if (!validate(inputs.Email)) {
            toast.custom((t) => (
                <div className={`bg-red-700 text-white p-4 rounded-md shadow-lg flex items-center gap-3
                ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                    <CircleAlert size={20} />
                    <p className='text-sm'>Please enter a valid email address.</p>
                </div>
            ));
            return;
        }
        setuser(false)
        try {
            const data = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                     
                },
                credentials: "include",
                body: JSON.stringify({
                    User_Name: inputs.User_Name,
                    Email: inputs.Email,
                    Role: inputs.Role,
                    Membership_Type: inputs.Membership_Type,
                    Password: inputs.Password,
                    API: process.env.NEXT_PUBLIC_XLMS_API
                }),
            })
            if (!data.ok) {
                const errorData = await data.json();
                toast.error(errorData.error);
                setuser(true);
                return;
            }
            const res = await data.json();
            if (res.message) {
                toast.success(res.message);
                setInputs({
                    User_Name: '',
                    Email: '',
                    Membership_Type: MemberShip,
                    Password: '',
                    Role: role
                });
                setMemberShip("");
                setrole("Standard-User");
                setuser(true);
                await fetch("/api/notifications/add", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                         
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        Message: "New User Registered",
                        Userid: localStorage.getItem("userID")
                    })
                })
            }
        } catch (err) {
            toast.error("Internal Server Error, Please try again later")
        }
    }
    return (
        <>
            <Toaster />
            <div className='sm:mx-4 my-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link className='text-base font-semibold text-black dark:text-white' href="/admin/members" prefetch={true}>Manage Users</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold text-[#113cb0] text-base dark:text-[#486691]">Add User</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='bg-white sm:mx-4 my-3 py-3 px-8 pb-12 rounded-md  dark:bg-[#1b2536]'>
                <h2 className='font-semibold border-b-2 pb-1'>User Information</h2>
                <div>
                    <div className='flex flex-col gap-3 items-start'>
                        <div className='my-3 w-full flex flex-col gap-5'>
                            <div className='flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4'>

                                <div className='flex flex-col gap-2 items-start '>

                                    <div className='font-semibold text-sm flex items-start gap-1'>
                                        User Name<Asterisk size={13} color='red' />
                                    </div>
                                    <div className='w-full'>
                                        <input value={inputs.User_Name} onChange={handleInputChange} className='border px-2 py-1 rounded-sm placeholder:text-sm text-base w-full' type="text" name="User_Name" id="User_Name" placeholder='User name here' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 items-start '>

                                    <div className='font-semibold text-sm flex items-start gap-1'>
                                        Email<Asterisk size={13} color='red' />
                                    </div>
                                    <div className='w-full'>
                                        <input value={inputs.Email} onChange={handleInputChange} className='border px-2 py-1 rounded-sm placeholder:text-sm text-base w-full' type="text" name="Email" id="Email" placeholder='Enter email address' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4'>

                                <div className='flex flex-col gap-2 items-start '>

                                    <div className='font-semibold text-sm flex items-start gap-1'>
                                        Password<Asterisk size={13} color='red' />
                                    </div>
                                    <div className='flex items-center gap-2 relative w-full'>
                                        <input value={inputs.Password} onChange={handleInputChange} className='border px-2 py-1 rounded-sm placeholder:text-sm text-base w-full' type={togglepassword ? "text" : "password"} name="Password" id="Password" placeholder='Enter Password' />
                                        <button onClick={() => settogglepassword(!togglepassword)} className='absolute  right-2 cursor-pointer'>
                                            {
                                                togglepassword ?
                                                    <EyeOff size={17} /> :
                                                    <EyeIcon size={17} />
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 items-start'>

                                    <div className='font-semibold text-sm flex items-start gap-1'>
                                        MemberShip Type<Asterisk size={13} color='red' />
                                    </div>
                                    <div>
                                        <Select value={MemberShip} onValueChange={setMemberShip}>
                                            <SelectTrigger className="w-[190px] dark:bg-[#1b2536]">
                                                <SelectValue className="dark:bg-[bg-[#1b2536]" placeholder="MemberShip" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-[#1b2536]">
                                                <SelectItem className="dark:bg-[#1b2536] dark:hover:bg-[#1b2550]" value="English">English</SelectItem>
                                                <SelectItem className="dark:bg-[#1b2536] dark:hover:bg-[#1b2550]" value="Urdu">Urdu</SelectItem>
                                                <SelectItem className="dark:bg-[#1b2536] dark:hover:bg-[#1b2550]" value="French">French</SelectItem>
                                                <SelectItem className="dark:bg-[#1b2536] dark:hover:bg-[#1b2550]" value="Hindi">Hindi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 items-start w-full'>

                                <div className='font-semibold text-sm flex items-start gap-1'>
                                    Role<Asterisk size={13} color='red' />
                                </div>
                                <div className='w-full'>
                                    <RadioGroup value={role} onValueChange={setrole} className="flex items-center w-full " defaultValue="Standard-User">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Standard-User" id="Standard-User" />
                                            <Label htmlFor="Standard-User">Standard User</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Admin" id="Admin" />
                                            <Label htmlFor="Admin">Admin</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center gap-3'>
                <Link href="/admin/members" prefetch={true} className='bg-gray-300 px-4 py-2 rounded-sm cursor-pointer dark:bg-[#162130]'>Cancel</Link>
                {
                    user &&
                    <button onClick={handlecreateuser} disabled={disabledbtn} className='bg-[#6841c4] text-white px-4 py-2 rounded-sm cursor-pointer transition-transform scale-95 hover:scale-100 font-normal disabled:bg-gray-300 disabled:pointer-events-none disabled:cursor-auto dark:disabled:bg-gray-700'>Create User</button>

                }

                {
                    !user &&
                    <button disabled={true} className='bg-[#6841c4] text-white px-4 py-2 rounded-sm cursor-pointer transition-transform scale-95 hover:scale-100 font-normal disabled:bg-gray-300 disabled:pointer-events-none disabled:cursor-auto dark:disabled:bg-gray-700'>Creating...</button>

                }

            </div>
        </>
    )
}

export default AddUser