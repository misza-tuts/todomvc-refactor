import "@babel/polyfill"

export const lsMod = {
   lsNameSpace: 'todos-jquery',
   async getTodos() {
    var store = localStorage.getItem(this.lsNameSpace);
    return (store && JSON.parse(store)) || [];
  },

  async createTodo(todo) {
    await this.getTodos().then(function(data){
      data.push(todo);
      lsMod.setLocalStorage(data);
    })
  },
  
  async updateTodo(todo) {
    await this.getTodos().then(function(data){
      let index = data.map(function(x) {return x.id; }).indexOf(todo.id);
      data[index] = todo;
      lsMod.setLocalStorage(data);
    })
  },

  async deleteTodo(id) {
    await this.getTodos().then(function(data){
      //var foundIndex = data.find(x => x.id === id)
      data = data.splice(_.indexOf(data, _.findWhere(data, { id : id})), 1);
      lsMod.setLocalStorage(data);
    });    
  },

  setLocalStorage(data){
    localStorage.setItem(this.lsNameSpace, JSON.stringify(data));
  }
};