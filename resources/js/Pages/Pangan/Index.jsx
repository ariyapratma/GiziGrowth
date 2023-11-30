import DangerButton from "@/Components/DangerButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { InertiaLink } from "@inertiajs/inertia-react";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { AiFillDelete, AiFillEdit, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import AddPangan from "./AddPangan";

const index=(props)=>{
    // console.log(props.data_ketahanan_pangan);
    let page =[];
    for(let i = 1; i < props.data_ketahanan_pangan.links.length-1; i++){
        page.push(props.data_ketahanan_pangan.links[i]);
    }
    let noData = props.data_ketahanan_pangan.from;
    const [searchEntry, setSearchEntry] = useState();
    const [disableDelete, setDisableDelete] = useState(true);
    const handleDisableDelete=()=>{
        setTimeout(()=>{
            setDisableDelete(false);
        }, 5000);
    }

    return (
        <Authenticated user={props.user}>
            <Head title="Tabel Data Ketahanan Pangan"/>
            <div className="p-5">

                <button onClick={()=>document.getElementById('addModal').showModal()} className='btn bg-[#04724d] hover:bg-[#94c73f] text-white hover:text-black'>Tambah Data +</button>

                <button 
                    className='mx-5 my-4 btn btn-sm bg-zinc-900 hover:bg-red-900 hover:text-gray-400 text-red-500 absolute right-0'
                    onClick={()=>{
                        document.getElementById('deleteAllModal').showModal();
                        handleDisableDelete();
                    }}
                >
                    Delete All Data
                </button>

                <form className="mt-5" onSubmit={()=>{
                        if(searchEntry != null){
                            Inertia.get(`/ketahanan_pangan?search=${searchEntry}`);
                        }
                    }}>
                    <input type="search" name="search" id="searchData" className='mr-3 h-8 border-gray-300 border-gray-700 bg-gray-0 text-gray-700 focus:border-[#04724d] focus:border-[#04724d] focus:ring-[#04724d] focus:ring-[#04724d] rounded-md shadow-sm'
                        onChange={(searchEntry)=>setSearchEntry(searchEntry.target.value)}
                    />
                    <button className='btn btn-sm bg-[#94c73f] text-white hover:bg-[#b4e75f]'>search</button>
                </form>

                <table className='table mt-5 rounded-lg overflow-x-auto'>
                    <thead>
                        <tr className='bg-white border rounded-lg shadow-lg'>
                            <th>No</th>
                            <th>Nama Lokasi</th>
                            <th>Tahun</th>
                            <th>Ketersediaan Pangan</th>
                            <th>Jenis Pangan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.data_ketahanan_pangan.data ? props.data_ketahanan_pangan.data.map(item=>{
                        return(
                            <tr key={item.id} className='border-b-gray-300'>
                                <td>{noData++}</td>
                                <td>{item.nama_lokasi}</td>
                                <td>{item.tahun}</td>
                                <td>{item.ketersediaan_pangan}</td>
                                <td>{item.jenis_pangan}</td>
                                <td>
                                    <button onClick={()=>{
                                            setEditItem(item);
                                            document.getElementById('editModal').showModal();
                                        }} className='m-1 btn btn-sm btn-warning hover:bg-amber-500'
                                    >
                                                <AiFillEdit />
                                                Edit
                                    </button>
                                    <DangerButton 
                                        className='m-1 btn btn-sm bg-red-700 hover:bg-red-900 text-gray-200'
                                        onClick={()=>{
                                            setDeleteProp({
                                                id: item.id, 
                                                nama_lokasi: item.nama_lokasi
                                            });
                                            document.getElementById('deleteModal').showModal();
                                        }}
                                    >
                                        <AiFillDelete />
                                        Delete
                                    </DangerButton>
                                </td>
                            </tr>
                        )
                    })
                    : <div>Data Tidak Ditemukan</div>
                    }
                    </tbody>
                </table>

                <div className="p-5 flex items-center justify-center gap-2">
                    <Link href={props.data_ketahanan_pangan.prev_page_url}><AiOutlineLeft/></Link>
                    <Link href={props.data_ketahanan_pangan.first_page_url} className="px-3 bg-gray-300 rounded-md">First</Link>

                    {page[0]!=null && page.map(page=>{
                        return <Link href={page.url} key={page.label} className={`${page.active && 'bg-gray-400 text-white px-2 py-0.5 rounded-md'} mx-1`}>{page.label}</Link>
                    })}
                    
                    <Link href={props.data_ketahanan_pangan.last_page_url} className="px-3 bg-gray-300 rounded-md">Last</Link>
                    <Link href={props.data_ketahanan_pangan.next_page_url}><AiOutlineRight/></Link>
                </div>

                <dialog id='addModal' className='modal p-0 m-0 w-full h-full'>
                    <div className="modal-box m-0 p-0 w-full">
                        <AddPangan />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
                
                <dialog id='editModal' className='modal p-0 m-0 w-full h-full'>
                    <div className="modal-box m-0 p-0 w-full">
                        {/* <EditStunting defaultData={editItem} /> */}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={()=>setEditItem(null)}>close</button>
                    </form>
                </dialog>

                <dialog id="deleteModal" className="modal">
                    <div className="modal-box">
                        <p className="py-4">Apakah Anda yakin ingin menghapus data ini?</p>
                        <div className="w-full flex justify-end">
                            <button className='btn bg-red-700 hover:bg-red-900 mr-5 text-gray-200'
                                id='deleteAllButton'
                                onClick={()=>Inertia.delete(`/ketahanan_pangan/${deleteProp.id}`, deleteProp)}
                            >Delete</button>
                            <button className='btn' onClick={()=>document.getElementById('deleteModal').close()}>Cancel</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="deleteAllModal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Peringatan!</h3>
                        <p className="py-4">Apakah Anda yakin ingin menghapus semua data?</p>
                        <div className="w-full flex justify-end">
                            <button className='btn bg-red-700 hover:bg-red-900 mr-5 text-gray-200'
                                id='deleteAllButton'
                                onClick={()=>{Inertia.delete('/ketahanan_pangan')}}
                                disabled={disableDelete}
                            >Delete</button>
                            <button className='btn' onClick={()=>document.getElementById('deleteAllModal').close()}>Cancel</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

            </div>
        </Authenticated>
    )
}

export default index;