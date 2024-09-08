'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Input } from '@material-tailwind/react';
import Todo from './component/todo';
import { createTodo, getTodos } from 'actions/todo-actions';

export default function UI() {
    const [searchInput, setSearchInput] = useState('');

    const todosQuery = useQuery({
        queryKey: ['todos'],
        queryFn: () => getTodos({ searchInput }),
    });

    const createTodoMutation = useMutation({
        mutationFn: () => createTodo({ title: 'New Todo', completed: false }),

        onSuccess: () => {
            todosQuery.refetch();
        },
    });

    return (
        <div className="w-2/3 mx-auto flex flex-col items-center py-10 gap-2">
            <h1 className="text-xl">TODO LIST</h1>

            <Input
                label="Search Todo"
                placeholder="Search Todo"
                icon={<i className="fas fa-search" />}
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
            />

            {todosQuery.isPending && <p>Loading...</p>}
            {todosQuery.data && todosQuery.data.map((todo) => <Todo key={todo?.id} todo={todo} />)}
            <Button onClick={() => createTodoMutation.mutate()} loading={createTodoMutation.isPending}>
                <i className="fas fa-plus mr-2" />
                ADD TODO
            </Button>
        </div>
    );
}
