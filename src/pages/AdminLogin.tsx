import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signIn, signUp, resetPassword } from "../services/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password);
        toast.success("Account created successfully!");
        navigate("/admin");
      } else {
        await signIn(formData.email, formData.password);
        toast.success("Logged in successfully!");
        navigate("/admin");
      }
    } catch (error: any) {
      // Better error handling
      const errorMessage = error?.message || "";
      if (errorMessage.includes("password")) {
        toast.error(isSignUp 
          ? "Password must be at least 6 characters long" 
          : "Invalid email or password");
      } else if (errorMessage.includes("email") || errorMessage.includes("user") || errorMessage.includes("already")) {
        toast.error(isSignUp 
          ? "Email already exists or is invalid" 
          : "Invalid email or password");
      } else {
        toast.error(isSignUp ? "Failed to create account. Please try again." : "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      await resetPassword(forgotPasswordEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset email. Please try again.");
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              Enter your email to reset your password
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? "Set up your admin account" : "Access your admin dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (isSignUp ? "Creating Account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
