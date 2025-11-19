// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// type Banner = {
//   id: number;
//   title: string;
//   subtitle: string;
//   buttonText: string;
//   buttonLink: string;
//   imageUrl: string;
//   startColor: string;
//   endColor: string;
// };

// const HeroBanner = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
  
//   const { data: banners = [], isLoading } = useQuery({
//     queryKey: ['/api/banner'],
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
  
//   const handlePrevSlide = () => {
//     setCurrentSlide(prev => (prev === 0 ? banners?.length - 1 : prev - 1));
//   };
  
//   const handleNextSlide = () => {
//     setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
//   };
  
//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//   };
  
//   // Auto rotate slides
//   useEffect(() => {
//     if (banners?.length <= 1) return;
    
//     const interval = setInterval(() => {
//       setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [banners?.length]);
  
//   if (isLoading) {
//     return (
//       <section className="bg-white">
//         <div className="container mx-auto px-4 py-8">
//           <div className="relative rounded-xl overflow-hidden">
//             <div className="h-64 md:h-96 bg-gray-200 animate-pulse rounded-xl"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }
  
//   if (!banners?.length) return null;


//   console.log('all-banners',banners)
  
//   return (
//     <section className="bg-white">
//       <div className="container mx-auto px-4 py-8">
//         <div className="relative rounded-xl overflow-hidden">
//           {banners?.map((banner: Banner, index: number) => (
//             <div 
//               key={banner?.id} 
//               className={cn(
//                 "banner-slide",
//                 index === currentSlide ? "block" : "hidden"
//               )}
//             >
//               <div 
//                 className="relative h-[500px] rounded-xl overflow-hidden flex items-center"
//                 style={{ 
//                   background: `linear-gradient(to right, ${banner?.startColor}, ${banner?.endColor})` 
//                 }}
//               >
//                 <div className="absolute inset-0 ">
//                   <img 
//                     src={banner?.image_url} 
//                     alt={banner.title} 
//                     className="w-full h-full object-fit"
//                   />
//                 </div>
//                 <div className="container mx-auto px-6 md:px-12 relative z-10 text-white">
                 
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {/* Banner Navigation */}
//           <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
//             {banners?.map((_: any, index: number) => (
//               <button 
//                 key={index}
//                 className={cn(
//                   "w-3 h-3 rounded-full bg-white transition-opacity",
//                   index === currentSlide ? "opacity-100" : "opacity-50"
//                 )}
//                 onClick={() => goToSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
          
//           {/* Banner Controls */}
//           <button 
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center hover:bg-opacity-50 transition"
//             onClick={handlePrevSlide}
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={20} />
//           </button>
//           <button 
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center hover:bg-opacity-50 transition"
//             onClick={handleNextSlide}
//             aria-label="Next slide"
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroBanner;

// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// const videoSlides = [
//   { id: 1, src: "/game-video-1.mp4" },
//   { id: 2, src: "/game-video-2.mp4" },
//   { id: 3, src: "/game-video-3.mp4" },
// ];

// const HeroBanner = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === 0 ? videoSlides.length - 1 : prev - 1
//     );
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === videoSlides.length - 1 ? 0 : prev + 1
//     );
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === videoSlides.length - 1 ? 0 : prev + 1
//       );
//     }, 8000); // 8 sec
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-white">
//       <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
//         <div className="relative overflow-hidden rounded-xl">

//           {/* 🎬 VIDEO SLIDES */}
//           {videoSlides.map((video, index) => (
//             <div
//               key={video.id}
//               className={cn(
//                 "transition-all duration-500",
//                 index === currentSlide ? "block" : "hidden"
//               )}
//             >
//               <video
//                 src={video.src}
//                 className="
//                   w-full 
//                   h-[200px]          /* MOBILE */
//                   sm:h-[280px]       /* SMALL TAB */
//                   md:h-[350px]       /* TABLET */
//                   lg:h-[450px]       /* DESKTOP */
//                   xl:h-[520px]       /* LARGE DESKTOP */
//                   object-cover 
//                   rounded-xl
//                 "
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//               />
//             </div>
//           ))}

//           {/* 🔄 CONTROLS */}
//           <button
//             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
//                      w-7 h-7 sm:w-9 sm:h-9 rounded-full 
//                      bg-black/30 hover:bg-black/50 text-white 
//                      flex items-center justify-center transition"
//             onClick={handlePrevSlide}
//           >
//             <ChevronLeft size={18} />
//           </button>

//           <button
//             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
//                      w-7 h-7 sm:w-9 sm:h-9 rounded-full 
//                      bg-black/30 hover:bg-black/50 text-white 
//                      flex items-center justify-center transition"
//             onClick={handleNextSlide}
//           >
//             <ChevronRight size={18} />
//           </button>

//           {/* ⚪ INDICATORS */}
//           <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
//             {videoSlides.map((_, i) => (
//               <button
//                 key={i}
//                 className={cn(
//                   "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition",
//                   currentSlide === i ? "bg-white" : "bg-white/60"
//                 )}
//                 onClick={() => setCurrentSlide(i)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroBanner;
// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// const videoSlides = [
//   { id: 1, src: "/game-video-1.mp4" },
//   { id: 2, src: "/game-video-2.mp4" },
//   { id: 3, src: "/game-video-3.mp4" },
// ];

// const HeroBanner = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === 0 ? videoSlides.length - 1 : prev - 1
//     );
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === videoSlides.length - 1 ? 0 : prev + 1
//     );
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === videoSlides.length - 1 ? 0 : prev + 1
//       );
//     }, 8000); // 8 sec
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-white">
//       <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
//         <div className="relative overflow-hidden rounded-xl">

