
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

export function ProductCard({ id, name, price, imageUrl, description }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600">{description}</p>
          <p className="text-lg font-bold mt-2">${(price / 100).toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
