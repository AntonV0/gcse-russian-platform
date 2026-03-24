type VocabularyItem = {
  russian: string;
  english: string;
};

type VocabularyBlockProps = {
  title: string;
  items: VocabularyItem[];
};

export default function VocabularyBlock({ title, items }: VocabularyBlockProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.russian}
            className="flex flex-col justify-between gap-1 border-b pb-3 last:border-b-0 last:pb-0 md:flex-row"
          >
            <span className="font-medium">{item.russian}</span>
            <span className="text-gray-600">{item.english}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
