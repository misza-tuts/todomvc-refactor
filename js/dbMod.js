import { lsMod } from './lsMod';
import { restMod } from './restMod';

export const dbMod = {
  appMode: [lsMod, restMod],
  getTodos() {
    let toReturn;
    this.appMode.forEach(elem => {
      toReturn = elem.getTodos()
    })
    return toReturn;
  },

  createTodo(title){
    this.appMode.forEach(elem => {
      toReturn = elem.putTodos(title)
    })
  },

  updateTodo(id, title, completed){

  },

  deleteTodo(id){}
};