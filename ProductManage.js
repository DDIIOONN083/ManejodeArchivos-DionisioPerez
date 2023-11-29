/**
 * @Author: Your name
 * @Date:   2023-11-25 16:51:27
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-11-28 21:01:58
 */
import fs from 'fs';
class ProductManager {
#filePath;//defino propiedades privadas-no las llamo desde afuera
#lastId = 0;// cuando lo voy a cargar...en el momento que estoy instanciando  el Manager -  creo el Manager, tomo la info del json y la guardo


constructor(filePath = "./products.json"){
    this.#filePath = filePath 
this.#setLastId();
}
//Métodos QUE AGREGA 
async addProduct(productName,quantity,price, numIdentif,stock  = [ ]){
    try{
if( !productName || !quantity ) {
    // Validación 1
    throw new Error ("Missing data. ")// Si alguno de los 2 esta vacio o tira un erro
}
// Validación 2...quiero leer del archivo Json y leerlos
const products = await this.getProducts();
 if (products.find(product =>product.productName === productName)){
    throw new Error ("Products already exists")
 } // un prod que tenga un mismo nombre al que me llega por parametro]
 // si lo encuentra, tiro un error

 // ahora lo agregamos al Product
 const newProduct ={
    productName,quantity,price,numIdentif,stock, 
    id : ++this.#lastId
 };
 products.push(newProduct);// modifique el array products sobre la mem
 
 // para guardar el array -lista de estud-en un array -en el archivo json 
 // para eso uso otra funcion con lo que quiero que gusrde en el archivo
 await this.#saveProducts(products);
}catch(error){
        console.log(error.name, error.message);
    }
 }


//MIN 14 EXPLICA
//METODO QUE BUSCA
async getProducts(){// VA A BUSCAR EN EL ARCHIVO Y VA A TRAER ESA INFO

try{
    if (fs.existsSync(this.#filePath)) {
        const products = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
        //parse es necesario para la lectura
        return products;
    }

  return [];//sino devuelve []
    // cuando use utf-8 el contenido de json me lo va a convertir en un array en js
}    catch(error){
    console.log(error.name, error.message);
}
} 


async getProductById(id){
    try{
       const products = await this.getProducts();
       const product = products.find((product) => product.id === id);

        return product; 
    }    
        catch(error){               
                console.log(error.name, error.message);
               }
            }



async deleteProductById(id){
    try{
        const products = await this.getProducts();
       
        // filter me devuelve sobre el criterio que estoy buscando
        // estaran los que no tienen el id que quiero eliminar
products =products.filter((product) =>product.id !== id);
    this.#saveProducts(products);   // lo guardo  
     }    
         catch(error){
                 console.log(error.name, error.message);
                }
}

async updateProducts(id, fieldToUpdate, newValue){
    try{
    //la posicion en el array de objetos
const products = await this.getProducts();
const  productIndex = products.findIndex((product)=> product.id === id);
//validación por si no encuentro al product----Si findIndex no encuentra ningun prod nos devuelve -1
if (productIndex < 0){
    throw new Error ('Product with ID ${id} does not exist.');
    
}

products [productIndex] [fieldToUpdate]= newValue;

await this.#saveProducts(products);//GUARDADO

} catch(error){
        console.log(error);
       }
}



async #setLastId(){
    try{
        const products = await this.getProducts();
       if (products.length < 1){
        this. #lastId = 0;
        return;
       }
        this.#lastId() = products [products.length -1] .id;
        //tomamos del array de prod el ultimo valor ( asi nos da el ultimo del cual queremos el id)
         /* return product; */ 
     }    
         catch(error){
                 console.log(error.name, error.message);
                }
             }
 


 async #saveProducts(products) { //recibe la info del total de prod que quiero guardar
    try{
        await fs.promises.writeFile(this.#filePath, JSON.stringify(products));// espero que la promesa se cumpla
    // escribo el archivo en esta ruta
    } catch(error){
    console.log(error.name, error.message);
        }

    }

}

const productManager = new ProductManager("./products.json");
//1°

console.log( await productManager.getProducts());
await productManager.addProduct("campera", 12);
//2°
console.log( await productManager.getProducts());
await productManager.addProduct("montgomery", 13);

console.log( await productManager.getProductById (2));

console.log( await productManager.getProducts());

await productManager.deleteProductById();
//Traigo todo
console.log( await productManager.getProducts());




await productManager.updateProducts(1,"quantity", 11);

console.log( await productManager.getProducts());