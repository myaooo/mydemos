// An implementation of t-SNE in typescript.
// Reference: Maaten, L. V. D., & Hinton, G. (2008). Visualizing data using t-SNE.
// MING Yao @ 2016, HKUST

import {Matrix, Vector, exp, map, prod} from "algebra"
import {Rand} from "utils"

/**
 * 
 * 
 * @param {Vector} x1 a vector
 * @param {Vector} x2 a vector
 * @returns {number} the square of L2 norm of (x1-x2)
 */
function L2NormSquare(x1: Vector, x2: Vector): number{
    let len = x1.length;
    let sum2 = 0;
    for(let i = 0; i < len; i++){
        sum2 += (x1[i] - x2[i])**2;
    }
    return sum2;
}

/**
 * 
 * 
 * @param {Matrix} data a n*m matrix, in which data vectors are stored as rows.
 * @returns {Matrix}
 */
function pairwiseDistanceSquare(data: Matrix): Matrix{
    let num = data.n;
    let len = data.m;
    let dist: Matrix = new Matrix(num, num);
    for(let i = 0; i < num; i++){
        for(let j = i+1; j < num; j++){
            // Symmetric
            let d = L2NormSquare(data.getRow(i), data.getRow(j));
            dist[i*len+j] = d;
            dist[j*len+i] = d;
        }
    }
    return dist;
}

function computeH(dist: Vector, beta: number): [number, Vector]{
    let expRow: Vector = map(dist, function(x: number): number{
        return -x*beta;
    });
    let sum = expRow.sum();
    let H = Math.log(sum) + beta * prod(dist, expRow) / sum;
    expRow.dot(1/sum);
    return [H, expRow];  
}


function pairwiseConditionalProb(distSquare: Matrix, perplexity: number, tol: number): Matrix{
    let num = distSquare.length;
    let prob: Matrix = new Matrix(num, num);
    let entropy = Math.log2(perplexity);
    //let expRow: Vector = new Vector(num); // temporary array
    let condProb: Vector; // temporary array
    for(let i = 0; i < num; i++){
        let beta = 1; // beta = 0.5/(sigma**2)
        let minBeta = 0;
        let maxBeta = Infinity;
        let maxTries = 50;
        let currentEntropy = 0;
        for(let it = 0; it < maxTries; it++){
            [currentEntropy, condProb] = computeH(distSquare.getRow(i), beta);
            let diff = currentEntropy - entropy; 
            if (Math.abs(diff) < tol)
                break;
            if(diff > 0){ // current entropy too high, need to increase beta (decrease sigma).
                minBeta = beta;
                if(maxBeta === Infinity){
                    beta *= 2;
                }
                else{
                    beta = (minBeta + maxBeta)/2;
                }
            }
            else{ // current entropy too low, need to decrease beta (increase sigma).
                maxBeta = beta;
                if(minBeta === -Infinity){
                    beta /= 2;
                }
                else{
                    beta = (minBeta + maxBeta)/2;
                }

            }
        }
        prob.setRow(condProb,i);
    }

    return prob;
}

class TSNE{
    perplexity: number;
    TMax: number;
    data: Matrix;
    dT: number;
    T = 0;
    iter = 0;
    dim = 0;  // dimension of t-SNE
    N = 0;  // number of data
    pwDistanceSquare: Matrix;
    pwConditionalProb: Matrix;
    pwProb: Matrix;
    solution: Matrix;
    pwQ: Matrix;
    constructor(perp: number, tMax: number, dt = 10, dim = 2){
        this.perplexity = perp;
        this.TMax = tMax;
        this.dT = dt;
        this.dim = 2;
    }
    input(dataMatrix: Matrix){
        this.data = dataMatrix;
        this.N = dataMatrix.n;
        this.init();
    }
    init(){
        this.pwDistanceSquare = pairwiseDistanceSquare(this.data);
        this.pwConditionalProb = pairwiseConditionalProb(this.pwDistanceSquare, this.perplexity,1e-4);
        this.computeProb();
        this.initSolution();
        
    }
    computeProb(){
        let n = this.N;
        this.pwProb = new Matrix(n,n);
        let n2 = n*2;
        for(let i = 0; i < n; i++){
            for(let j = i+1; j < n; j++){
                let rslt = (this.pwConditionalProb.get(i,j)+ this.pwConditionalProb.get(j,i))/n2;
                rslt = Math.max(rslt, 1e-12);
                this.pwProb[i*n+j] = rslt;
                this.pwProb[j*n+i] = rslt;
            }
        }
    }
    initSolution(){
        let n = this.N;
        let m = this.dim;
        this.solution = new Matrix(n,m, Rand.randnArray(n*m));
    }
    gradient(){
        
    }

    computeOneStep(){
        let N = this.N;
        this.iter += 1;
        let solDistSquare = pairwiseDistanceSquare(this.solution);
    }

}