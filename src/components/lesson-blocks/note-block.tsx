type NoteBlockProps = {
  title: string;
  content: string;
};

export default function NoteBlock({ title, content }: NoteBlockProps) {
  return (
    <section className="rounded-xl border-l-4 border-black bg-white p-6 shadow-sm">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <p className="leading-7 text-gray-700">{content}</p>
    </section>
  );
}
