import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/product/ProductCard";
import { Helmet } from "react-helmet";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  selling_price: number;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: string;
  brand: string | null;
  hsn_code: string | null;
  vendor_id: string | null;
  sub_category_id: string | null;
  gst_percentage: number;
  approval_status?: string;
  rejection_reason?: string | null;
  submitted_at?: string;
  approved_at?: string | null;
  updated_by?: string | null;
};

const SimpleProductList = () => {
  // Use direct API query without complex parameters
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  console.log("Simple Products List - Products count:", products.length);

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>All Products | MultiVendor Marketplace</title>
        <meta name="description" content="Browse our collection of products from verified sellers. Find great deals on quality products." />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
      
      {isLoading ? (
        <div className="text-center p-8">
          <p className="text-xl">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-xl">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleProductList;