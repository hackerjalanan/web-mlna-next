"use client";


import {useState,useRef,useCallback} from "react";
import jsPDF from "jspdf";

import {OutputFormat} from "../types";
import {canvasToBlob,blobToDataUrl} from "../utils";



export function useImageCompressor(){


const fileInputRef = useRef<HTMLInputElement>(null);


const [originalFile,setOriginalFile]=useState<File|null>(null);

const [originalPreview,setOriginalPreview]=useState<string|null>(null);

const [compressedUrl,setCompressedUrl]=useState<string|null>(null);


const [originalSize,setOriginalSize]=useState(0);

const [compressedSize,setCompressedSize]=useState(0);


const [quality,setQuality]=useState(.7);

const [maxWidth,setMaxWidth]=useState(1920);


const [format,setFormat]=useState<OutputFormat>(
 "image/jpeg"
);


const [isCompressing,setIsCompressing]=useState(false);


const [originalDimensions,setOriginalDimensions]=useState({
 width:0,
 height:0
});


const [compressedDimensions,setCompressedDimensions]=useState({
 width:0,
 height:0
});



const loadFile=useCallback((file:File)=>{


if(
 !file.type.startsWith("image/")
 &&
 file.type!=="application/pdf"
)
return;



setOriginalFile(file);

setOriginalSize(file.size);

setCompressedUrl(null);



const url=URL.createObjectURL(file);

setOriginalPreview(url);



const img=new Image();


img.onload=()=>{

setOriginalDimensions({
 width:img.width,
 height:img.height
});


setMaxWidth(prev=>Math.min(prev,img.width));

};


img.src=url;



},[]);





const compress=async()=>{

if(!originalPreview)return;


setIsCompressing(true);


try{


const img=new Image();

img.src=originalPreview;


await new Promise(r=>img.onload=r);



let width=img.width;
let height=img.height;



if(width>maxWidth){

height=Math.round(
(height*maxWidth)/width
);

width=maxWidth;

}



const canvas=document.createElement("canvas");


canvas.width=width;

canvas.height=height;


const ctx=canvas.getContext("2d");


if(!ctx)return;



if(format==="image/jpeg"||format==="application/pdf"){

ctx.fillStyle="#fff";

ctx.fillRect(
0,
0,
width,
height
);

}



ctx.drawImage(img,0,0,width,height);



if(format==="application/pdf"){


const blob=await canvasToBlob(
canvas,
"image/jpeg",
quality
);


if(!blob)return;


const data=await blobToDataUrl(blob);



const pdf=new jsPDF({

orientation:
width>height
?"landscape"
:"portrait",

unit:"px",

format:[width,height]

});



pdf.addImage(
data,
"JPEG",
0,
0,
width,
height
);



const pdfBlob=pdf.output("blob");


const url=URL.createObjectURL(pdfBlob);


setCompressedUrl(url);

setCompressedSize(pdfBlob.size);


}


else{


canvas.toBlob(blob=>{


if(!blob)return;


const url=URL.createObjectURL(blob);


setCompressedUrl(url);

setCompressedSize(blob.size);



},
format,
format==="image/png"
?undefined
:quality
);



}


}
finally{

setIsCompressing(false);

}


}



return {

fileInputRef,

originalFile,

originalPreview,

compressedUrl,

originalSize,

compressedSize,

quality,
setQuality,

maxWidth,
setMaxWidth,

format,
setFormat,


originalDimensions,

compressedDimensions,


isCompressing,


loadFile,

compress,


setOriginalPreview,

setCompressedUrl,

setCompressedSize

};


}