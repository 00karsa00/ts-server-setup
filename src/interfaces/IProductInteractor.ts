export interface IProductInteractor {
    createProduct(details: any): Promise<any>;
    updateProduct(id: number, stock: number): Promise<any>;
    getProducts(limit: number, offset: number): Promise<any>;
}