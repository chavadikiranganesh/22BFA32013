import { logPackageMessage } from "./logger.js";

logPackageMessage("User selected insurance option", "info", "hook");

logPackageMessage("Dashboard page initialized", "debug", "page");

logPackageMessage("Theme changed to dark mode", "info", "state");

logPackageMessage("Font loading failed", "error", "style");