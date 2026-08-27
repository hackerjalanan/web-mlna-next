"use client";


import {FaImage,FaFilePdf} from "react-icons/fa6";
import {formatBytes} from "./utils";


export default function PreviewComparison({

originalFile,

originalPreview,

compressedUrl,

originalSize,

compressedSize,

originalDimensions,

compressedDimensions,

format


}:any){


const isPdf =
originalFile?.type==="application/pdf";


return (

<div className="
grid grid-cols-1 gap-4 sm:grid-cols-2
">


<div>

<div className="mb-2 flex justify-between">

<span className="text-xs text-slate-500">
Original
</span>


<span className="text-xs text-slate-400">
{formatBytes(originalSize)}
{" "}
{originalDimensions.width}×{originalDimensions.height}
</span>

</div>



<div className="
overflow-hidden rounded-sm border border-white/10
bg-slate-950/40
">


{
isPdf ?

<iframe
src={originalPreview}
className="h-48 w-full"
/>


:

<img
src={originalPreview}
className="h-48 w-full object-contain"
/>

}



</div>

</div>



<div>


<div className="mb-2 flex justify-between">

<span className="text-xs text-slate-500">
Compressed
</span>


{
compressedUrl &&

<span className="text-xs text-cyan-400">

{formatBytes(compressedSize)}

</span>

}


</div>




<div className="
flex h-48 items-center justify-center
rounded-sm border border-white/10
bg-slate-950/40
">


{
compressedUrl ?

format==="application/pdf"

?

<div className="flex flex-col items-center gap-2 text-cyan-400">

<FaFilePdf size={28}/>

<span className="text-xs">
PDF ready
</span>

</div>


:

<img
src={compressedUrl}
className="h-48 w-full object-contain"
/>


:

<div className="text-slate-600">

<FaImage/>

</div>

}



</div>


</div>



</div>

)

}