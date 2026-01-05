import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import Product, { ProductDoc } from "./models/Product.ts";
import ProductMedia, { ProductMediaDoc } from "./models/ProductMedia.ts";
import User, { UserDoc } from "./models/User.ts";
(await import("dotenv")).config({ path: "./process.env"});

class Database {
    public static async connect() : Promise<void> { 
        const DB_TOKEN : string | undefined = process.env.DB_TOKEN;
        if (!DB_TOKEN) throw new Error("❌ Bot token wasn't found!");
        
        await mongoose.connect(DB_TOKEN)
            .then(() => {
                console.log("Info | ✅ MongoDB подключено")
            })
            .catch(console.error);
    }

    //Api for Products
    public static async createProduct(element: ProductDoc) : Promise<ProductDoc> {
        const product = await new Product(element).save();
        return product.toObject() as ProductDoc;
    }

    public static getProduct(id: string) : Promise<ProductDoc | null> {
        return Product.findOne({ id });
    }

    public static getProductByName(name: string) : Promise<ProductDoc | null> {
        return Product.findOne({ name });
    }

    public static getAllProducts(filter: FilterQuery<ProductDoc>) : Promise< ProductDoc[] | null> {
        return Product.find(filter);
    }
    
    public static deleteProduct(id: string) : Promise<ProductDoc | null> {
        return Product.findOneAndDelete({ id });
    }

    public static updateProduct(id: string, changedInfo: Partial<ProductDoc>) {
        return Product.findOneAndUpdate({ id }, changedInfo, { returnDocument: "after" });
    }

    //Api for Product medias
    public static async createProductMedia(element: ProductMediaDoc) : Promise<ProductMediaDoc> {
        const productMedia = await new ProductMedia(element).save();
        return productMedia.toObject() as ProductMediaDoc;
    }

    public static getProductMedia(filter: FilterQuery<ProductMediaDoc>) : Promise<ProductMediaDoc | null> {
        return ProductMedia.findOne(filter);
    }

    public static getAllProductMedias(filter: FilterQuery<ProductMediaDoc>) : Promise< ProductMediaDoc[] | null> {
        return ProductMedia.find(filter);
    }
    
    public static deleteProductMedia(id: number) : Promise<ProductMediaDoc | null> {
        return ProductMedia.findOneAndDelete({ id });
    }

    public static updateProductMedia(id: number, changedInfo: Partial<ProductMediaDoc>) {
        return ProductMedia.findOneAndUpdate({ id }, changedInfo, { returnDocument: "after" });
    }

    // Api for users
    public static async createUser(userInfo: Partial<UserDoc>) : Promise<UserDoc> {
        const user = await new User(userInfo).save();
        return user.toObject() as UserDoc;
    }

    public static getUser(filter: FilterQuery<UserDoc>) : Promise<UserDoc | null> {
        return User.findOne(filter);
    }

    public static getAllUsers(filter: FilterQuery<UserDoc>) : Promise< UserDoc[] | null> {
        return User.find(filter);
    }
    
    public static deleteUser(id: number) : Promise<UserDoc | null> {
        return User.findOneAndDelete({ id });
    }

    public static updateUser(id: number, changedInfo: UpdateQuery<UserDoc>) {
        return User.findOneAndUpdate({ id }, changedInfo, { returnDocument: "after" });
    }
}

export default Database;