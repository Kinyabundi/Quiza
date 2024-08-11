import { ReactNode } from "react";
import Sider from "@/components/layout/sider";

interface MainLayoutProps {
	children: ReactNode | ReactNode[];
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<>
			<div className="flex flex-col flex-1 transition-all">
				<div className="flex flex-1 flex-col md:flex-row">
					<Sider />
					<div className="flex flex-1 flex-col px-2 md:px-[30px] py-5 overflow-y-auto h-screen">{children}</div>
				</div>
			</div>
		</>
	);
};

export default MainLayout;
