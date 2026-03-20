import { getEnvVar } from "./getEnvVar.js";

export class SetlistProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("SETLISTS_COLLECTION_NAME");
    this.collection = this.mongoClient.db().collection(collectionName);
  }

  getAllSetlists(username) {
    return this.collection.find({ authorId: username }).toArray();
  }

  getSetlistById(setlistId) {
    return this.collection.findOne({ _id: setlistId });
  }

  createSetlist(name, description, venue, date, playlistId, authorId) {
    const newSetlist = {
      name,
      description,
      venue,
      date,
      playlistId,
      authorId,
      songs: [],
    };
    return this.collection
      .insertOne(newSetlist)
      .then((result) => ({ ...newSetlist, _id: result.insertedId }));
  }

  updateSetlist(setlistId, updateData) {
    return this.collection
      .updateOne({ _id: setlistId }, { $set: updateData })
      .then((result) => result.matchedCount > 0);
  }

  deleteSetlist(setlistId) {
    return this.collection
      .deleteOne({ _id: setlistId })
      .then((result) => result.deletedCount > 0);
  }

  async adjustSongIndicesAfterRemoval(playlistId, removedIndex) {
    const setlists = await this.collection
      .find({ playlistId })
      .toArray();

    const updates = setlists.map((setlist) => {
      const updatedSongs = setlist.songs
        .filter((item) => item.songIndex !== removedIndex)
        .map((item) => ({
          ...item,
          songIndex:
            item.songIndex > removedIndex
              ? item.songIndex - 1
              : item.songIndex,
        }));

      return this.collection.updateOne(
        { _id: setlist._id },
        { $set: { songs: updatedSongs } },
      );
    });

    return Promise.all(updates);
  }

  deleteSetlistsByPlaylistId(playlistId) {
    return this.collection.deleteMany({ playlistId });
  }
}
