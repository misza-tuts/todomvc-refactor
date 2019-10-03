import { lsMod } from './lsMod';
import { restMod } from './restMod';
var  appMode =  [lsMod];

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
    //let todo = { "id": this.id, "title": title, "completed": completed }
    appMode.forEach(elem => {
      promises.push(elem.updateTodo(todo));
    })
    await Promise.all(promises);
  },

  async deleteTodo(id){
    let promises = [];    
    appMode.forEach(elem => {
      promises.push(elem.deleteTodo(id));
    })
    await Promise.all(promises);
  }
};