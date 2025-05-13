// hook para acceder a los datos de sesión

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/**
 * Hook para acceder a los datos de sesión
 * @returns

 */
export function useAuth(){
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=> {
        supabase.auth.getSession()
        .then((session)=>{
            //almacernar en el estado, los datos del usuario
            setUser(session?.data?.session?.user || null);
        })
    }, [])

    //retornar el estado de hook
    return { user };
}