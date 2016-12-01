
export class Vector extends Float64Array{
    dot(n: number): Vector{
        for(let i = 0; i < this.length; i++){
            this[i] *= n;
        }
        return this
    }
    sum(): number{
        let rslt = 0;
        for(let i = 0; i < this.length; i++){
            rslt += this[i];
        }
        return rslt;
    }
}

export class Matrix extends Vector{
    m:number;
    n:number;
    constructor(n:number, m:number, arr?: Float64Array){
        if(arr){
            super(arr);
        }
        else{
            super(m*n);
        }
        this.m = m;
        this.n = n;        
    }
    get(i:number, j:number): number{
        return this[i*this.m+j];
    }
    getRow(i:number): Vector{
        return new Vector(this.slice(i*this.m,(i+1)*this.m));
    }
    clone(): Matrix{
        return new Matrix(this.n, this.m, this);
    }
    setRow(arr: Float64Array, row?: number): void{
        if(row){
            this.set(arr, row*this.m);
        }
        else{
            this.set(arr);
        }
    }
}

export function prod(vec1: Vector, vec2: Vector): number{
    let rslt = 0;
    for(let i = 0; i < vec1.length; i++){
        rslt = vec1[i] * vec2[i];
    }
    return rslt;
}

// export function exp(m: Matrix): Matrix;
// export function exp(m: Vector): Vector;
// export function exp(mat: Vector | Matrix): any{
//     let len = mat.length;
//     if (mat instanceof Matrix){
//         let rslt = new Matrix(mat.n, mat.m);
//         for(let i = 0; i < len; i++){
//             mat[i] = Math.exp(mat[i]);
//         }
//         return rslt;
//     }
//     else if(mat instanceof Vector){
//         let rslt = new Vector(mat);
//         for(let i = 0; i < len; i++){
//             rslt[i] = Math.exp(mat[i]);
//         }
//         return rslt;
//     }
// }

export type AlgebraIterable = Vector | Matrix;

export function map(mat: AlgebraIterable, mapfn: (n:number) => number): AlgebraIterable{
    let len = mat.length;
    if (mat instanceof Matrix){
        let rslt = new Matrix(mat.n, mat.m);
        for(let i = 0; i < len; i++){
            mat[i] = mapfn(mat[i]);
        }
        return rslt;
    }
    else if(mat instanceof Vector){
        let rslt = new Vector(len);
        for(let i = 0; i < len; i++){
            rslt[i] = mapfn(mat[i]);
        }
        return rslt;
    }
}

export function exp(mat: AlgebraIterable): AlgebraIterable{
    return map(mat, Math.exp);
}

export function log(mat: AlgebraIterable): AlgebraIterable{
    return map(mat, Math.log);
}

export function log2(mat: AlgebraIterable): AlgebraIterable{
    return map(mat, Math.log2);
}