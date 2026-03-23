export interface ApiState<T> {
data?:T;
error?:unknown;
loading:boolean

};


export interface apiRequest{
    method: "get" | "post"  | "patch" | "delete"  | "put";
    url:string;
    data?:unknown | null;
    params?: Record<string, unknown>;
}