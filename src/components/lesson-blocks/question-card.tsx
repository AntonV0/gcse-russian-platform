import type { ReactNode } from "react";

type QuestionCardProps = {
  heading?: string;
  instruction?: string;
  prompt: string;
  children: ReactNode;
  feedback?: ReactNode;
};

export default function QuestionCard({
  heading = "Question",
  instruction,
  prompt,
  children,
  feedback,
}: QuestionCardProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{heading}</h2>

          {instruction ? (
            <p className="text-sm font-medium text-gray-600">{instruction}</p>
          ) : null}

          <p className="text-gray-800">{prompt}</p>
        </div>

        <div className="space-y-4">{children}</div>

        {feedback ? <div>{feedback}</div> : null}
      </div>
    </section>
  );
}