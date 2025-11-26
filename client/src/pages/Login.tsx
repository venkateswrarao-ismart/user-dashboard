import LoginModal from "@/components/auth/LoginModal";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsLoginModalOpen(false);
    navigate('/'); // Redirect to home after closing
  };

  const handleShowRegister = () => {
    setIsLoginModalOpen(false);
    navigate('/register'); // Navigate to register page
  };

  return (
    <>
      <Helmet>
        <title>Sign In | MultiVendor Marketplace</title>
        <meta name="description" content="Sign in to your account to continue shopping" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img
                src="/rent-xp.png"
                alt="RentXP"
                className="h-16 mx-auto mb-4"
              />
            </Link>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-blue-500"
              >
                Create one here
              </Link>
            </p>
          </div>
          
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={handleClose}
            onShowRegister={handleShowRegister}
          />
        </div>
      </div>
    </>
  );
};

export default Login;