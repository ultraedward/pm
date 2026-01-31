import AlertForm from "./AlertForm";

export default function NewAlertPage() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Alert</h1>
      <AlertForm />
    </main>
  );
}