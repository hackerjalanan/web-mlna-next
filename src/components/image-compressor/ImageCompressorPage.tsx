"use client";


import UploadZone from "./UploadZone";
import PreviewComparison from "./PreviewComparison";
import CompressionOptions from "./CompressionOptions";
import ActionButtons from "./ActionButtons";

import {useImageCompressor} from "./hooks/useImageCompressor";


export default function ImageCompressorPage(){


const compressor=useImageCompressor();



return (

<div className="space-y-6">


{
!compressor.originalPreview ?

<UploadZone
 fileInputRef={compressor.fileInputRef}
 loadFile={compressor.loadFile}
/>


:

<>


<PreviewComparison
 {...compressor}
/>



<CompressionOptions
 {...compressor}
/>



<ActionButtons
 {...compressor}
/>


</>


}


</div>

)

}