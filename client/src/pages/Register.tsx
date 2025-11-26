import RegisterModal from "@/components/auth/RegisterModal";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Register = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsRegisterModalOpen(false);
    navigate('/'); // Redirect to home after closing
  };

  const handleShowLogin = () => {
    setIsRegisterModalOpen(false);
    navigate('/login'); // Navigate to login page
  };

  return (
    <>
      <Helmet>
        <title>Create Account | MultiVendor Marketplace</title>
        <meta name="description" content="Create a new account to start shopping from multiple vendors" />
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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
          
          <RegisterModal 
            isOpen={isRegisterModalOpen} 
            onClose={handleClose}
            onShowLogin={handleShowLogin}
          />
        </div>
      </div>
    </>
  );
};

export default Register;