type Options = {name:string,count?:number}
export const greet=(options:Options)=>{ const {name,count=1}=options
  return `hello ${name}`.repeat(count) }
export const longCall = someFunctionWithALongName(firstArgument, secondArgument, thirdArgument)
declare function someFunctionWithALongName(a:unknown,b:unknown,c:unknown):unknown
declare const firstArgument:unknown, secondArgument:unknown, thirdArgument:unknown
