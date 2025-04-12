"use client";
import React, { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';

const BarcodeGenerator: React.FC = () => {
    const [qty, setQty] = useState<number | string>('');
    const [barcodes, setBarcodes] = useState<string[]>([]);
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    // Function to generate unique 10-digit barcodes
    const generateBarcodes = (quantity: number): string[] => {
        const generatedBarcodes = new Set<string>();
        while (generatedBarcodes.size < quantity) {
            const uniqueNumber = Math.floor(100000000000000 + Math.random() * 900000000000000);
            generatedBarcodes.add(uniqueNumber.toString());
        }
        return Array.from(generatedBarcodes);
    };

    const handleGenerate = () => {
        if(!qty){
            toast.info("Please input any quantity!");
            return;
        }
        const quantity = parseInt(qty as string, 10);
        if (quantity > 0 && quantity<=1000) {
            const generated = generateBarcodes(quantity);
            setBarcodes(generated);
            setQty('');
        } else {
            toast.info("Please enter quantity 1-1000.");
        }
    };

    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <div className="flex justify-between w-full p-5">
                <div className="flex gap-3">
                    <input
                        className="input input-bordered w-full max-w-xs"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        placeholder="Enter quantity"
                        min="1"
                    />
                    <button type='submit' className="btn btn-outline btn-accent" onClick={handleGenerate}>Generate</button>
                </div>
                <div className="flex">
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>
            <div  ref={contentToPrint}
                className="grid gap-2 pl-5 pr-5"
                style={{
                    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                    marginTop: '5px',
                }}
            >
                {barcodes.map((barcode, index) => (
                    <div 
                        key={index}
                        className="flex justify-center"
                        style={{ textAlign: 'center' }}
                    >
                        <Barcode
                            value={barcode}
                            format="CODE128"
                            width={2}
                            height={50}
                            displayValue={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BarcodeGenerator;
