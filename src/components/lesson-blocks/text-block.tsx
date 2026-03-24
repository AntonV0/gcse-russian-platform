type TextBlockProps = {
  content: string;
};

export default function TextBlock({ content }: TextBlockProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="leading-7 text-gray-700">{content}</p>
    </section>
  );
}
