// import Categories from "@/components/home/Categories";
// import FeaturedProducts from "@/components/home/FeaturedProducts";
// import HeroBanner from "@/components/home/HeroBanner";
// import VendorRegistrationCTA from "@/components/home/VendorRegistrationCTA";
// import { Helmet } from "react-helmet";
// import { Gamepad2, Truck, RotateCw, ShieldCheck } from "lucide-react"; // 🔥 ICONS

// const Home = () => {
//   return (
//     <>
//       <Helmet>
//         <title>MultiVendor Marketplace - Shop from Multiple Sellers</title>
//         <meta
//           name="description"
//           content="Discover unique products from verified sellers on our multi-vendor marketplace. Shop electronics, fashion, home decor, and more."
//         />
//       </Helmet>

//       <HeroBanner />

//       {/* 🕹️ GAME RENTAL USP SECTION */}
//       <section className="w-[90%] mx-auto my-10 text-center">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide animate-fade-in">
//           Game More, <span className="text-blue-600">Own Less</span>
//         </h2>
//         <p className="text-sm sm:text-base mt-2 text-gray-600 animate-fade-in-delay">
//           Rent the latest consoles, games, and accessories. No commitment, just gaming.
//         </p>

//         {/* 🧠 FEATURES GRID */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
//           {/* CARD 1 */}
//           <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
//             <Gamepad2 className="mx-auto mb-2" size={28} />
//             <h4 className="font-semibold text-gray-800">Latest Gear</h4>
//             <p className="text-xs text-gray-500">
//               Access the newest gaming technology without the hefty price tag.
//             </p>
//           </div>

//           {/* CARD 2 */}
//           <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
//             <Truck className="mx-auto mb-2" size={28} />
//             <h4 className="font-semibold text-gray-800">Free Delivery</h4>
//             <p className="text-xs text-gray-500">
//               Free shipping & returns on rentals above ₹3000.
//             </p>
//           </div>

//           {/* CARD 3 */}
//           <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
//             <RotateCw className="mx-auto mb-2" size={28} />
//             <h4 className="font-semibold text-gray-800">Flexible Returns</h4>
//             <p className="text-xs text-gray-500">
//               Changed your mind? Exchange or return hassle-free.
//             </p>
//           </div>

//           {/* CARD 4 */}
//           <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
//             <ShieldCheck className="mx-auto mb-2" size={28} />
//             <h4 className="font-semibold text-gray-800">Damage Protection</h4>
//             <p className="text-xs text-gray-500">
//               Optional coverage for peace of mind while gaming.
//             </p>
//           </div>
//         </div>
//       </section>

//       <Categories />
//       <FeaturedProducts />
//       <VendorRegistrationCTA />

//       {/* 🔥 ANIMATIONS */}
//       <style>
//         {`
//           @keyframes fade-in { 
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           .animate-fade-in { animation: fade-in 0.8s ease-in-out; }
//           .animate-fade-in-delay { animation: fade-in 1s ease-in-out; }
//         `}
//       </style>
//     </>
//   );
// };

// export default Home;

// Home.tsx
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroBanner from "@/components/home/HeroBanner";
import VendorRegistrationCTA from "@/components/home/VendorRegistrationCTA";
import { Helmet } from "react-helmet";
import { Gamepad2, Truck, RotateCw, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>MultiVendor Marketplace - Shop from Multiple Sellers</title>
        <meta
          name="description"
          content="Discover unique products from verified sellers on our multi-vendor marketplace. Shop electronics, fashion, home decor, and more."
        />
      </Helmet>

      {/* HERO */}
      <HeroBanner />

      {/* GAMING USP */}
      <section className="w-[90%] mx-auto my-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide animate-fade-in">
          Game More, <span className="text-blue-600">Own Less</span>
        </h2>
        <p className="text-sm sm:text-base mt-2 text-gray-600 animate-fade-in-delay">
          Rent the latest consoles, games, and accessories. No commitment, just gaming.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <FeatureCard icon={Gamepad2} title="Latest Gear" desc="Access the newest gaming technology without the hefty price tag." />
          <FeatureCard icon={Truck} title="Free Delivery" desc="Free shipping & returns on rentals above ₹3000." />
          <FeatureCard icon={RotateCw} title="Flexible Returns" desc="Changed your mind? Exchange or return hassle-free." />
          <FeatureCard icon={ShieldCheck} title="Damage Protection" desc="Optional coverage for peace of mind while gaming." />
        </div>
      </section>

      {/* MAIN SECTIONS */}
      <Categories />
      <FeaturedProducts />
      <VendorRegistrationCTA />

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fade-in { 
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.8s ease-in-out; }
          .animate-fade-in-delay { animation: fade-in 1s ease-in-out; }
        `}
      </style>
    </>
  );
};

export default Home;

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
    <Icon className="mx-auto mb-2" size={28} />
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

