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
		<div className="mt-2 mb-6 ">
			<button
				onClick={toggle}
				className="flex hover:bg-slate-200 bg-slate-100 w-full justify-between items-center p-4 rounded-lg"
			>
				<p className="text-sm">{title.toUpperCase()}</p>
				<div className="flex items-center">
					<p className="font-bold">{(value as unknown as string).toUpperCase()}</p>
					<div className={`ml-1 scale-90  ${thisCurrent ? "rotate-180" : "rotate-0"}`}>
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
										? "bg-slate-300"
										: "bg-slate-100 hover:bg-slate-200"
								} p-4 rounded-md block w-full`}
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
