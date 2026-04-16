type Item = {
  label: string;
  value: React.ReactNode;
};

export default function DetailList({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <span className="font-medium">{item.label}:</span> {item.value}
        </div>
      ))}
    </div>
  );
}
