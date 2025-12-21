import supabase from './supabase.js';
import { supabaseUrl } from './supabase.js';

export async function getCabins() {
    
const { data, error } = await supabase.from('cabins').select('*')
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }
    return data;

}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

//create/edit cabin
    let query = supabase.from('cabins');
//create
    if (!id) 
        query=query
        .insert([{...newCabin, image: imagePath}])
        .select()
        .single();
//edit
    if (id)
    query=query
    .update({ ...newCabin, image: imagePath }).eq('id', id)
        
        
    const { data, error } = await query.select().single();


    if (error) {
        console.error(error);
        throw new Error("Cabin could not be created");
    }
//uploda image
    const{error:storageError} = await supabase
    .storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);
    // Delete the cabin if image upload fails
    if (storageError) {
        await supabase
        .from('cabins')
        .delete()
        .eq('id', data.id)   
        console.error(storageError);
        throw new Error("Cabin image could not be uploaded");

    }
    return data;
} ;

export async function deleteCabin(id) {
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)   

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be deleted");
    }

    return data;
};
