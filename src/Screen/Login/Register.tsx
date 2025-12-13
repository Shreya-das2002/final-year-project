import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6 text-green-600 dark:text-green-300">
          Create Account
        </h2>

        <form className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md border dark:border-gray-700 bg-transparent
            focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md border dark:border-gray-700 bg-transparent
            focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md
            transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/signup" className="text-green-600 dark:text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
