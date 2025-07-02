"use client"
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {

   const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    setIsClicked(true);
    signOut();
   
  };

  const confirmSignOut = () => {
    // Add your sign out logic here
    console.log('User signed out!');
    setShowConfirm(false);
    // Simulate sign out process
    setTimeout(() => {
      alert('Successfully signed out!');
    }, 500);
  };

  const cancelSignOut = () => {
    setShowConfirm(false);
  };

  const { signOut } = useAuthActions();
  return(
    <div>
      hi i am home and you are login page

       <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700">Morphing</h4>
            <button
              onClick={handleSignOut}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
              <div className="relative flex items-center space-x-2">
                <LogOut className={`w-5 h-5 transition-all duration-500 ${isHovered ? 'rotate-180 scale-110' : ''}`} />
                <span className="transition-all duration-300">
                  {isHovered ? 'Goodbye!' : 'Sign Out'}
                </span>
              </div>
            </button>
          </div>
        </div>
   
  )
}
