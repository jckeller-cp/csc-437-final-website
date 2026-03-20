import { ObjectId } from "mongodb";

export function registerSetlistRoutes(app, setlistProvider) {
  app.get("/api/setlists", (req, res) => {
    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view setlists",
      });
      return;
    }

    setlistProvider.getAllSetlists(username).then((setlists) => {
      res.json(setlists);
    });
  });

  app.get("/api/setlists/:setlistId", async (req, res) => {
    const { setlistId } = req.params;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to view setlists",
      });
      return;
    }

    const setlist = await setlistProvider.getSetlistById(
      new ObjectId(setlistId),
    );
    if (!setlist) {
      res.status(404).send({
        error: "Not Found",
        message: "No setlist with that ID",
      });
      return;
    }
    if (setlist.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this setlist",
      });
      return;
    }

    res.json(setlist);
  });

  app.post("/api/setlists", async (req, res) => {
    const { name, description, venue, date, playlistId } = req.body;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to create setlists",
      });
      return;
    }

    if (!name || typeof name !== "string") {
      res.status(400).send({
        error: "Bad Request",
        message: "Setlist name is required and must be a string",
      });
      return;
    }

    if (!playlistId || typeof playlistId !== "string") {
      res.status(400).send({
        error: "Bad Request",
        message: "Playlist ID is required",
      });
      return;
    }

    const newSetlist = await setlistProvider.createSetlist(
      name,
      description,
      venue,
      date,
      playlistId,
      username,
    );
    res.status(201).json(newSetlist);
  });

  app.patch("/api/setlists/:setlistId", async (req, res) => {
    const { setlistId } = req.params;
    const { name, description, venue, date, songs } = req.body;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to edit setlists",
      });
      return;
    }

    if (!ObjectId.isValid(setlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid setlist ID",
      });
      return;
    }

    const existing = await setlistProvider.getSetlistById(
      new ObjectId(setlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No setlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this setlist",
      });
      return;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (venue) updateData.venue = venue;
    if (date) updateData.date = date;
    if (songs) updateData.songs = songs;

    const updated = await setlistProvider.updateSetlist(
      new ObjectId(setlistId),
      updateData,
    );
    if (updated) {
      res.json({ success: true });
    } else {
      res.status(404).send({
        error: "Not Found",
        message: "No setlist with that ID",
      });
    }
  });

  app.delete("/api/setlists/:setlistId", async (req, res) => {
    const { setlistId } = req.params;

    const { username } = req.userInfo || {};
    if (!username) {
      res.status(401).send({
        error: "Unauthorized",
        message: "Authentication required to delete setlists",
      });
      return;
    }

    if (!ObjectId.isValid(setlistId)) {
      res.status(400).send({
        error: "Bad Request",
        message: "Invalid setlist ID",
      });
      return;
    }

    const existing = await setlistProvider.getSetlistById(
      new ObjectId(setlistId),
    );
    if (!existing) {
      res.status(404).send({
        error: "Not Found",
        message: "No setlist with that ID",
      });
      return;
    }
    if (existing.authorId !== username) {
      res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this setlist",
      });
      return;
    }

    await setlistProvider.deleteSetlist(new ObjectId(setlistId));
    res.status(204).send();
  });
}
