export interface DatabaseConnection {
  query(statement: any): Promise<any>
  connect(): Promise<void>
  release(): Promise<void>
  close(): Promise<void>
}
