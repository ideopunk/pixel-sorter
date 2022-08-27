import { ReactNode } from "react";
import Chevron from "./svgs/ChevronSVG";

export default function Dropdown<T>({
	title,
	value,
	setValue,
	options,
	current,
	toggle,
	bonus,
}: {
	title: string;
	value: T;
	setValue: (s: T) => void;
	options: readonly { name: T; element: ReactNode }[];
	current: string;
	toggle: () => void;
	bonus?: ReactNode;
}) {
	const thisCurrent = current === title;

	return (
		<div className="mt-2 mb-6 ">
			<button
				onClick={toggle}
				className="flex hover:bg-slate-200 w-full justify-between items-center p-4 rounded-full"
			>
				<p className="text-sm tracking-wide">{title.toUpperCase()}</p>
				<div className="flex items-center">
					<p className="font-bold">{(value as unknown as string).toUpperCase()}</p>
					<div className={`ml-2 scale-90  ${thisCurrent ? "rotate-180" : "rotate-0"}`}>
						<Chevron />
					</div>
				</div>
			</button>
			{thisCurrent && (
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
			)}
			{thisCurrent && bonus}
		</div>
	);
}
