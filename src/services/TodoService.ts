import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  doc, 
  Timestamp, 
  DocumentReference
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../config/firebase";
// Interface for Todo items
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  userId: string;
  image?: string; // URL to Firebase Storage
}

// TodoService for managing todos with Firestore
class TodoService {
  private getCollectionRef(userId: string) {
    return collection(db, `users/${userId}/todos`);
  }

  async getTodos(userId: string): Promise<Todo[]> {
    try {
      const q = query(
        this.getCollectionRef(userId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const todos: Todo[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          text: data.text,
          completed: data.completed,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          userId: data.userId,
          image: data.image
        });
      });
      
      return todos;
    } catch (error) {
      console.error("Error getting todos:", error);
      return [];
    }
  }

  async addTodo(text: string, userId: string): Promise<Todo[]> {
    try {
      console.log('Adding todo:', { text, userId });
      const newTodo = {
        text,
        completed: false,
        createdAt: Timestamp.now(),
        userId
      };
      
      console.log('Collection path:', `users/${userId}/todos`);
      const docRef = await addDoc(this.getCollectionRef(userId), newTodo);
      console.log('Todo added with ID:', docRef.id);
      
      // Get all todos after adding the new one
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error; // Propagate the error instead of silently failing
    }
  }

  async toggleTodo(id: string, userId: string): Promise<Todo[]> {
    try {
      // Get the current todo to toggle its completed status
      const todoRef = doc(db, `users/${userId}/todos/${id}`);
      const todos = await this.getTodos(userId);
      const todoToUpdate = todos.find(todo => todo.id === id);
      
      if (todoToUpdate) {
        await updateDoc(todoRef, {
          completed: !todoToUpdate.completed
        });
      }
      
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error toggling todo:", error);
      return this.getTodos(userId);
    }
  }

  async deleteTodo(id: string, userId: string): Promise<Todo[]> {
    try {
      // Get the todo before deleting to check if it has an image
      const todos = await this.getTodos(userId);
      const todoToDelete = todos.find(todo => todo.id === id);
      
      // Delete the document
      const todoRef = doc(db, `users/${userId}/todos/${id}`);
      await deleteDoc(todoRef);
      
      // If the todo had an image, delete it from storage
      if (todoToDelete?.image) {
        const imageRef = ref(storage, todoToDelete.image);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
      
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error deleting todo:", error);
      return this.getTodos(userId);
    }
  }

  async clearCompleted(userId: string): Promise<Todo[]> {
    try {
      const todos = await this.getTodos(userId);
      const completedTodos = todos.filter(todo => todo.completed);
      
      // Delete each completed todo one by one
      const deletePromises = completedTodos.map(todo => this.deleteTodo(todo.id, userId));
      await Promise.all(deletePromises);
      
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error clearing completed todos:", error);
      return this.getTodos(userId);
    }
  }
  
  async addImageToTodo(id: string, imageData: string, userId: string): Promise<Todo[]> {
    try {
      const todoRef = doc(db, `users/${userId}/todos/${id}`);
      
      // Upload image to Firebase Storage
      const imagePath = `users/${userId}/todo-images/${id}`;
      const storageRef = ref(storage, imagePath);
      
      // Remove the data:image/jpeg;base64, part of the string
      const imageDataFormatted = imageData.split(',')[1] || imageData;
      
      // Upload the base64 image data
      const snapshot = await uploadString(storageRef, imageDataFormatted, 'base64');
      
      // Get the download URL
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      // Update the todo with the image URL
      await updateDoc(todoRef, {
        image: imageUrl
      });
      
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error adding image to todo:", error);
      return this.getTodos(userId);
    }
  }
  
  async removeImageFromTodo(id: string, userId: string): Promise<Todo[]> {
    try {
      // Get the todo to get the image URL
      const todos = await this.getTodos(userId);
      const todoToUpdate = todos.find(todo => todo.id === id);
      
      if (todoToUpdate?.image) {
        // Delete the image from storage
        const imageRef = ref(storage, todoToUpdate.image);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
      
      // Update the todo to remove the image reference
      const todoRef = doc(db, `users/${userId}/todos/${id}`);
      await updateDoc(todoRef, {
        image: null
      });
      
      return this.getTodos(userId);
    } catch (error) {
      console.error("Error removing image from todo:", error);
      return this.getTodos(userId);
    }
  }
}

// Create a singleton instance
export const todoService = new TodoService();
