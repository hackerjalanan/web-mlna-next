import React from "react";

export default function LoginLayout({
 children
}:{
 children: React.ReactNode
}){

 return (
   <main className="
      min-h-screen
      bg-slate-950
      text-white
   ">
      {children}
   </main>
 )

}