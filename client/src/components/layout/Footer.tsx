import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Linkedin, Store, Twitter } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would connect to a newsletter API
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Store className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold">MultiVendor</span>
            </div>
            <p className="text-gray-400 mb-4">
              The leading multi-vendor marketplace platform connecting sellers and buyers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition">
                  Categories
                </Link>
              </li>
              {/* <li>
                <Link href="/products?type=vendors" className="text-gray-400 hover:text-white transition">
                  Vendors
                </Link>
              </li> */}
              <li>
                <Link href="/vendor/register" className="text-gray-400 hover:text-white transition">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-white transition">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-l-lg px-4 py-2 w-full focus:outline-none text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p className="text-gray-500 text-sm">By subscribing you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2023 MultiVendor Marketplace. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
