"use client";

type Props = {
  data: unknown;
  metal: string;
};

export default function MetalChart({ data, metal }: Props) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border rounded">
        No data
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center border rounded">
      <span className="text-sm text-muted-foreground">
        Chart ready ({data.length} points)
      </span>
    </div>
  );
}
