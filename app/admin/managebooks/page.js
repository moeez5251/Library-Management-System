"use client"

import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import DataTable from '@/table/mytable';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Disc, PlusIcon, Trash2 } from 'lucide-react';
import Badge from '../components/badge';
import ComboBox from '../components/combobox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
export default function Books() {
  const columnHelper = createColumnHelper();
  const [checked, setchecked] = useState(
    {
      selected: [],
      isempty: true
    })
  const [input, setinput] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState('5');
  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState([])
  const router = useRouter();
  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            if (value) {
              setchecked({
                ...checked,
                selected: table.getCoreRowModel().rows.map(row => row.original.Book_ID),
              })
            }
            else {
              setchecked({
                ...checked,
                selected: [],
              })
            }
          }
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            if (!row.getIsSelected()) {
              setchecked({
                ...checked,
                selected: [...checked.selected, row.original.Book_ID],

              })

            } else {
              setchecked({
                ...checked,
                selected: checked.selected.filter(id => id !== row.original.Book_ID),

              })
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    columnHelper.accessor('Book_ID', {
      header: 'Book ID',
      cell: ({ row }) => {
        const id = row.getValue('Book_ID').slice(0, 7) + "...";
        return <span className='text-sm'>{id}</span>;
      },
    }),
    columnHelper.accessor('Book_Title', {
      header: 'Book Title',
      cell: ({ row }) => {
        const status = row.getValue('Book_Title');
        const id = row.getValue('Book_ID');

        return <Link data-id={id} className='text-[#235fff] font-semibold hover:underline text-nowrap dark:text-[#4c669f]' href={`/admin/managebooks/${id}`} prefetch={true}>{status}</Link>
      },
    }),
    columnHelper.accessor('Author', {
      header: 'Author',
      cell: ({ row }) => {
        const status = row.getValue('Author');
        return <span className='text-sm text-nowrap'>{status}</span>;
      }
    }),
    columnHelper.accessor('Category', {
      header: 'Category',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Language', {
      header: 'Language',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Price', {
      header: 'Price',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Total_Copies', {
      header: 'Total',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Available', {
      header: 'Available',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Status', {
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('Status');
        return <Badge status={status} />;
      },
    }),
  ];
  const [Delete, setDelete] = useState(false)
  const [Disabledelete, setDisabledelete] = useState(false)
  async function fetch_data() {
    const data = await fetch("/api/books/get", {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
         

      },
      credentials: "include",
      body: JSON.stringify({
        API: process.env.NEXT_PUBLIC_XLMS_API
      })
    })
    if (!data.ok) {
      toast.error("Unable to fetch data")
      setLoading(false)
      return
    }
    const response = await data.json()
    setdata(response)
    setLoading(false)
  }
  useEffect(() => {
    fetch_data()
    return () => {

    }
  }, [])
  useEffect(() => {
    router.prefetch("/admin/managebooks/add");

    return () => {

    }
  }, [router])
  useEffect(() => {
    checked.selected.length === 0 ? setchecked({ ...checked, isempty: true }) : setchecked({ ...checked, isempty: false })
    return () => {

    }
  }, [checked.selected])

  const handledelete = async () => {
    setDisabledelete(true)
    try {

      const data = await fetch("/api/books/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           
        },
        credentials: "include",

        body: JSON.stringify(checked.selected)
      })
      const response = await data.json()
      toast(response.message)
      setDelete(false)
      setLoading(true)
      setDisabledelete(false)
      setchecked({
        selected: [],
        isempty: true
      })
      await fetch("/api/notifications/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
           
        },
        credentials: "include",
        body: JSON.stringify({
          Message: "Book was deleted",
          Userid: localStorage.getItem("userID")
        })
      })
    }
    catch (err) {
      toast("Unable to delete")
      setDisabledelete(false)

    }
    fetch_data()
  }
  return (
    <>
      <Toaster />

      <h1 className='font-semibold text-xl mx-3 my-3'>Manage Books</h1>
      <div className='flex justify-between items-center mx-1 sm:mx-3 my-3 sm:mr-7'>
        <div className="relative flex items-center w-[150px] sm:w-[200px] h-[40px] px-2 bg-white rounded-xl transition-all duration-200 focus-within:rounded focus-within:before:scale-x-100 before:content-[''] before:absolute before:bg-blue-600 before:transform before:scale-x-0 before:origin-center before:w-full before:h-[2px] before:left-0 before:bottom-0 before:rounded before:transition-transform before:duration-300 dark:bg-[#252f40]">
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={17}
              height={16}
              fill="none"
              className=" text-gray-400"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.333}
                d="M7.667 12.667A5.333 5.333 0 1 0 7.667 2a5.333 5.333 0 0 0 0 10.667zM14.334 14l-2.9-2.9"
              />
            </svg>
          </button>
          <input className="w-full h-full px-2 py-[0.7rem] font-normal bg-transparent text-sm border-none focus:outline-none placeholder:text-gray-700 dark:placeholder:text-gray-300" placeholder="Search Books" value={input} onChange={(e) => { setinput(e.target.value); }} type="text" />
          <button onClick={() => { setinput("") }} className={`cursor-pointer ${input.length === 0 ? "opacity-0" : "block"} transition-opacity`} >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-[15px] h-[15px] text-gray-400"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className='flex items-center gap-5 flex-col sm:flex-row'>
          <Link href="/admin/managebooks/add" prefetch={true} className='bg-[#6841c4] text-white font-semibold px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-[#7a4ed0] transition-colors duration-200 text-base'>
            <PlusIcon size={20} className='hidden sm:inline ' />
            Add Book</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-[#6841c4] text-white font-semibold px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-[#7a4ed0] transition-colors duration-200 text-base"> <ChevronDown size={20} className='inline' /> Actions</DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-[#1b2536] ">
              <DropdownMenuItem onClick={() => { router.push("/admin/managebooks/add") }} className="flex items-center cursor-pointer dark:hover:bg-[#1b2550]"><PlusIcon className='inline' /> Add Book</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDelete(true)} disabled={checked.isempty} className="flex items-center cursor-pointer dark:hover:bg-[#1b2550]"> <Trash2 className='inline' /> Delete Book</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='bg-white w-full overflow-x-auto transition-all py-2 mx-0  rounded-lg shadow-md dark:bg-[#252f40]'>

        <DataTable data={data} columns={columns} externalFilter={input} pageSize={rowsPerPage} loading={loading} />
      </div>
      <div className='mt-3 mx-1 sm:mx-5 flex items-center gap-6 sm:gap-0 justify-between overflow-x-auto'>
        <div className='text-black text-base font-semibold text-nowrap dark:text-white'>
          Total Books: {data.length}
        </div>

        <ComboBox value={rowsPerPage} onChange={setRowsPerPage} />
      </div>

      <Dialog open={Delete} onopenchange={setDelete}>
        <DialogContent className="w-full lg:w-1/3 rounded-3xl shadow-lg " >
          <DialogTitle></DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-center gap-2 my-4">
            <span className=" bg-white rounded-lg  overflow-hidden text-left flex flex-col gap-4 dark:bg-[#1b2536]">
              <span className="p-1 bg-white dark:bg-[#1b2536]">
                <span className="flex justify-center items-center w-12 h-12 mx-auto bg-red-100 rounded-full ">
                  <svg
                    aria-hidden="true"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-red-600"
                  >
                    <path
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span className="mt-3 text-center flex flex-col gap-4">
                  <span className="text-gray-900 text-base font-semibold leading-6 dark:text-white">Delete Books</span>
                  <span className="my-2  text-gray-500 leading-5 flex flex-col text-base gap-1 dark:text-gray-200">
                    Do you really want to delete selected books ?<span> This action cannot be undone</span>
                  </span>
                </span>
                {
                  !Disabledelete &&
                  <button
                    type="button"
                    onClick={() => handledelete()}
                    className="w-full inline-flex justify-center py-2 my-3 text-white bg-red-600 text-base font-medium rounded-md shadow-sm border border-transparent cursor-pointer transition-all scale-95 hover:scale-100 dark:bg-red-600"
                  >
                    Delete
                  </button>
                }
                {
                  Disabledelete &&
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 my-3 text-white bg-red-600 text-base font-medium rounded-md shadow-sm border border-transparent cursor-auto pointer-events-none transition-all  disabled:bg-red-700"
                    disabled={true}
                  >
                    Deleting...
                  </button>}
                <button
                  type="button"
                  onClick={() => setDelete(false)}
                  className="w-full inline-flex justify-center  py-2 bg-white text-gray-700 text-base font-medium rounded-md shadow-sm border border-gray-300 cursor-pointer transition-all scale-95 hover:scale-100 dark:bg-[#1b2536] dark:text-white dark:border-[#2b3649]"
                >
                  Cancel
                </button>
              </span>
            </span>



          </DialogDescription>
          <button onClick={() => { setDelete(false) }} className='absolute top-3 cursor-pointer right-3 bg-gray-300  p-1 rounded-2xl z-40 '>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={15}
              height={15}
              fill="none"
              className="injected-svg"
              color="black"
              data-src="https://cdn.hugeicons.com/icons/multiplication-sign-solid-rounded.svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                fillRule="evenodd"
                d="M5.116 5.116a1.25 1.25 0 0 1 1.768 0L12 10.232l5.116-5.116a1.25 1.25 0 0 1 1.768 1.768L13.768 12l5.116 5.116a1.25 1.25 0 0 1-1.768 1.768L12 13.768l-5.116 5.116a1.25 1.25 0 0 1-1.768-1.768L10.232 12 5.116 6.884a1.25 1.25 0 0 1 0-1.768Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
