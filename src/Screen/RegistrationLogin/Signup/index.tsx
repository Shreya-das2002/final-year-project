import { Link } from "react-router-dom";

const Signup = () => {
  return (
      <div>

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
          <Link to="/registrationlogin/login" className="text-green-600 dark:text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
  );
};

export default Signup;
