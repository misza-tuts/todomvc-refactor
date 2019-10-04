import "@babel/polyfill"

export const lsMod = {
  lsNameSpace: 'todos-jquery',
  async getTodos() {
    return {data: lsMod.getLocalStorage()};
  },

  async createTodo(todo) {
    let data = this.getLocalStorage()
    data.push(todo);
    lsMod.setLocalStorage(data);

  },

  async updateTodo(todo) {
    let data = this.getLocalStorage();
    let index = data.map(function (x) { return x.id; }).indexOf(todo.id);
    data[index] = todo;
    lsMod.setLocalStorage(data);

  },

  async deleteTodo(todo) {
    let data = this.getLocalStorage();
    let index = data.map(function (x) { return x.id; }).indexOf(todo.id);
    data = data.filter(function (ele) {
      return ele != data[index];
    });
    lsMod.setLocalStorage(data);
  },

  setLocalStorage(data) {
    localStorage.setItem(this.lsNameSpace, JSON.stringify(data));
  },

  getLocalStorage() {
    var store = localStorage.getItem(this.lsNameSpace);
    return (store && JSON.parse(store)) || [];
  }
};