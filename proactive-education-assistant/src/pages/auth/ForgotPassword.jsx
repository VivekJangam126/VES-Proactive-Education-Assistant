import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Forgot Password</h1>
        <p className="text-sm text-slate-600 mb-6">
          Enter your work email and we will send a password reset link.
        </p>

        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            If an account exists for {email}, we have sent a reset link. Please check your inbox.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="educator@school.org"
                className="w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
