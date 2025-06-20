import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./context/settings-context";
import { AppStateProvider } from "./context/app-state-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HeroUIProvider>
			<SettingsProvider>
				<AppStateProvider>
					<BrowserRouter>
						<main className="text-foreground bg-background">
							<App />
						</main>

					</BrowserRouter>
				</AppStateProvider>
			</SettingsProvider>
		</HeroUIProvider>
	</React.StrictMode>
);
