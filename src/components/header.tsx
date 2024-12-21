import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-provider";
import { memo } from "react";
import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";

interface IProps {
	children?: ReactNode;
}

const Header: FC<IProps> = () => {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	const ToggleIcon = isDark ? <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" /> : <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />;
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to={"/"}>
					<img src={isDark ? "/logo.png" : "/logo2.ong"} alt="Klimate Logo" className="h-14" />
				</Link>

				<div className="flex gap-4">
					{/* search */}
					<CitySearch />
					{/* theme toggle */}
					<div onClick={() => setTheme(isDark ? "light" : "dark")} className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}>
						{ToggleIcon}
					</div>
				</div>
			</div>
		</header>
	);
};

export default memo(Header);
