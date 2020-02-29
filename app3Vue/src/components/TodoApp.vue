<template>
  <section class="todoapp">
    <header class="header">
      <h1>VueJS - Todos</h1>
      <h4 class="message" v-if="messagePresent">{{getmessage}}</h4>
      <input class="new-todo" v-model="newTodoTitle" @keyup.enter="createTodo()" placeholder="What needs to be done?" autofocus>
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main" v-if="todos.length">
      <input class="toggle-all" type="checkbox">
      <label for="toggle-all" @click="toggleAll">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <div v-for="(todo, index) in todosInView">
          <todo-item :todo="todo" @toggleCompleted="toggleCompleted(index)" @removeSelf="removeTodo(index)" />
        </div>
      </ul>
    </section>
    <!-- This footer should hidden by default and shown when there are todos -->
    <todo-footer v-if="todos.length" :itemsLeft="remaining.length" :currentView="currentView" :clearCompleted="clearCompleted" />
  </section>
</template>

<script lang="ts">
import { PostMessage } from './postMessage';
import TodoFooter from './TodoFooter.vue';
import TodoHeader from './TodoHeader.vue';
import TodoItem from './TodoItem.vue';

import Vue from 'vue';
import { AppState, Todo } from '../models';



export default Vue.extend({
  components: {
    TodoItem,
    TodoFooter,
  },

  props: ['currentView'],

  data() {
    const initialState: AppState = {

      // Input box content.
      newTodoTitle: '',
      msg: 'message',
      messagePresent: false,

      // Current todo items.
      todos: [
        { completed: false, title: 'Use Vue with TypeScript' },
      ],
    };

    return initialState;
  },
  methods: {
    /**
     * Adds a new Todo to this instance's list, and reset the title.
     */
    createTodo() {
      const title = this.newTodoTitle.trim();
      if (!title) {
        return;
      }

      this.todos.push({
        completed: false,
        title,
      });

      this.newTodoTitle = '';
    },

    /**
     * Removes the Todo at the given index.
     */
    removeTodo(index: number) {
      if (index >= this.todos.length) {
        throw new Error(`Index deletion at ${index} greater than ${this.todos.length}`);
      }

      this.todos.splice(index, 1);
    },

    /**
     * Toggle the Todo's `completed` status at a given position.
     */
    toggleCompleted(index: number) {
      const current = this.todos[index];
      this.todos.splice(index, 1, {
        ...current,
        completed: !current.completed
      });
    },

    /**
     * Toggle the Todo's `completed` status at a given position.
     */
    clearCompleted() {
      this.todos = this.remaining;
    },

    /**
     * Toggles all todos in one wipe.
     * The `completed` status for all todos is set to `true` if any todo is not completed.
     * It is set to `false` otherwise.
     */
    toggleAll() {
      const stateForAll = this.completed.length !== this.todos.length;

      for (const todo of this.todos) {
        todo.completed = stateForAll;
      }
    }
  },

  computed: {
    todosInView(): Todo[] {
      switch (this.currentView) {
        case 'completed':
          return this.completed;
        case 'active':
          return this.remaining;
        case 'all':
        default:
          return this.todos;
      }
    },
    completed(): Todo[] {
      return this.todos.filter(isCompleted);
    },
    remaining(): Todo[] {
      return this.todos.filter(isNotCompleted);
    },
    getmessage(): string {
      return this.msg;
    }
  },
  mounted: function () { 
    let that = this;
    let messenger: PostMessage;
    this.messagePresent = false;
    let message: string = '';

    window.addEventListener('message', e => { 

          console.log('message: ', e);
          if (e.data.message) {
            that.messagePresent = true;
            let msg = e.data.message;
            that.msg = 
            'Message arrived from [' + e.origin + ']: ' + msg.text;
            
            setTimeout(() => that.messagePresent = false, 4000);

            if (!messenger) {
                messenger = new PostMessage(window.parent, e.origin);
            }

            messenger.postMessage({
                "sender": e.data.recipient,
                "text": "Echoing.... " + msg.text
            });

            //if (e.origin!="http://localhost:4200") {
            //  return false;
            //}
          }

    });
  }
});

function isCompleted(todo: Todo) {
  return todo.completed;
}

function isNotCompleted(todo: Todo) {
  return !todo.completed;
}
</script>