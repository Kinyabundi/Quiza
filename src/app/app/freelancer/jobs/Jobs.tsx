'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FileDown, FileUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';


interface TransactionData {
    uploadId: string;
    createdAt: string;
}

const Jobs = () => {
    const [files, setFiles] = useState<TransactionData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    return (
        <div>
            {loading ? ( 
                <div className="flex justify-center items-center h-screen">
                    <div>
                    <Loader2 className="w-12 h-12 mr-2  text-[#FFA447] animate-spin" />
                    </div>
                    <p className='mr-4'>Fetching Files...</p>
                </div>
            ) : (
                <>
            {files.length > 0 && (
                <>
                    <div className='mt-10 flex flex-row space-x-4 items-center justify-center'>
                        <h1 className='font-bold text-lg'>Files Uploaded</h1>
                        <div className="flex-grow"></div>
                    </div>
                    <div className='mt-8'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>UploadID</TableHead>
                                    <TableHead>CreatedAt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file, index) => (
                                    <TableRow key={index} onClick={() => router.push(`/app/filedetails/${file.uploadId}`)} className='hover:bg-gray-200 cursor-pointer'>
                                        <TableCell>{file.uploadId}</TableCell>
                                        <TableCell>{format(new Date(file.createdAt), 'PPpp')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
            </>
            )}
        </div>
    );
};

export default Jobs;