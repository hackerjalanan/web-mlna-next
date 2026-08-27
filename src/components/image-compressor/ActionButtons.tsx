"use client";


import {
FaDownload,
FaArrowRotateRight
} from "react-icons/fa6";


import {FORMAT_OPTIONS} from "./constants";


export default function ActionButtons({

compress,

isCompressing,

compressedUrl,

format,

originalFile,

setOriginalPreview,

setCompressedUrl,

setCompressedSize,

fileInputRef


}:any){



const download=()=>{


if(!compressedUrl)return;


const ext=
FORMAT_OPTIONS.find(
x=>x.value===format
)?.ext ?? "jpg";


const name=
originalFile?.name.replace(/\.[^.]+$/,"")
||
"image";



const a=document.createElement("a");

a.href=compressedUrl;

a.download=
`${name}-compressed.${ext}`;


a.click();

};




const reset=()=>{

setOriginalPreview(null);

setCompressedUrl(null);

setCompressedSize(0);


if(fileInputRef.current)
fileInputRef.current.value="";


};



return (

<div className="flex gap-3">


<button

onClick={compress}

disabled={isCompressing}

className="
flex-1 rounded-sm bg-cyan-400
px-4 py-3 text-sm font-semibold
text-slate-950
"

>


<FaArrowRotateRight
className={
isCompressing
?"animate-spin inline"
:"inline"
}
/>


{" "}

{
isCompressing
?"Compressing..."
:"Compress"
}


</button>



{
compressedUrl &&

<button

onClick={download}

className="
flex gap-2 items-center
border border-cyan-400/40
px-4 py-3 text-cyan-400
"

>

<FaDownload/>

Download

</button>

}




<button

onClick={reset}

className="
border border-white/10 px-4
text-slate-400
"

>

Reset

</button>


</div>

)

}