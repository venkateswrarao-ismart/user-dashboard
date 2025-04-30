import { Link } from "wouter";
import { Star } from "lucide-react";

type Vendor = {
  id: number;
  userId: number;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  category: string | null;
  status: string;
  averageRating: number | string;
  totalReviews: number;
};

type VendorCardProps = {
  vendor: Vendor;
};

const VendorCard = ({ vendor }: VendorCardProps) => {
  // Generate a gradient based on the category
  const getCategoryGradient = (category?: string) => {
    switch (category) {
      case 'electronics':
        return 'from-blue-500 to-indigo-600';
      case 'fashion':
        return 'from-red-500 to-orange-600';
      case 'home-decor':
        return 'from-green-500 to-teal-600';
      case 'beauty':
        return 'from-purple-500 to-pink-600';
      case 'food':
        return 'from-yellow-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition">
      <div className={`relative h-32 bg-gradient-to-r ${getCategoryGradient(vendor.category)}`}>
        {vendor.coverUrl && (
          <img 
            src={vendor.coverUrl} 
            alt={`${vendor.businessName} Cover`} 
            className="w-full h-full object-cover opacity-50"
          />
        )}
      </div>
      <div className="flex justify-center -mt-10 mb-3">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          {vendor.logoUrl ? (
            <img 
              src={vendor.logoUrl} 
              alt={`${vendor.businessName} Logo`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-lg font-bold">
              {vendor.businessName.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pt-0 pb-5 text-center">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">
          {vendor.businessName}
        </h3>
        <p className="text-gray-500 text-sm mb-3">{vendor.description || 'No description available'}</p>
        <div className="flex items-center justify-center space-x-1 mb-3">
          <Star className="text-yellow-400 h-4 w-4 fill-current" />
          <span className="text-gray-700 font-medium">
            {typeof vendor.averageRating === 'number' 
              ? vendor.averageRating.toFixed(1) 
              : vendor.averageRating || '0.0'
            }
          </span>
          <span className="text-gray-500 text-sm">({vendor.totalReviews} reviews)</span>
        </div>
        <Link href={`/vendor/${vendor.id}`}>
          <a className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition">
            View Shop
          </a>
        </Link>
      </div>
    </div>
  );
};

export default VendorCard;
