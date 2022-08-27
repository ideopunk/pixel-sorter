import Arrow from "./svgs/Arrow";

export function ArrowsUp() {
	return (
		<div className="flex flex-col items-center">
			<div className="flex">
				<Arrow />
				<Arrow />
			</div>
			<div className="flex">
				<Arrow />
				<Arrow />
			</div>
		</div>
	);
}

export function ArrowsDown() {
	return (
		<div className="flex flex-col items-center">
			<div className="flex rotate-180">
				<Arrow />
				<Arrow />
			</div>
			<div className="flex rotate-180">
				<Arrow />
				<Arrow />
			</div>
		</div>
	);
}

export function ArrowsLeft() {
	return (
		<div className="flex flex-col items-center">
			<div className="flex">
				<div className="-rotate-90">
					<Arrow />
				</div>
				<div className="-rotate-90">
					<Arrow />
				</div>
			</div>
			<div className="flex">
				<div className="-rotate-90">
					<Arrow />
				</div>
				<div className="-rotate-90">
					<Arrow />
				</div>
			</div>
		</div>
	);
}

export function ArrowsRight() {
	return (
		<div className="flex flex-col items-center">
			<div className="flex">
				<div className="rotate-90">
					<Arrow />
				</div>
				<div className="rotate-90">
					<Arrow />
				</div>
			</div>
			<div className="flex">
				<div className="rotate-90">
					<Arrow />
				</div>
				<div className="rotate-90">
					<Arrow />
				</div>
			</div>
		</div>
	);
}
