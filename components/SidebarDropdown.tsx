import { ReactNode } from "react";
import Chevron from "./svgs/ChevronSVG";

export default function Dropdown<T>({
	title,
	value,
	setValue,
	options,
	current,
	toggle,
	exampleDefault,
	bonus,
}: {
	title: string;
	value: T;
	setValue: (s: T) => void;
	options: readonly { name: T; element: ReactNode }[];
	current: string;
	toggle: () => void;
	exampleDefault?: ReactNode;
	bonus?: ReactNode;
}) {
	const thisCurrent = current === title;

	return (
		<div className={`mt-2 mb-6 ${current && !thisCurrent && "lg:hidden"}`}>
			<button
				onClick={toggle}
				className="flex hover:bg-slate-200 bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-700 w-full justify-between items-baseline p-4 rounded-lg shadow-inner shadow-slate-300 dark:shadow-black"
			>
				<p className="text-sm">{title.toUpperCase()}</p>
				<div className="flex items-center">
					<p className="font-bold">{(value as unknown as string).toUpperCase()}</p>
					<div
						className={`ml-1 relative top-[1px] scale-90  ${
							thisCurrent ? "rotate-180" : "rotate-0"
						}`}
					>
						<Chevron />
					</div>
				</div>
			</button>
			{thisCurrent && (
				<div>
					{exampleDefault}
					<div className="pt-2">
						{options.map((option) => (
							<button
								className={`my-2 ${
									value === option.name
										? "bg-slate-300 dark:bg-black"
										: "bg-slate-100 dark:bg-neutral-900 dark:hover:bg-black hover:bg-slate-200"
								} p-4 rounded-md block w-full shadow-inner shadow-slate-300 dark:shadow-black`}
								onClick={() => {
									setValue(option.name);
									toggle();
								}}
								key={option.name as unknown as string}
							>
								<h6 className="font-bold uppercase text-sm ">{option.name}</h6>
								{option.element}
							</button>
						))}
					</div>
					{bonus}
				</div>
			)}
		</div>
	);
}
