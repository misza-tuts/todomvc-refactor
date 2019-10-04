import axios from 'axios'

export const restMod = {
  async getTodos() {
     const response = await axios.get('http://localhost:3000/todos');
     return response;
  },
  async createTodo(todo) { 
    await axios.post("http://localhost:3000/todos", todo);
  },
  async updateTodo(todo) { 
    await axios.patch(`http://localhost:3000/todos/${todo.id}`, todo);
  },
  async deleteTodo(todo) {
    await axios.delete(`http://localhost:3000/todos/${todo.id}`);
   }
};