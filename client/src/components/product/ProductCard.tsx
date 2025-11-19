
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    brand?: string;
    category?: string;
    selling_price?:string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="w-full sm:w-[300px]">
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer h-full flex flex-col">
    <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
      <img 
        src={product.image_url || 'https://via.placeholder.com/400'} 
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
    <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">{product.description}</p>

    <div className="mt-auto">
      {product.brand && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Brand:</span> {product.brand}
        </div>
      )}
      {product.category && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {product.category}
        </div>
      )}
      <div className="text-lg font-bold text-primary mt-2">
        ₹{product?.selling_price?.toFixed(2)}
      </div>
    </div>
  </div>
</Link>

  );
}

export default ProductCard;
