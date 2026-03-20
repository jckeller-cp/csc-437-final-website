import { ObjectId } from "mongodb";

export function registerPlaylistRoutes(app, playlistProvider, setlistProvider) {
  app.get("/api/playlists", async (req, res) => {
    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view playlists",
      });
      return;
    }

    const playlists = await playlistProvider.getAllPlaylists(username);
    res.json(playlists);
  });

  app.get("/api/playlists/:playlistId", async (req, res) => {
    const { playlistId } = req.params;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view playlists",
      });
      return;
    }

    const playlist = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!playlist) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (playlist.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    res.json(playlist);
  });

  app.patch("/api/playlists/:playlistId", async (req, res) => {
    const { playlistId } = req.params;
    const { name, description, songs } = req.body;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to edit playlists",
      });
      return;
    }

    if (!ObjectId.isValid(playlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid playlist ID",
      });
      return;
    }

    const existing = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (songs) updateData.songs = songs;

    const updated = await playlistProvider.updatePlaylist(
      new ObjectId(playlistId),
      updateData,
    );
    if (updated) {
      res.json({ success: true });
    } else {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
    }
  });

  app.post("/api/playlists/:playlistId/songs", async (req, res) => {
    const { playlistId } = req.params;
    const { title, artist, duration, bpm, key } = req.body;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to edit playlists",
      });
      return;
    }

    if (!ObjectId.isValid(playlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid playlist ID",
      });
      return;
    }

    const existing = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    const song = { title, artist, duration, bpm, key };
    await playlistProvider.addSong(new ObjectId(playlistId), song);
    res.status(201).json(song);
  });

  app.delete("/api/playlists/:playlistId/songs/:songIndex", async (req, res) => {
    const { playlistId, songIndex } = req.params;
    const index = Number(songIndex);

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to edit playlists",
      });
      return;
    }

    if (!ObjectId.isValid(playlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid playlist ID",
      });
      return;
    }

    if (!Number.isInteger(index) || index < 0) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid song index",
      });
      return;
    }

    const existing = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    if (index >= existing.songs.length) {
      res.status(404).send({
        error: "Not Found",
        message: "No song at that index",
      });
      return;
    }

    await playlistProvider.removeSong(new ObjectId(playlistId), index);
    await setlistProvider.adjustSongIndicesAfterRemoval(playlistId, index);
    res.status(204).send();
  });

  app.post("/api/playlists", async (req, res) => {
    const { name, description } = req.body;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to create playlists",
      });
      return;
    }

    if (!name || typeof name !== "string") {
      res.status(400).send({
        error: "Bad Request",
        message: "Playlist name is required and must be a string",
      });
      return;
    }

    const newPlaylist = await playlistProvider.createPlaylist(
      name,
      description,
      username,
    );
    res.status(201).json(newPlaylist);
  });

  app.delete("/api/playlists/:playlistId", async (req, res) => {
    const { playlistId } = req.params;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to delete playlists",
      });
      return;
    }

    if (!ObjectId.isValid(playlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid playlist ID",
      });
      return;
    }

    const existing = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    await setlistProvider.deleteSetlistsByPlaylistId(playlistId);
    await playlistProvider.deletePlaylist(new ObjectId(playlistId));
    res.status(204).send();
  });
}
