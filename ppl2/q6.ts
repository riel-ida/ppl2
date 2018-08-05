import { CExp, Exp, PrimOp, Program, DefineExp } from "./L1-ast";
import { hasError, isAppExp, isBoolExp, isCExp, isDefineExp, isError, isNumExp, isPrimOp,
         isProgram, isVarRef, isVarDecl } from "./L1-ast";
import { parseL1 } from "./L1-ast";
import { first, isEmpty, rest } from "./L1-ast";
import * as assert from "assert";
import { filter, map, reduce } from "ramda";

// Implement the following function:
const createArrString = (arr:Exp[]) : string =>{
    let toreturn: string = " ";
    for(let i = 0; i < arr.length-1; i++){
        toreturn = toreturn.concat((String)(unparse(arr[i]))).concat(" ");
    }
    toreturn = toreturn.concat((String)(unparse(arr[arr.length-1])));
    return toreturn;
}
export const unparseCExp = (exp: CExp): string | Error => {
    return isNumExp(exp) ?  exp.val.toString() :
    isBoolExp(exp) ?  (String)(exp.val) :
    isPrimOp(exp) ?  exp.op :
    isVarRef(exp) ?  exp.var :
    isVarDecl(exp) ? exp.var :
    isAppExp(exp) ? 
    ("(".concat(((String) (unparseCExp(exp.rator)).concat(createArrString(exp.rands))))).concat(")") :
    isError(exp) ? Error(exp.message) : Error("unexpected type");
} 

const unparseDefineExp = (exp:DefineExp): string | Error =>{
    return "(define ".concat((String)(unparseCExp(exp.var)).concat((String)(unparseCExp(exp.val)))).concat(")"); 
}

const unparseProgram = (exp:Program): string | Error =>{
    return "(L1 ".concat(createArrString(exp.exps)).concat(")");
}

export const unparse = (x: Program | DefineExp | CExp) : string | Error => {
    return isCExp(x) ? unparseCExp(x) :
    isDefineExp(x) ? unparseDefineExp(x) :
    isProgram(x) ? unparseProgram(x) : Error("unexpected type");
}

