export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export function getHeadingTag(level: HeadingLevel): HeadingTag {
  return `h${level}` as HeadingTag;
}

export function Heading({
  level,
  ...props
}: { level: HeadingLevel } & React.HTMLAttributes<HTMLHeadingElement>) {
  switch (level) {
    case 1:
      return <h1 {...props} />;
    case 2:
      return <h2 {...props} />;
    case 3:
      return <h3 {...props} />;
    case 4:
      return <h4 {...props} />;
    case 5:
      return <h5 {...props} />;
    case 6:
    default:
      return <h6 {...props} />;
  }
}
