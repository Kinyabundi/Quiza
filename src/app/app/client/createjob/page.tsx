import { Metadata } from "next";
import CreateJob from "./CreateJob";

export const metadata: Metadata = {
	title: "Create Job",
};

export default function page() {
	return <CreateJob />;
}