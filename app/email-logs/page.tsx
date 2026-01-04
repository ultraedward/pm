import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function EmailLogsPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Not authenticated
      </div>
    );
  }

  const logs = await prisma.emailLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Email Logs</h1>

      {logs.length === 0 && (
        <p className="text-sm text-gray-500">No email activity yet.</p>
      )}

      <ul className="space-y-2 text-sm">
        {logs.map((log) => (
          <li
            key={log.id}
            className="border rounded px-3 py-2 flex justify-between"
          >
            <span>
              {new Date(log.createdAt).toLocaleString()}
            </span>
            <span
              className={
                log.status === "sent"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {log.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
