import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  startColor: string;
  endColor: string;
};

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['/api/banner'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? banners?.length - 1 : prev - 1));
  };
  
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Auto rotate slides
  useEffect(() => {
    if (banners?.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners?.length]);
  
  if (isLoading) {
    return (
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="relative rounded-xl overflow-hidden">
            <div className="h-64 md:h-96 bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!banners?.length) return null;


  console.log('all-banners',banners)
  
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden">
          {banners?.map((banner: Banner, index: number) => (
            <div 
              key={banner?.id} 
              className={cn(
                "banner-slide",
                index === currentSlide ? "block" : "hidden"
              )}
            >
              <div 
                className="relative h-[500px] rounded-xl overflow-hidden flex items-center"
                style={{ 
                  background: `linear-gradient(to right, ${banner?.startColor}, ${banner?.endColor})` 
                }}
              >
                <div className="absolute inset-0 ">
                  <img 
                    src={banner?.image_url} 
                    alt={banner.title} 
                    className="w-full h-full object-fit"
                  />
                </div>
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-white">
                 
                </div>
              </div>
            </div>
          ))}
          
          {/* Banner Navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {banners?.map((_: any, index: number) => (
              <button 
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full bg-white transition-opacity",
                  index === currentSlide ? "opacity-100" : "opacity-50"
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Banner Controls */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center hover:bg-opacity-50 transition"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center hover:bg-opacity-50 transition"
            onClick={handleNextSlide}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
