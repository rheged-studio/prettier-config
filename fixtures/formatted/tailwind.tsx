export const Badge = ({ active }: { active: boolean }) => (
  <span className="inline-flex rounded bg-blue-600 px-2 text-sm text-white">
    {cn("mt-1 flex p-2", active && "block font-bold")}
    {clsx("ml-2 block p-1")}
  </span>
);
declare function cn(...classes: unknown[]): string;
declare function clsx(...classes: unknown[]): string;
