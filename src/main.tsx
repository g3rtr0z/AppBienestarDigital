import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./context/settings-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HeroUIProvider>
			<SettingsProvider>
				<BrowserRouter>
					<main className="text-foreground bg-background">
						<App />
					</main>

				</BrowserRouter>
			</SettingsProvider>
		</HeroUIProvider>
	</React.StrictMode>
);
