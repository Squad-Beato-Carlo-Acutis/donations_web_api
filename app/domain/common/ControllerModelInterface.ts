export interface ControllerModelInterface{
  save(model: Record<string, any>): Promise<boolean>
  get(index: string, value: string): Promise<Array<Record<string, any>>>
  delete(index: string, value: string): Promise<boolean>
  // test 
}