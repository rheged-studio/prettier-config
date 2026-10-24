export const Badge = ({active}:{active:boolean}) => <span className="text-sm px-2 inline-flex bg-blue-600 text-white rounded">{cn("p-2 flex mt-1", active && "font-bold block")}{clsx("p-1 block ml-2")}</span>
declare function cn(...classes: unknown[]): string
declare function clsx(...classes: unknown[]): string
