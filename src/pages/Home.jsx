const Home = () => {
    return (
        <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 transition-all duration-500 ease-in-out">
            <div className="relative z-10 text-center px-6 max-w-3xl space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold">Stay Organized, Stay Productive</h1>
                <p className="text-lg text-gray-300">Simplify your workflow with our smart task management system.</p>
                <div className="flex justify-center gap-6 mt-6">
                    <a href="/register" className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition text-white font-semibold shadow-lg">Get Started</a>
                    <a href="/login" className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 transition text-white font-semibold shadow-lg">Login</a>
                </div>
            </div>
        </div>
    );
};

export default Home;