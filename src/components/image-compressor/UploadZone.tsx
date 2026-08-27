"use client";

import {useState} from "react";
import {FaUpload} from "react-icons/fa6";


interface Props {

 fileInputRef:any;

 loadFile:(file:File)=>void;

}


export default function UploadZone({
 fileInputRef,
 loadFile
}:Props){


const [drag,setDrag]=useState(false);



const drop=(e:React.DragEvent)=>{

 e.preventDefault();

 setDrag(false);

 const file=e.dataTransfer.files[0];

 if(file)
   loadFile(file);

};



return (

<div

onDragOver={(e)=>{
 e.preventDefault();
 setDrag(true);
}}

onDragLeave={()=>setDrag(false)}

onDrop={drop}

onClick={()=>fileInputRef.current?.click()}

className={`
flex cursor-pointer flex-col items-center justify-center
gap-3 rounded-sm border-2 border-dashed p-12
text-center transition

${drag
?"border-cyan-400 bg-cyan-400/5"
:"border-white/10 hover:border-cyan-400/30"
}

`}

>


<div className="
flex h-12 w-12 items-center justify-center
rounded-full bg-cyan-400/10 text-cyan-400
">

<FaUpload/>

</div>


<p className="text-sm text-white">
Klik atau drag gambar/PDF
</p>



<input

ref={fileInputRef}

type="file"

accept="image/*,.pdf"

className="hidden"

onChange={(e)=>{

const file=e.target.files?.[0];

if(file)
loadFile(file);

}}

/>


</div>

)

}