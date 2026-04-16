import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";

type Item = {
  href: string;
  label: string;
};

export default function BackNav({ items }: { items: Item[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <Button key={i} href={item.href} variant="quiet" icon={appIcons.back}>
          {item.label}
        </Button>
      ))}
    </div>
  );
}
