
import { Link } from "wouter";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    brand?: string;
    category?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-4">
          <img 
            src={product.image_url || 'https://via.placeholder.com/400'} 
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-4">
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
            ₹{product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
