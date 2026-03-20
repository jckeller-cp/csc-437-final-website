import { ObjectId } from "mongodb";

export function registerPlaylistRoutes(app, playlistProvider) {
  app.get("/api/playlists", (req, res) => {
    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view playlists",
      });
      return;
    }

    playlistProvider.getAllPlaylists(username).then((playlists) => {
      res.json(playlists);
    });
  });

  app.get("/api/playlists/:playlistId", (req, res) => {
    const { playlistId } = req.params;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view playlists",
      });
      return;
    }

    playlistProvider
      .getPlaylistById(new ObjectId(playlistId))
      .then((playlist) => {
        if (playlist) {
          if (playlist.authorId === username) {
            res.json(playlist);
          } else {
            res.status(403).send({
              error: "Forbidden",
              message: "This user does not own this playlist",
            });
          }
        } else {
          res.status(404).send({
            error: "Not Found",
            message: "No playlist with that ID",
          });
        }
      });
  });

  app.patch("/api/playlists/:playlistId", async (req, res) => {
    const { playlistId } = req.params;
    const { name } = req.body;
    const { description } = req.body;
    const { songs } = req.body;

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

    const existingPlaylist = await playlistProvider.getPlaylistById(
      new ObjectId(playlistId),
    );
    if (!existingPlaylist) {
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
      return;
    }
    if (existingPlaylist.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this playlist",
      });
      return;
    }

    // patch any fields that are provided
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
      // Should never happen I think but just in case
      res.status(404).send({
        error: "Not Found",
        message: "No playlist with that ID",
      });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    const { name } = req.body;
    const { description } = req.body;

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

    await playlistProvider.deletePlaylist(new ObjectId(playlistId));
    res.status(204).send();
  });
}
