import jQuery from 'jquery'
import Handlebars from 'handlebars'
import { Router } from 'director/build/director'
import axios from 'axios'
import { dbMod } from './dbMod'
import 'regenerator-runtime/runtime'  
 


/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

		 	return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		}
	};

	var App = {
		init: async function () {
			let initF = this;
			 await dbMod.getTodos().then(function(data){
				initF.todos = data;
				initF.todoTemplate = Handlebars.compile($('#todo-template').html());
				initF.footerTemplate = Handlebars.compile($('#footer-template').html());
				initF.bindEvents();

				new Router({
					'/:filter': function (filter) {
						initF.filter = filter;
						initF.render();
					}.bind(initF)
				}).init('/all');
			});
		},
		bindEvents: function () {
			$('#new-todo').on('keyup', this.create.bind(this));
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: async function () {
			var todos = this.getFilteredTodos();
			$('#todo-list').html(this.todoTemplate(todos));
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			$('#new-todo').focus();
			//await util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
		create: async function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			let todo = {
				id: util.uuid(),
				title: val,
				completed: false
			}

			this.todos.push(todo);

			$input.val('');
				await dbMod.createTodo(todo).then(()=> {
					this.render();
				});			
		},
		toggle: async function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			let todo = this.getTodo(e);
			todo.completed = this.todos[i].completed;
			await dbMod.updateTodo(todo).then(()=>{
				this.render();
			});
		},
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: async function (e) {
			debugger;
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();
			var todo = this.getTodo(e);
			todo.title = val;
			if (!val) {
				this.destroy(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				this.todos[this.indexFromEl(el)].title = val;
			}
			await dbMod.updateTodo(todo).then(()=>{
				this.render();
			});
			
		},
		destroy: async function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
			let todo = this.getTodo(e);
			await dbMod.deleteTodo(todo).then(()=>{
				this.render();
			});
		},
		getTodo(e){			
			var $el = $(e.target).parent();
			var label =$el.find('label').text()
			var li = $($el.closest("li")[0]);
			return { id: li.attr("data-id"), title: label, completed: li.hasClass("completed")}
		}
	};

	App.init();
});
