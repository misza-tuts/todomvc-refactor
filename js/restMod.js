import axios from 'axios';
const URL ='http://localhost:3000/todos';

export const restMod = {
  async getTodos() {
    const response = await axios.get(URL)
      return response.data;
  },
  async createTodo() {
    const response = await  axios.post(URL)
  },
  updateTodo() {},
  deleteTodo() {}
};