import { filter, map, reduce, zip } from "ramda";
import { first, isArray, isBoolean, isEmpty, isNumber, isString, rest, second, isLetStarExp, makeLetExp, makeLetStarExp, LetStarExp, LetExp, makeProgram, makeDefineExp, isVarDecl, makeBinding, isBinding, isAtomicExp, Binding, isCompoundExp } from "./L3-ast";
import { AppExp, AtomicExp, BoolExp, CompoundExp, CExp, DefineExp, Exp, IfExp, LitExp, NumExp,
         Parsed, PrimOp, ProcExp, Program, StrExp, VarDecl, VarRef } from "./L3-ast";
import { allT, getErrorMessages, hasNoError, isError }  from "./L3-ast";
import { isAppExp, isBoolExp, isCExp, isDefineExp, isExp, isIfExp, isLetExp, isLitExp, isNumExp,
             isPrimOp, isProcExp, isProgram, isStrExp, isVarRef } from "./L3-ast";
import { makeAppExp, makeBoolExp, makeIfExp, makeLitExp, makeNumExp, makeProcExp, makeStrExp,
         makeVarDecl, makeVarRef } from "./L3-ast";
import { parseL3 } from "./L3-ast";
import { isClosure, isCompoundSExp, isEmptySExp, isSymbolSExp, isSExp,
         makeClosure, makeCompoundSExp, makeEmptySExp, makeSymbolSExp,
         Closure, CompoundSExp, SExp, Value } from "./value";

export const rewriteLetStar = (cexp: Parsed | Error) : LetExp | Error => {
    const rewriteLetStarHelper = (bindings: Binding[], body: CExp[]) : LetExp => {
        if(bindings.length==1) { return makeLetExp(bindings, body); }
        else{ 
            return makeLetExp(bindings.slice(0,1), [rewriteLetStarHelper(bindings.slice(1, bindings.length), body)]);
        }
    }

    return isError(cexp) ? Error(cexp.message) :
    isLetStarExp(cexp) ? rewriteLetStarHelper(<Binding[]>map(rewriteAllLetStarBin,cexp.bindings),
    <CExp[]>map(rewriteAllLetStarCExp,cexp.body)) :
    Error("error");
}

export const rewriteAllLetStar = (cexp: Parsed | Binding | Error) : Parsed | Binding | Error =>
{
    if(isError(cexp)){ return Error(cexp.message); }
    if(isBinding(cexp)){ return rewriteAllLetStarBin(cexp); }
    if(isExp(cexp)){ return rewriteAllLetStarExp(cexp); }
    if(isProgram(cexp)) {
        const temp = map(rewriteAllLetStarExp, cexp.exps);
        if(filter(isError, temp).length === 0) { return makeProgram(<Exp[]>temp);}
        else { return Error("error"); }}
    return Error("error");
}

export const rewriteAllLetStarCExp = (cexp: CExp | Error) : CExp | Error => {
    if(isCompoundExp(cexp)) { return rewriteAllLetStarCompoundExp(cexp); } 
    if(isAtomicExp(cexp)) { return cexp; }
    return Error("error"); 
}
       
export const rewriteAllLetStarCompoundExp = (cexp: CompoundExp | Error) : CompoundExp | Error => {
    if(isError(cexp)) { return Error(cexp.message); }
    if(isAppExp(cexp)) {
        const x = rewriteAllLetStarCExp(cexp.rator);
        const y = map(rewriteAllLetStarCExp, cexp.rands);
        if(isCExp(x) && filter(isError, y).length === 0) { return makeAppExp(x, <CExp[]>y); } 
        else return Error("")} 
    if(isIfExp(cexp)) {
        const x = rewriteAllLetStarCExp(cexp.test);
        const y = rewriteAllLetStarCExp(cexp.then);
        const z = rewriteAllLetStarCExp(cexp.alt);
        if(isCExp(x) && isCExp(y) && isCExp(z)) { return makeIfExp(x,y,z); }
        else return Error("")} 
    if(isProcExp(cexp)) {
        const x = map(rewriteAllLetStarCExp,cexp.body);
        if(filter(isError, x).length === 0) { return makeProcExp(cexp.args, <CExp[]>x); }
        else return Error("")} 
    if(isLetExp(cexp)) {
        const x = map(rewriteAllLetStarBin,cexp.bindings);
        const y = map(rewriteAllLetStarCExp,cexp.body);
        if(filter(isError, x).length === 0 && filter(isError, y).length === 0) { 
            return makeLetExp(<Binding[]>x, <CExp[]>y);
        }else return Error("")} 
    if(isLetStarExp(cexp)) { return rewriteLetStar(cexp); }                 
    if(isLetStarExp(cexp)) { return cexp; }
    return Error("error");
}

export const rewriteAllLetStarBin = (cexp: Binding | Error) : Binding | Error  => {
    if(isBinding(cexp)) {
        const temp = rewriteAllLetStarCExp(cexp.val);
        if(isCExp(temp)){return makeBinding(cexp.var, temp);}
        else { return Error("error"); }}
    return Error("error");
 }

export const rewriteAllLetStarExp = (cexp: Exp | Error) : Exp | Error => {
    if(isDefineExp(cexp)) {
        const temp = rewriteAllLetStarCExp(cexp.val);
        if(isCExp(temp)){ return makeDefineExp(cexp.var, temp); } 
        else { return Error("error"); }}
    if(isCExp(cexp)) { return rewriteAllLetStarCExp(cexp); }
    return Error("error");   
}
    

