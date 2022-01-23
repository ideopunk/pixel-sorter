import Image from "next/image";
import Links from "../components/Links";
import botns from "../public/showcase/botns.png";
export default function ShowcaseR() {
	return (
		<div className="flex flex-col w-full items-center">
			<div className="w-1/2 max-w-lg py-10">
				<div className="pb-12">
					<h1 className="font-bold text-3xl text-center">Pixel Sorter Showcase</h1>
					<Links />
				</div>
				<figure>
					<Image src={botns} width={677} height={845} alt="THERE IS NO MAGIC" />
					<figcaption className="font-bold text-justify text-xl w-full ">
						THERE IS NO MAGIC. THERE IS ONLY KNOWLEDGE, MORE OR LESS HIDDEN.
					</figcaption>
				</figure>
			</div>
		</div>
	);
}
