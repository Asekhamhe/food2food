import uniqid from "uniqid";
class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredients) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredients,
    };
    this.items = [...this.items, item];
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }
}

export default List;
