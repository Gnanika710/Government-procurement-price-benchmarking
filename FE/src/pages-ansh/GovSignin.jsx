import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
// import OAuth from '../components/OAuth';

export default function GovSignin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/govOfficial-dashboard');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="p-6 max-w-md w-full bg-light rounded-lg shadow-lg">
        <h1 className="text-3xl text-center font-semibold mb-7 text-dark">Government Officials Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       <div>
       <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
                Enter Your Email
              </label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 text-dark p-3 min-w-full rounded-lg border border-middle focus:outline-none focus:ring-2 focus:ring-middle"
            onChange={handleChange}
          />
       </div>
           <div>
           <label htmlFor="password" className="block text-sm font-medium text-gray-700 ">
                Enter Your Password
              </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 text-dark p-3 min-w-full rounded-lg border border-middle focus:outline-none focus:ring-2 focus:ring-middle"
            onChange={handleChange}
          />
           </div>
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-600 transition duration-300 disabled:bg-opacity-70"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p className="text-dark">Don't have an account?</p>
          <Link to="/govOfficial-signup">
            <span className="text-blue-500">Sign up</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5 text-center">
          {/* {error ? error.message || 'Something went wrong!' : ''} */}
        </p>
      </div>
    </div>
  );
}
