// All users can create unlimited alerts — Pro tier removed.
export async function canCreateAlert(_userId: string) {
  return { allowed: true, remaining: null };
}
