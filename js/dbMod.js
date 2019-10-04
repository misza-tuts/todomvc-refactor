import { lsMod } from './lsMod';
import { restMod } from './restMod';
var  appMode =  [restMod, lsMod]; //first one is the source of truth

export const dbMod = {
  async getTodos() {
    return await appMode[0].getTodos();
  },

  async createTodo(todo){
    let promises = []; 

    appMode.forEach(elem => {     
      promises.push(elem.createTodo(todo));
    })
    await Promise.all(promises);
  },

  async updateTodo(todo){
    let promises = [];    
    appMode.forEach(elem => {
      promises.push(elem.updateTodo(todo));
    })
    await Promise.all(promises);
  },

  async deleteTodo(todo){
    let promises = [];    
    appMode.forEach(elem => {
      promises.push(elem.deleteTodo(todo));
    })
    await Promise.all(promises);
  }
};