export function formatBytes(bytes:number){

  if(bytes < 1024)
    return `${bytes} B`;

  if(bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}



export function canvasToBlob(
 canvas:HTMLCanvasElement,
 type:string,
 quality?:number
):Promise<Blob|null>{

 return new Promise(resolve=>{
   canvas.toBlob(resolve,type,quality);
 });

}



export function blobToDataUrl(blob:Blob):Promise<string>{

 return new Promise((resolve,reject)=>{

   const reader=new FileReader();

   reader.onload=()=>{
     resolve(reader.result as string);
   };

   reader.onerror=reject;

   reader.readAsDataURL(blob);

 });

}