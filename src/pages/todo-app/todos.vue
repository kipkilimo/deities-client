<template>
  <v-row>
    <v-col cols="4">
      <v-card class="todo-card mt-4 ml-2" elevation="4" outlined rounded>
        <v-card-title class="text-center">
          <v-img src="https://www.amitree.com/wp-content/uploads/2021/08/the-pros-and-cons-of-paper-to-do-lists.jpeg" />
          <h3 class="mt-4 mr-11" style="color: #777777">Create Tasks Todo</h3>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitTodo">
            <v-text-field color="primary" v-model="todoTitle" label="Title" required autofocus />
            <v-text-field color="primary" v-model="todoDescription" label="Description" type="todoDescription"
              required />
            <v-select :items="items" v-model="todoPriority" density="comfortable" label="Priority"></v-select>
            <div class="d-flex justify-space-between mt-4">
              <v-btn style="width: 7.5rem" type="submit" color="primary" :loading="todoLoading">
                Create Todo
              </v-btn>

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn color="cyan" icon height="30" variant="outlined" v-bind="props">
                    <v-icon>mdi-head-lightbulb</v-icon>
                  </v-btn>
                </template>
                <span>What do you want to do today?</span>
              </v-tooltip> <v-btn to="/" color="#555544" icon height="30" variant="outlined">
                <v-icon>mdi-home</v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
        <div v-if="todoError">
          <v-alert :text="todoError" title="Todo error" type="error"></v-alert>
        </div>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <h2>Todo List</h2>
            <h3 v-if="todos[0].title.length < 3"><i>No tasks to show.</i></h3>
            <div class="" v-if="todos[0].title.length > 3">
              <v-card v-for="(todo, index) in todos" :key="index">

                <v-card-text>
                  <v-row>
                    <v-col cols="auto">
                      <v-btn icon="mdi-check-circle-outline" size="x-small"></v-btn>
                    </v-col>
                    <v-col cols="6">
                      <h3>{{ todo.title }}</h3>
                      <p>{{ todo.description }}</p>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-space">

                      <v-btn small>Level & Status</v-btn>
                      <v-btn icon small color="error" @click="deleteTodo(index)">
                        <v-icon> mdi-delete </v-icon>
                      </v-btn>
                      <v-btn icon small color="success" @click="markCompleted(index)">
                        <v-icon v-if="!todo.completed"> mdi-check </v-icon>
                        <v-icon v-else> mdi-check-circle </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="mt-4">
                      <p>Details for {{ todo.title }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useTodoStore } from "../../stores/deities";
import { useRouter } from "vue-router";
const router = useRouter();

const todoStore = useTodoStore();
const todoTitle = ref("");
const todoDescription = ref("");
const todoLoading = ref(false);
const todoError = ref(""); // To store todo error message
const items = ref(["High", "Medium", "Low"]);
const todoPriority = ref("");

const submitTodo = async () => {
  todoLoading.value = true; // Indicate todo in progress
  todoError.value = ""; // Clear any previous errors
  try {
    await todoStore.todo(todoTitle.value, todoDescription.value, todoPriority.value);
    // Optionally, reset the form fields after successful submission
    todoTitle.value = "";
    todoDescription.value = "";
    todoPriority.value = "";
  } catch (error) {
    todoError.value = "Check todo items."; // Set error message
    setTimeout(() => {
      window.location.reload();
    }, 4200);
  }
};



const todos = todoStore.todos

// const toggleDetails = (index: number) => {
//   todos[index].showDetails = !todos[index].showDetails;
// };

const markCompleted = (index: number) => {
  todos[index].completed = !todos[index].completed;
};

const deleteTodo = (index: number) => {
  todos.splice(index, 1);
};
</script>

<style scoped>
.todo-card {
  max-width: 400px;
  margin: auto;
  padding: 24px;
}
</style>

<route lang="yaml">
meta:
  layout: HomeLayout
</route>
<style scoped>
.d-flex {
  display: flex;
}

.justify-space {
  justify-content: space-between;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
