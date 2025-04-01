import { supabase } from "./supabase";

//sign Up with email and password
export const signUpWithEmail = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

//sign in with email and password
export const singInWithEmail = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  };
  
//sign in with Google
  export const signInWithGoogle = async ()=> {
    const { data, error } = await supabase.auth.signInWithOAuth({provider:"google"});
    if (error) throw error;
    return data;
  };