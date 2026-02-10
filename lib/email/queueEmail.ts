export async function queueEmail() {
  return {
    skipped: true,
    reason: "Email logging disabled",
  };
}