//           {/* 🎬 VIDEO SLIDES */}
//           {videoSlides.map((video, index) => (
//             <div
//               key={video.id}
//               className={cn(
//                 "transition-all duration-500",
//                 index === currentSlide ? "block" : "hidden"
//               )}
//             >
//               <video
//                 src={video.src}
//                 className="w-full h-[80px] sm:h-[400px] md:h-[500px] object-cover rounded-xl"
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//               />
//             </div>
//           ))}

//           {/* 🔄 CONTROLS */}
//           <button
//             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
//             onClick={handlePrevSlide}
//           >
//             <ChevronLeft size={20} />
//           </button>

//           <button
//             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
//             onClick={handleNextSlide}
//           >
//             <ChevronRight size={20} />
//           </button>

//           {/* ⚪ INDICATOR DOTS */}
//           <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
//             {videoSlides.map((_, i) => (
//               <button
//                 key={i}
//                 className={cn(
//                   "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition",
//                   currentSlide === i ? "bg-white" : "bg-white/60"
//                 )}
//                 onClick={() => setCurrentSlide(i)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroBanner;

// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// const videoSlides = [
//   { id: 1, src: "/game-video-1.mp4" },
//   { id: 2, src: "/game-video-2.mp4" },
//   { id: 3, src: "/game-video-3.mp4" },
// ];

// const HeroBanner = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === 0 ? videoSlides.length - 1 : prev - 1
//     );
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === videoSlides.length - 1 ? 0 : prev + 1
//     );
//   };

//   // Auto Slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === videoSlides.length - 1 ? 0 : prev + 1
//       );
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-white flex justify-center">
//       <div className="w-full sm:w-[80%] md:w-[70%] mx-auto py-6">
//         <div className="relative overflow-hidden rounded-xl shadow-lg">

//           {/* 🎬 VIDEO SLIDES */}
//           {videoSlides.map((video, index) => (
//             <div
//               key={video.id}
//               className={cn(
//                 "transition-all duration-500",
//                 index === currentSlide ? "block" : "hidden"
//               )}
//             >
//               <video
//                 src={video.src}
//                 className="
//                   w-full
//                   h-[130px] sm:h-[300px] md:h-[380px] lg:h-[450px]
//                   object-cover rounded-xl
//                 "
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//               />
//             </div>
//           ))}

//           {/* ✨ CAPTION OVERLAY */}
//           <div
//             className="
//               absolute inset-0 flex items-center justify-center 
//               bg-black/40 text-white text-center 
//               animate-fade-in
//             "
//           >
//             <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-wide px-4">
//               Experience the <span className="text-blue-400">Gaming Power</span> with <span className="text-yellow-400">RentXP</span>
//             </h2>
//           </div>

//           {/* 🔄 CONTROLS */}
//           <button
//             className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
//             onClick={handlePrevSlide}
//           >
//             <ChevronLeft size={20} />
//           </button>

//           <button
//             className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
//             onClick={handleNextSlide}
//           >
//             <ChevronRight size={20} />
//           </button>

//           {/* ⚪ INDICATOR DOTS */}
//           <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
//             {videoSlides.map((_, i) => (
//               <button
//                 key={i}
//                 className={cn(
//                   "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition",
//                   currentSlide === i ? "bg-white" : "bg-white/60"
//                 )}
//                 onClick={() => setCurrentSlide(i)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 🔥 CUSTOM FADE-IN ANIMATION */}
//       <style>
//         {`
//           @keyframes fade-in {
//             0% { opacity: 0; transform: translateY(10px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }
//           .animate-fade-in {
//             animation: fade-in 1s ease-in-out;
//           }
//         `}
//       </style>
//     </section>
//   );
// };

// export default HeroBanner;

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const videoSlides = [
  { id: 1, src: "/game-video-1.mp4" },
  { id: 2, src: "/game-video-2.mp4" },
  { id: 3, src: "/game-video-3.mp4" },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? videoSlides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === videoSlides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === videoSlides.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white flex justify-center">
      {/* 📌 WIDTH FIXED TO 90% */}
      <div className="w-[90%] mx-auto py-6">
        <div className="relative overflow-hidden rounded-xl shadow-lg">

          {/* 🎬 VIDEO SLIDES */}
          {videoSlides.map((video, index) => (
            <div
              key={video.id}
              className={cn(
                "transition-all duration-500",
                index === currentSlide ? "block" : "hidden"
              )}
            >
              <video
                src={video.src}
                className="
                  w-full
                  h-[155px] sm:h-[280px] md:h-[300px] lg:h-[375px]  /* 🔥 HEIGHT REDUCED 50% */
                  object-cover rounded-xl
                "
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}

          {/* ✨ CAPTION OVERLAY */}
          <div
            className="
              absolute inset-0 flex items-center justify-center 
              bg-black/40 text-white text-center animate-fade-in
            "
          >
            <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-wide px-4">
              Experience the <span className="text-blue-400">Gaming Power</span> with
              <span className="text-yellow-400"> RentXP</span>
            </h2>
          </div>

          {/* 🔄 CONTROLS */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
            onClick={handlePrevSlide}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
            onClick={handleNextSlide}
          >
            <ChevronRight size={18} />
          </button>

          {/* ⚪ INDICATOR DOTS */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {videoSlides.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition",
                  currentSlide === i ? "bg-white" : "bg-white/60"
                )}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 CUSTOM FADE-IN ANIMATION */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-in-out;
          }
        `}
      </style>
    </section>
  );
};

export default HeroBanner;
