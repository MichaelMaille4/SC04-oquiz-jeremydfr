import { app } from "./src/app.ts";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("🚀 Logs service is running !");
});