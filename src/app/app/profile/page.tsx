import { Metadata } from "next";
import  GetStarted  from "@/app/app/_components/ProfileCard";

export const metadata: Metadata = {
	title: "Login",
};

export default function page() {
	return <GetStarted />;
}