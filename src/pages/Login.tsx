import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, Mail, ArrowRight, Layout } from 'lucide-react';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const onSubmit = async (data: LoginForm) => {
        try {
            await loginUser(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    const features = [
        "Real-time collaboration",
        "Task prioritization",
        "Team dashboard",
        "Due date tracking"
    ];

    return (
        <div className="min-h-screen flex text-white" style={{ backgroundColor: '#0a0b14' }}>
            {/* Left Side - Branding & Info */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center p-12" style={{ backgroundColor: '#12141c' }}>
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.15),_transparent_40%)] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(168,85,247,0.15),_transparent_40%)] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-2 rounded-lg bg-[rgba(99,102,241,0.2)]">
                            <Layout className="w-6 h-6 text-[#6366f1]" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                    </div>

                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Collaborate on tasks, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-purple-500">
                            in real-time.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg mb-12 max-w-md">
                        Streamline your team's workflow with powerful task management and instant updates.
                    </p>

                    <div className="space-y-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#6366f1]" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ backgroundColor: '#0a0b14' }}>
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                        <p className="text-gray-400">Enter your credentials to access your workspace</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    {...register('email')}
                                    className="w-full text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                                    style={{ backgroundColor: '#131520', borderColor: '#2d303e', borderWidth: '1px' }}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                                    style={{ backgroundColor: '#131520', borderColor: '#2d303e', borderWidth: '1px' }}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#6366f1] to-purple-600 hover:opacity-90 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#6366f1] hover:text-[#4f46e5] font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
