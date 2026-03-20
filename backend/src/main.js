import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { PlaylistProvider } from "./PlaylistProvider.js";
import { registerPlaylistRoutes } from "./routes/playlistRoutes.js";
import { CredentialsProvider } from "./CredentialsProvider.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { verifyAuthToken } from "./routes/authMiddleware.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const app = express();

const mongoClient = connectMongo();

app.use(express.json());
app.use(express.static(STATIC_DIR));
app.use("/api/playlists{/*all}", verifyAuthToken);
app.use("/api/setlists{/*all}", verifyAuthToken);

app.get(Object.values(VALID_ROUTES), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

registerPlaylistRoutes(app, new PlaylistProvider(mongoClient));
registerAuthRoutes(app, new CredentialsProvider(mongoClient));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
