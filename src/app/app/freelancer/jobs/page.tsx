import { Metadata } from "next";
import Jobs from "./Jobs";

export const metadata: Metadata = {
	title: "Jobs",
};

export default function page() {
	return <Jobs />;
}