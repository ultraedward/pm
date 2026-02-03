import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type EmailLog = {
  id: string;
  subject: string;
  to: string;
  status: string;
  createdAt: string;
};

export default async function AlertActivityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/email-logs`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-6">Failed to load email activity</div>;
  }

  const logs: EmailLog[] = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Alert Activity</h1>

      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Recipient</th>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Sent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-2">{log.to}</td>
                <td className="p-2">{log.subject}</td>
                <td className="p-2 capitalize">{log.status}</td>
                <td className="p-2">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No email activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}