  'use client';

  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { MessageCircle, Sparkles, X } from 'lucide-react';

  import ChatWidget from './sections/ChatWidget';
  import FireworkButton from "@/components/sections/FireworkButton";


  export default function FloatingMenu() {

    const [isOpen, setIsOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);


    return (

      <motion.div

        drag
        dragMomentum={false}

        dragConstraints={{
          top:-600,
          left:-400,
          right:20,
          bottom:20
        }}

        className="
          fixed
          bottom-6
          right-6
          z-[9999]
          flex
          flex-col
          items-end
          gap-3
        "

        style={{
          touchAction:"none"
        }}

      >


        {/* CHAT WINDOW */}
        {showChat && (

          <motion.div

            initial={{
              opacity:0,
              y:20,
              scale:0.9
            }}

            animate={{
              opacity:1,
              y:0,
              scale:1
            }}

          >

            <ChatWidget
              onClose={()=>{
                setShowChat(false);
                setIsOpen(false);
              }}
            />

          </motion.div>

        )}



        {/* MENU LIST */}
        {isOpen && !showChat && (

          <motion.div

            initial={{
              opacity:0,
              y:20
            }}

            animate={{
              opacity:1,
              y:0
            }}

            className="
              flex
              flex-col
              items-end
              gap-3
            "

          >


            {/* CHAT BUTTON */}

            <button

              onClick={()=>{

                setShowChat(true);
                setIsOpen(false);

              }}

              className="
                h-12
                px-4
                flex
                items-center
                gap-2
                rounded-full

                border
                border-cyan-400/20

                bg-slate-900/90

                text-cyan-200

                shadow-xl
                shadow-cyan-500/20

                backdrop-blur-xl

                hover:
                scale-110

                transition
              "

            >

              <MessageCircle size={18}/>

              <span className="text-sm">
                Chat
              </span>

            </button>



            {/* FIREWORK BUTTON */}

            <div>

              <FireworkButton
                inline
                onLaunch={()=>{
                  setIsOpen(false);
                }}
              />

            </div>


          </motion.div>

        )}




        {/* MAIN BUTTON */}

        <button

          onClick={()=>{

            setIsOpen(prev=>!prev);

          }}

          className="
            w-14
            h-14

            rounded-full

            border
            border-cyan-400/20

            bg-slate-900/90

            text-cyan-200

            shadow-xl
            shadow-cyan-500/20

            backdrop-blur-xl

            flex
            items-center
            justify-center

            hover:scale-110

            transition

            cursor-grab
            active:cursor-grabbing
          "

        >

          {
            isOpen

            ?

            <X size={24}/>

            :

            <Sparkles
              size={24}
              className="animate-pulse"
            />

          }


        </button>


      </motion.div>

    );

  }