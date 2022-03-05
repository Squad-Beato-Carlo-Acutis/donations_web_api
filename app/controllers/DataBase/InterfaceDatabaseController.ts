export interface InterfaceDatabaseController {
  search(params?: Record<string, any>): Promise<Record<string, any>>;
  searchAll(): Promise<Record<string, any>>;
  save(params: Record<string, any>): Promise<Record<string, any>>;
  update(params: Record<string, any>): Promise<Record<string, any>>;
  delete(id:number): Promise<Record<string, any>>;
}
