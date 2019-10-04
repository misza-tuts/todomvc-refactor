import axios from 'axios'
const alertInfo = 'Ups.. coś poszło nie tak';
export const restMod = {
  async getTodos() {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      return response.data;
    } catch (error) {
      alert(alertInfo);
      console.error(error);
    }
  },
  async createTodo(todo) { 
    try {
      await axios.post("http://localhost:3000/todos", todo);
    } catch {
      alert('Ups.. coś poszło nie tak');
    }

  },
  async updateTodo(todo) { 
    try {
      await axios.patch(`http://localhost:3000/todos/${todo.id}`, todo);
    } catch (error) {
    alert('Ups.. coś poszło nie tak');
    }
  },
  async deleteTodo(todo) {
    try {
      await axios.delete(`http://localhost:3000/todos/${todo.id}`);
    } catch (error) {
      alert('Ups.. coś poszło nie tak');
    }
   }
};