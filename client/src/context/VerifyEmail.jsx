import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useApi } from "./ApiContext";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [isSuccess, setIsSuccess] = useState(null);
  const { API_URL } = useApi();

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/verify/${token}`)
      .then(() => {
        setStatus("Email verified successfully!");
        setIsSuccess(true);
      })
      .catch(() => {
        setStatus("Invalid or expired token.");
        setIsSuccess(false);
      });
  }, [token, API_URL]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white/80 border border-white/20 p-8 rounded-2xl shadow-2xl backdrop-blur-sm text-center w-full max-w-md">
        {isSuccess === null ? (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-700 text-lg font-medium mt-4">{status}</p>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-green-600 text-xl font-semibold mt-4">{status}</p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <p className="text-red-600 text-xl font-semibold mt-4">{status}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
