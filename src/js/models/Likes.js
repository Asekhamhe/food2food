class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes = [...this.likes, like];

    // Persist data in localStorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    //   find the index of the like item
    const index = this.likes.findIndex((el) => el.id === id);
    // remove the item from the array
    this.likes.splice(index, 1);

    // Persist data in localStorage
    this.persistData();
  }

  isLiked(id) {
    //   1 !== -1  ---> true
    // -1 !== -1  ---> false
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    if (storage) this.likes = storage;
  }
}

export default Likes;
