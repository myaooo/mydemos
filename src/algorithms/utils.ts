// Utils
import * as algebra from "algebra"
// Type definitions

export class Random{
    return_v: boolean = true;
    v_val: number = 0.0;
    rng: ()=> number = Math.random;

    gaussRandom() : number{
        if (this.return_v) {
            this.return_v = false;
            return this.v_val;
        }
        var u = 2 * this.rng() - 1;
        var v = 2 * this.rng() - 1;
        var r = u * u + v * v;
        if (r == 0 || r > 1) return this.gaussRandom();
        var c = Math.sqrt(-2 * Math.log(r) / r);
        this.v_val = v * c; // cache this for next function call for efficiency
        this.return_v = true;
        return u * c;
    }

    // return random normal number
    randn (mu: number, std:number) { 
        return mu + this.gaussRandom() * std; 
    }


    // utility that returns 2d array filled with random numbers from generator rng
    randnArray(n: number, mu = 0.0, std = 1e-4) : Float64Array{
        let x = new Float64Array(n);
        for (var i = 0; i < n; i++) {
            x[i] = this.randn(mu, std);
        }
        return x;
    }

}

export const Rand = new Random();