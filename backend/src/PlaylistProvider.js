import { getEnvVar } from "./getEnvVar.js";

export class PlaylistProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("PLAYLISTS_COLLECTION_NAME");
    this.collection = this.mongoClient.db().collection(collectionName);
    this.usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
  }

  getAllPlaylists(username) {
    return this.collection.find({ authorId: username }).toArray();
  }

  getPlaylistById(playlistId) {
    return this.collection.findOne({ _id: playlistId });
  }

  updatePlaylist(playlistId, updateData) {
    return this.collection
      .updateOne({ _id: playlistId }, { $set: updateData })
      .then((result) => result.matchedCount > 0);
  }

  createPlaylist(name, description, authorId) {
    const newPlaylist = { name, description, authorId, songs: [] };
    return this.collection
      .insertOne(newPlaylist)
      .then((result) => ({ ...newPlaylist, _id: result.insertedId }));
  }

  async addSong(playlistId, song) {
    const result = await this.collection.updateOne(
      { _id: playlistId },
      { $push: { songs: song } },
    );
    return result.matchedCount > 0;
  }

  async removeSong(playlistId, songIndex) {
    const playlist = await this.getPlaylistById(playlistId);
    if (!playlist || songIndex < 0 || songIndex >= playlist.songs.length) {
      return false;
    }
    const updatedSongs = playlist.songs.filter((_, i) => i !== songIndex);
    await this.collection.updateOne(
      { _id: playlistId },
      { $set: { songs: updatedSongs } },
    );
    return true;
  }

  deletePlaylist(playlistId) {
    return this.collection
      .deleteOne({ _id: playlistId })
      .then((result) => result.deletedCount > 0);
  }
}
