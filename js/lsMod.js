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

  async deleteTodo(todo) {
    await this.getTodos().then(function(data){
      let index = data.map(function(x) {return x.id; }).indexOf(todo.id);
      data = data.filter(function(ele){
        return ele != data[index];
      });
      lsMod.setLocalStorage(data);
    });    
  },

  setLocalStorage(data){
    localStorage.setItem(this.lsNameSpace, JSON.stringify(data));
  }
};