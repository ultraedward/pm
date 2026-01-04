import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function EmailLogsPage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold">Email Logs</h1>
        <p className="text-sm text-gray-500 mt-2">Not signed in</p>
      </div>
    );
  }

  const logs = await prisma.emailLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      subject: true,
      to: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Email Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Delivery history for alert notifications
        </p>
      </div>

      {logs.length === 0 && (
        <p className="text-sm text-gray-500">No emails sent yet.</p>
      )}

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="font-medium">{log.subject}</div>
              <div className="text-xs text-gray-500">
                To: {log.to}
              </div>
              <div className="text-xs text-gray-400">
                {log.createdAt.toLocaleString()}
              </div>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                log.status === "sent"
                  ? "text-green-700 border-green-300"
                  : "text-red-600 border-red-300"
              }`}
            >
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
