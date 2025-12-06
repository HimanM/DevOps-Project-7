export const dynamic = 'force-dynamic';

export default async function Home() {
  const backendUrl = process.env.BACKEND_URL || "http://backend:8080";
  let backendMessage = "Waiting for response...";
  let isError = false;

  try {
    const res = await fetch(backendUrl, { cache: "no-store" });
    if (res.ok) {
      backendMessage = await res.text();
    } else {
      backendMessage = `Error: ${res.status} ${res.statusText}`;
      isError = true;
    }
  } catch (error) {
    backendMessage = "Failed to connect to backend.";
    isError = true;
    console.error("Backend fetch error:", error);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <main className="flex flex-col items-center gap-8 text-center bg-gray-800 p-12 rounded-xl border border-gray-700 shadow-2xl max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          DevOps Project 7
        </h1>

        <div className="w-full space-y-4">
          <h2 className="text-2xl font-semibold text-gray-300">Backend Status</h2>

          <div className={`p-6 rounded-lg border-2 ${isError ? "border-red-500/50 bg-red-900/20" : "border-green-500/50 bg-green-900/20"} transition-all duration-300`}>
            <p className={`text-xl font-mono ${isError ? "text-red-400" : "text-green-400"}`}>
              {backendMessage}
            </p>
          </div>

          <p className="text-sm text-gray-500 font-mono mt-4">
            Target: {backendUrl}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <span className="block text-sm text-gray-400">Environment</span>
            <span className="font-medium text-blue-300">{process.env.NODE_ENV}</span>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <span className="block text-sm text-gray-400">Time</span>
            <span className="font-medium text-blue-300">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
