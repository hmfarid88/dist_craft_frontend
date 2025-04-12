"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";
import { FcAdvertising, FcDeleteRow } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";

const InvoiceNote = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [note, setNote] = useState("");

    const submitNoteInfo = async (e: any) => {
        e.preventDefault();
        if (!note) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/shop/addInvoiceNote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note, username }),
            });

            if (!response.ok) {
                toast.error("Note info not submitted !");
                return;
            } else {
                toast.success("Info added successfully.")
                setNote("");
            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }
    }
    const handleDelete = async (id: any) => {
        try {
            const response = await fetch(`${apiBaseUrl}/shop/deleteInvoiceNote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                toast.error("Note info not deleted !");
                return;
            } else {
                toast.success("Info deleted successfully.")
                fetchNotes();
            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        }
    }


    const [allNotes, setAllNotes] = useState([]);
    const fetchNotes = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/shop/getInvoiceNote?username=${username}`);
            const data = await response.json();
            setAllNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [apiBaseUrl, username, note]);

    return (
        <div className="flex flex-col items-center justify-center">

            <div className="flex flex-col gap-3 pb-5">

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">NOTE</span>
                    </div>
                    <input type="text" name="item" onChange={(e: any) => setNote(e.target.value)} value={note} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitNoteInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>
            {allNotes?.map((item: any, index) => (
                <tr key={index}>
                    <td><p className='flex gap-2 text-left'> <FcAdvertising size={20} /> {item.note}</p></td>
                    <td><p className='flex pl-2 text-left'><button onClick={() => handleDelete(item.id)} className='btn btn-ghost btn-circle btn-xs'><RxCrossCircled size={20} /></button></p></td>
                </tr>
            ))}
        </div>

    )
}

export default InvoiceNote