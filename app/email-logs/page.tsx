export const dynamic = "force-dynamic";

export default function EmailLogsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Email Logs</h1>

      <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        Email logging is not enabled yet.
      </div>

      <div className="text-gray-600 text-sm">
        This feature will be available once an <code>EmailLog</code> model is
        added to the database schema and migrated.
      </div>
    </div>
  );
}
