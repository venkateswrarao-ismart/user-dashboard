import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import VendorRegistrationCTA from "@/components/home/VendorRegistrationCTA";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>MultiVendor Marketplace - Shop from Multiple Sellers</title>
        <meta name="description" content="Discover unique products from verified sellers on our multi-vendor marketplace. Shop electronics, fashion, home decor, and more." />
      </Helmet>
      
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
      <FeaturedVendors />
      <VendorRegistrationCTA />
    </>
  );
};

export default Home;
