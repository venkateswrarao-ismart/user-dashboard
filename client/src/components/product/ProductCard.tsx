
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  vendor: {
    businessName: string;
  };
};

export default function ProductCard({ id, name, price, image, category, vendor }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square overflow-hidden rounded-lg mb-4">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{name}</h3>
            <p className="text-gray-500 text-sm mb-2">{vendor.businessName}</p>
            <p className="font-bold text-lg text-primary">{formatCurrency(price)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
