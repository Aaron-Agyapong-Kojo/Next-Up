import React, { useState, useEffect, useRef } from "react";
import { todoService, Todo } from "../services/TodoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, Trash2, Image, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();
  const { user } = useUser();

  // Load todos from Firestore when component mounts or user changes
  useEffect(() => {
    const loadTodos = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const loadedTodos = await todoService.getTodos(user.id);
          setTodos(loadedTodos);
        } catch (error) {
          console.error("Error loading todos:", error);
          toast({
            title: "Error loading tasks",
            description: "There was a problem loading your tasks. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTodos();
  }, [user, toast]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      toast({
        title: "Authentication Error",
        description: "Please sign in to add tasks.",
        variant: "destructive"
      });
      return;
    }
    
    if (newTodoText.trim() === "") {
      toast({
        title: "Empty Task",
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>Please enter a task before adding.</span>
          </div>
        ),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Adding todo with user ID:', user.id);
      const updatedTodos = await todoService.addTodo(newTodoText.trim(), user.id);
      console.log('Todos after update:', updatedTodos);
      setTodos(updatedTodos);
      setNewTodoText("");
      
      toast({
        title: "Task added",
        description: "Your new task has been added to the list.",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error adding task",
        description: error.message || "There was a problem adding your task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    if (!user) return;
    try {
      const updatedTodos = await todoService.toggleTodo(id, user.id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error updating task",
        description: "There was a problem updating your task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    try {
      const updatedTodos = await todoService.deleteTodo(id, user.id);
      setTodos(updatedTodos);
      
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error deleting task",
        description: "There was a problem deleting your task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClearCompleted = async () => {
    if (!user) return;
    try {
      const updatedTodos = await todoService.clearCompleted(user.id);
      setTodos(updatedTodos);
      
      toast({
        title: "Completed tasks cleared",
        description: "All completed tasks have been removed from your list.",
      });
    } catch (error) {
      console.error("Error clearing completed todos:", error);
      toast({
        title: "Error clearing tasks",
        description: "There was a problem clearing your completed tasks. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (typeof event.target?.result === 'string') {
          const updatedTodos = await todoService.addImageToTodo(todoId, event.target.result, user.id);
          setTodos(updatedTodos);
          toast({
            title: "Image attached",
            description: "Your image has been added to the task.",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const triggerFileInput = (todoId: string) => {
    fileInputRefs.current[todoId]?.click();
  };

  const handleRemoveImage = async (todoId: string) => {
    if (!user) return;
    try {
      const updatedTodos = await todoService.removeImageFromTodo(todoId, user.id);
      setTodos(updatedTodos);
      toast({
        title: "Image removed",
        description: "The image has been removed from the task.",
      });
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        title: "Error removing image",
        description: "There was a problem removing the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed;
    if (activeFilter === "completed") return todo.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex justify-center items-center" style={{minHeight: "300px"}}>
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" size="icon" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus size={20} />
            )}
          </Button>
        </div>
      </form>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderTodoList(
            filteredTodos, 
            handleToggleTodo, 
            handleDeleteTodo, 
            handleImageUpload, 
            triggerFileInput, 
            handleRemoveImage, 
            fileInputRefs
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          {renderTodoList(
            filteredTodos, 
            handleToggleTodo, 
            handleDeleteTodo, 
            handleImageUpload, 
            triggerFileInput, 
            handleRemoveImage, 
            fileInputRefs
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderTodoList(
            filteredTodos, 
            handleToggleTodo, 
            handleDeleteTodo, 
            handleImageUpload, 
            triggerFileInput, 
            handleRemoveImage, 
            fileInputRefs
          )}
        </TabsContent>
      </Tabs>

      {todos.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm text-muted-foreground">
          <div>
            {todos.filter(t => !t.completed).length} items left
          </div>
          {todos.some(t => t.completed) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearCompleted}
            >
              Clear completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

function renderTodoList(
  todos: Todo[], 
  onToggle: (id: string) => void, 
  onDelete: (id: string) => void,
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => void,
  triggerFileInput: (todoId: string) => void,
  onRemoveImage: (todoId: string) => void,
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>
) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li 
          key={todo.id} 
          className="flex flex-col p-3 bg-card rounded-lg shadow-sm border border-border transition-all hover:shadow-md"
        >
          <div className="flex items-start">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-full border mr-3 mt-1",
                todo.completed ? "bg-primary text-primary-foreground border-primary" : "border-input"
              )}
              onClick={() => onToggle(todo.id)}
            >
              {todo.completed && <Check size={12} />}
            </Button>
            
            <div className="flex-1">
              <span 
                className={cn(
                  "block transition-all",
                  todo.completed && "todo-item-done"
                )}
              >
                {todo.text}
              </span>
              
              {todo.image && (
                <div className="relative mt-2 inline-block">
                  <img 
                    src={todo.image} 
                    alt="Task attachment" 
                    className="max-h-40 rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                    onClick={() => onRemoveImage(todo.id)}
                  >
                    <span className="sr-only">Remove</span>
                    &times;
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex">
              {!todo.image && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => triggerFileInput(todo.id)}
                >
                  <Image size={16} />
                  <input
                    type="file"
                    ref={(el) => fileInputRefs.current[todo.id] = el}
                    accept="image/*"
                    onChange={(e) => onImageUpload(e, todo.id)}
                    className="hidden"
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
