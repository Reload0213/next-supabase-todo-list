'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type TodoRow = Database['public']['Tables']['todo']['Row'];
export type TodoRowInsert = Database['public']['Tables']['todo']['Insert'];
export type TodoRowUpdate = Database['public']['Tables']['todo']['Update'];

const handleError = (error) => {
    console.log(error);
    throw new Error(error?.message);
};

export async function getTodos({ searchInput = '' }): Promise<TodoRow[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('todo')
        .select('*')
        .like('title', `%${searchInput}%`)
        .order('create_at', { ascending: true });

    if (error) {
        handleError(error);
    }

    return data;
}

// create todo
export async function createTodo(todo: TodoRowInsert) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.from('todo').insert({ ...todo, create_at: new Date().toISOString() });

    if (error) {
        handleError(error);
    }

    return data;
}

// update todo
export async function updateTodo(todo: TodoRowUpdate) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('todo')
        .update({ ...todo, updated_at: new Date().toISOString() })
        .eq('id', todo.id);

    if (error) {
        handleError(error);
    }

    return data;
}

// delete todo
export async function deleteTodo(todo: TodoRowUpdate) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.from('todo').delete().eq('id', todo.id);

    if (error) {
        handleError(error);
    }

    return data;
}
