"use client";

type Props = {
  data: unknown;
  metal: string;
};

export default function MetalChart({ metal }: Props) {
  return (
    <div className="h-64 flex items-center justify-center border rounded">
      <span className="text-sm text-muted-foreground">
        Charts temporarily disabled
      </span>
    </div>
  );
}
