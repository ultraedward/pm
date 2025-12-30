import { getCurrentUser } from "../../lib/auth";

export default async function AdminOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return <>{children}</>;
}
