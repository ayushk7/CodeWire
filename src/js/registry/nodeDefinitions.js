/**
 * All built-in node definitions in one place.
 *
 * To add a new node (one place only):
 * 1. Call registerNode({ id, label?, schema, execCodegen?, exprCodegen? }).
 * 2. schema: { execIn?, execOut?: [{ execOutTitle?, outOrder? }], inputs?, outputs?, color, rows, colums }.
 * 3. execCodegen(compiler, node): use compiler.script, compiler.getExecOut(node), compiler.getInputPins(node), compiler.coreAlgorithm(), compiler.handleInputs().
 * 4. exprCodegen(compiler, inputNode): return a string expression; use compiler.getInputPins(inputNode.node), inputNode.srcOutputPinNumber for multi-output nodes.
 * 5. Add the node id to the registerMenuOrder() array at the bottom (use null for a separator).
 */
import { registerNode, registerMenuOrder } from './registry.js';
import { BuilInFunctions } from '../compiler/builtInFunctions.js';

// ---------- Helper used by codegen (compiler has getExecOut, getInputPins, handleInputs, script, coreAlgorithm, builtin_functions) ----------
// Codegen functions receive (compiler, node) or (compiler, inputNode) and use compiler.* freely.

// ---------- Flow: Begin, Print, Alert, Confirm, Prompt ----------
registerNode({
    id: 'Begin',
    schema: {
        execIn: false,
        execOut: [{ execOutTitle: null, outOrder: 0 }],
        color: 'Begin',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const execOutPins = compiler.getExecOut(node);
        compiler.coreAlgorithm(execOutPins[0]); // traverse first so script has generated code
        let func_string = `/////////CodeWire Functions Space Begins/////////////\n\n`;
        for (const each_function in compiler.builtin_functions) {
            func_string = func_string + BuilInFunctions[each_function];
        }
        func_string += `\n/////////CodeWire Functions Space Ends/////////////\n//\n//\n/////////Generated JS Code Space Begins/////////////\n`;
        compiler.script = func_string + compiler.script;
        compiler.script += `\n/////////Generated JS Code Space Ends/////////////`;
    },
});

registerNode({
    id: 'Print',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: "'hello'" }],
        color: 'Print',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `console.log(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
});

registerNode({
    id: 'Alert',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: "'hello'" }],
        color: 'Print',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `alert(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
});

registerNode({
    id: 'Confirm',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Message', dataType: 'String', defValue: "'Ok'" }],
        outputs: [{ outputTitle: 'Ok?', dataType: 'Boolean', outOrder: 1 }],
        color: 'Print',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.builtin_functions = { ...compiler.builtin_functions, _confirm: true };
        compiler.script += `let _confirm_answer${node._id} = _confirm(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `_confirm_answer${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Prompt',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Message', dataType: 'String', defValue: "'Ok'" },
            { inputTitle: 'Default', dataType: 'String', defValue: "'Yes'" },
        ],
        outputs: [
            { outputTitle: 'Ok?', dataType: 'Boolean', outOrder: 1 },
            { outputTitle: 'Value', dataType: 'String', outOrder: 2 },
        ],
        color: 'Print',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.builtin_functions = { ...compiler.builtin_functions, _prompt: true };
        compiler.script += `let [_prompt_ok${node._id}, _prompt_value${node._id}] = _prompt(${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) return `_prompt_ok${inputNode.node._id}`;
        return `_prompt_value${inputNode.node._id}`;
    },
});

// ---------- Flow: If/Else, While, For, ForEach, Break, Continue ----------
registerNode({
    id: 'If/Else',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'True', outOrder: 0 },
            { execOutTitle: 'False', outOrder: 1 },
            { execOutTitle: 'Done', outOrder: 2 },
        ],
        inputs: [{ inputTitle: 'Bool', dataType: 'Boolean', defValue: true }],
        color: 'Logic',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `if(${compiler.handleInputs(inputPins[0])}){\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `}\nelse{\n`;
        compiler.coreAlgorithm(execOutPins[1]);
        compiler.script += `}\n`;
        compiler.coreAlgorithm(execOutPins[2]);
    },
});

registerNode({
    id: 'WhileLoop',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop', outOrder: 0 },
            { execOutTitle: 'Done', outOrder: 1 },
        ],
        inputs: [{ inputTitle: 'Condition', dataType: 'Boolean', defValue: true }],
        color: 'Logic',
        rows: 3,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += ` while(${compiler.handleInputs(inputPins[0])}){\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `}\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
});

registerNode({
    id: 'ForLoop',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 2 },
        ],
        inputs: [
            { inputTitle: 'From', dataType: 'Number', defValue: 0 },
            { inputTitle: 'To(Excl)', dataType: 'Number', defValue: 10 },
            { inputTitle: 'Increment', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Index', dataType: 'Number', outOrder: 1 }],
        color: 'Logic',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const forVar = `i${node._id}`;
        compiler.script += `for(let ${forVar} = (${compiler.handleInputs(inputPins[0])}); ${forVar} < (${compiler.handleInputs(inputPins[1])}); ${forVar} += (${compiler.handleInputs(inputPins[2])})){\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `}\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        return `i${inputNode.node._id}`;
    },
});

registerNode({
    id: 'ForEachLoop',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 4 },
        ],
        inputs: [{ inputTitle: 'Array', dataType: 'Array', defValue: '[]', isInputBoxRequired: false }],
        outputs: [
            { outputTitle: 'Value', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
        ],
        color: 'Logic',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const forVar = `i${node._id}`;
        compiler.script += `${compiler.handleInputs(inputPins[0])}.forEach((value${forVar}, ${forVar}, array${forVar}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) return `valuei${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 1) return `i${inputNode.node._id}`;
        return `arrayi${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Continue',
    schema: {
        execIn: true,
        execOut: [],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        compiler.script += `continue;\n`;
    },
});

registerNode({
    id: 'Break',
    schema: {
        execIn: true,
        execOut: [],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        compiler.script += `break;\n`;
    },
});

registerNode({
    id: 'Assert',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Condition', dataType: 'Boolean', defValue: true }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `if (!(${compiler.handleInputs(inputPins[0])})) throw new Error('Assertion failed');\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
});

registerNode({
    id: 'Sleep',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Ms', dataType: 'Number', defValue: 1000 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.builtin_functions = { ...compiler.builtin_functions, _sleep: true };
        compiler.script += `_sleep(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
});

registerNode({
    id: 'Try/Catch',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Try', outOrder: 0 },
            { execOutTitle: 'Catch', outOrder: 1 },
            { execOutTitle: 'Continue', outOrder: 2 },
        ],
        color: 'Logic',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `try {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `} catch(_err) {\n`;
        compiler.coreAlgorithm(execOutPins[1]);
        compiler.script += `}\n`;
        compiler.coreAlgorithm(execOutPins[2]);
    },
});

// ---------- Math ----------
registerNode({
    id: 'Add',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} + ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Subtract',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} - ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Multiply',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} * ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Divide',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} / ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Modulo',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 1 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 2 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} % ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Power',
    schema: {
        inputs: [
            { inputTitle: 'Base', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Exp', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.pow(${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Random',
    schema: {
        outputs: [{ outputTitle: 'Random[0,1)', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler) {
        return `Math.random()`;
    },
});

registerNode({
    id: 'Ceil',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Number', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.ceil(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Floor',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Number', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.floor(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Max(Num)',
    schema: {
        inputs: [
            { inputTitle: 'A', dataType: 'Number', defValue: 0 },
            { inputTitle: 'B', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.max(${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Min(Num)',
    schema: {
        inputs: [
            { inputTitle: 'A', dataType: 'Number', defValue: 0 },
            { inputTitle: 'B', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.min(${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Round',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Number', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.round(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Abs',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Number', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.abs(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Clamp(Num)',
    schema: {
        inputs: [
            { inputTitle: 'Value', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Min', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Max', dataType: 'Number', defValue: 10 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        const v = compiler.handleInputs(inputPins[0]);
        const min = compiler.handleInputs(inputPins[1]);
        const max = compiler.handleInputs(inputPins[2]);
        return `Math.min(Math.max(${v}, ${min}), ${max})`;
    },
});

// ---------- Comparison: Swap, Equals, Not Equals, Less, LessEq, Greater, GreaterEq ----------
registerNode({
    id: 'Swap',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Ref1', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Ref2', dataType: 'Data', isInputBoxRequired: false },
        ],
        outputs: [
            { outputTitle: 'Ref1', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Ref2', dataType: 'Data', outOrder: 2 },
        ],
        color: 'Func',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `[${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])}] = [${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[0])}];\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[inputNode.srcOutputPinNumber])}`;
    },
});

registerNode({
    id: 'Equals',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Data', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} === ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Not Equals',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Data', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} !== ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Less',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} < ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'LessEq',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} <= ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Greater',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} > ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'GreaterEq',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 0 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} >= ${compiler.handleInputs(inputPins[1])})`;
    },
});

// ---------- Logic: AND, OR, XOR, NEG, bAND, bOR, bXOR, bNEG ----------
registerNode({
    id: 'AND',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Boolean', defValue: true },
            { inputTitle: 'ValueB', dataType: 'Boolean', defValue: true },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} && ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'OR',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Boolean', defValue: true },
            { inputTitle: 'ValueB', dataType: 'Boolean', defValue: true },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} || ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'XOR',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Boolean', defValue: true },
            { inputTitle: 'ValueB', dataType: 'Boolean', defValue: true },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} ^ ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'NEG',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Boolean', defValue: false }],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `!(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Ternary',
    schema: {
        inputs: [
            { inputTitle: 'Condition', dataType: 'Boolean', defValue: true },
            { inputTitle: 'Then', dataType: 'Data', defValue: 0 },
            { inputTitle: 'Else', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Data', outOrder: 0 }],
        color: 'Logic',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} ? ${compiler.handleInputs(inputPins[1])} : ${compiler.handleInputs(inputPins[2])})`;
    },
});

registerNode({
    id: 'bAND',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 1 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} & ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'bOR',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 1 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} | ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'bXOR',
    schema: {
        inputs: [
            { inputTitle: 'ValueA', dataType: 'Number', defValue: 1 },
            { inputTitle: 'ValueB', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} ^ ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'bNEG',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Number', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Number', outOrder: 0 }],
        color: 'Math',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `~${compiler.handleInputs(inputPins[0])}`;
    },
});

// ---------- Func: OpenWindow, HttpRequest, GetByName(JSON) ----------
registerNode({
    id: 'OpenWindow',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'URL', dataType: 'String', defValue: "'link'" }],
        outputs: [{ outputTitle: 'Success?', dataType: 'Boolean', outOrder: 1 }],
        color: 'Func',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.builtin_functions = { ...compiler.builtin_functions, _newWindow: true };
        compiler.script += `let _window_opened${node._id} = _newWindow(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `_window_opened${inputNode.node._id}`;
    },
});

registerNode({
    id: 'HttpRequest',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'OnSuccess', outOrder: 0 },
            { execOutTitle: 'OnFail', outOrder: 2 },
            { execOutTitle: 'Continue', outOrder: 3 },
        ],
        inputs: [{ inputTitle: 'URL', dataType: 'String', defValue: "'link'" }],
        outputs: [{ outputTitle: 'JSON', dataType: 'Data', outOrder: 1 }],
        color: 'Func',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.builtin_functions = { ...compiler.builtin_functions, fetch_data: true };
        compiler.script += `fetch_data(${compiler.handleInputs(inputPins[0])})\n.then((json_data${node._id}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `})\n.catch((err) => {\n`;
        compiler.coreAlgorithm(execOutPins[1]);
        compiler.script += `});\n`;
        compiler.coreAlgorithm(execOutPins[2]);
    },
    exprCodegen(compiler, inputNode) {
        return `json_data${inputNode.node._id}`;
    },
});

registerNode({
    id: 'GetByName(JSON)',
    schema: {
        inputs: [
            { inputTitle: 'JSON', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Name', dataType: 'String', defValue: "'id'" },
        ],
        outputs: [{ outputTitle: 'Data', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}[${compiler.handleInputs(inputPins[1])}]`;
    },
});

registerNode({
    id: 'ParseInt',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'0'", isInputBoxRequired: false },
            { inputTitle: 'Radix', dataType: 'Number', defValue: 10 },
        ],
        outputs: [{ outputTitle: 'Number', dataType: 'Number', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `parseInt(${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])})`;
    },
});

// ---------- Str/Array: StrToArray, ArrayToStr ----------
registerNode({
    id: 'StrToArray',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'String', dataType: 'String', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let strArray${node._id} = ${compiler.handleInputs(inputPins[0])}.split('');\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `strArray${inputNode.node._id}`;
    },
});

registerNode({
    id: 'ArrayToStr',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'String', dataType: 'String', outOrder: 1 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let arrayStr${node._id} = ${compiler.handleInputs(inputPins[0])}.join('');\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `arrayStr${inputNode.node._id}`;
    },
});

// ---------- Array: Length, Front, Back, GetByPos, SetByPos, Search, BinarySearch(Num), PushBack, PopBack, PushFront, PopFront, Insert, Sort(Num), isEmpty, Reverse, Max(Array), Min(Array) ----------
registerNode({
    id: 'Length',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Value', dataType: 'Number', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.length`;
    },
});

registerNode({
    id: 'Front',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Front(Ref)', dataType: 'Data', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}[0]`;
    },
});

registerNode({
    id: 'Back',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Back(Ref)', dataType: 'Data', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}[${compiler.handleInputs(inputPins[0])}.length - 1]`;
    },
});

registerNode({
    id: 'GetByPos',
    schema: {
        inputs: [
            { inputTitle: 'Pos', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Value(Ref)', dataType: 'Data', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[1])}[${compiler.handleInputs(inputPins[0])}]`;
    },
});

registerNode({
    id: 'SetByPos',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Pos', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Value', dataType: 'Data', defValue: 1 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Value(Ref)', dataType: 'Data', outOrder: 1 }],
        color: 'Get',
        rows: 4,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[2])}[${compiler.handleInputs(inputPins[0])}] = ${compiler.handleInputs(inputPins[1])};\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[2])}[${compiler.handleInputs(inputPins[0])}]`;
    },
});

registerNode({
    id: 'Search',
    schema: {
        inputs: [
            { inputTitle: 'Value', dataType: 'Data', defValue: 0 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [
            { outputTitle: 'Exist', dataType: 'Boolean', outOrder: 0 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 1 },
        ],
        color: 'Get',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) {
            return `(${compiler.handleInputs(inputPins[1])}.find((value) => value === ${compiler.handleInputs(inputPins[0])}) === ${compiler.handleInputs(inputPins[0])})`;
        }
        return `(${compiler.handleInputs(inputPins[1])}.findIndex((value) => value === ${compiler.handleInputs(inputPins[0])}))`;
    },
});

registerNode({
    id: 'BinarySearch(Num)',
    schema: {
        inputs: [
            { inputTitle: 'Value', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [
            { outputTitle: 'Exist', dataType: 'Boolean', outOrder: 0 },
            { outputTitle: 'Lower Bound', dataType: 'Number', outOrder: 1 },
            { outputTitle: 'Upper Bound', dataType: 'Number', outOrder: 2 },
        ],
        color: 'Get',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) {
            compiler.builtin_functions = { ...compiler.builtin_functions, binary_search_exist: true };
            return `binary_search_exist(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[0])})`;
        }
        if (inputNode.srcOutputPinNumber == 1) {
            compiler.builtin_functions = { ...compiler.builtin_functions, lower_bound: true };
            return `lower_bound(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[0])})`;
        }
        compiler.builtin_functions = { ...compiler.builtin_functions, upper_bound: true };
        return `upper_bound(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'PushBack',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Value', dataType: 'Data', defValue: 1 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[1])}.push(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[1])}`;
    },
});

registerNode({
    id: 'PushFront',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Value', dataType: 'Data', defValue: 1 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[1])}.unshift(${compiler.handleInputs(inputPins[0])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[1])}`;
    },
});

registerNode({
    id: 'PopBack',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}.pop();\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'PopFront',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}.shift();\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'Insert',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Pos', dataType: 'Number', defValue: 0 },
            { inputTitle: 'Value', dataType: 'Data', defValue: 1 },
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 4,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[2])}.splice(${compiler.handleInputs(inputPins[0])}, 0, ${compiler.handleInputs(inputPins[1])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[2])}`;
    },
});

registerNode({
    id: 'Sort(Num)',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Increasing', dataType: 'Boolean', defValue: true },
        ],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `(${compiler.handleInputs(inputPins[1])}) ? ${compiler.handleInputs(inputPins[0])}.sort((a, b) => a-b) : ${compiler.handleInputs(inputPins[0])}.sort((a, b) => b-a);\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'isEmpty',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])}.length == (0))`;
    },
});

registerNode({
    id: 'Reverse',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Array', dataType: 'Array', outOrder: 1 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}.reverse();\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'Max(Array)',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'MaxValue', dataType: 'Number', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.max(...${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'Min(Array)',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'MinValue', dataType: 'Number', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.min(...${compiler.handleInputs(inputPins[0])})`;
    },
});

// ---------- String: Concat, StringLength, Substring, CharAt, IndexOf(Str), LastIndexOf(Str), Replace, ReplaceAll, Split, Join, Trim, ToUpperCase, ToLowerCase, StartsWith, EndsWith, Includes(Str), Repeat, ParseFloat, ToString ----------
registerNode({
    id: 'Concat',
    schema: {
        inputs: [
            { inputTitle: 'A', dataType: 'String', defValue: "''" },
            { inputTitle: 'B', dataType: 'String', defValue: "''" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} + ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'StringLength',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "''" }],
        outputs: [{ outputTitle: 'Length', dataType: 'Number', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.length`;
    },
});

registerNode({
    id: 'Substring',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Start', dataType: 'Number', defValue: 0 },
            { inputTitle: 'End', dataType: 'Number', defValue: 5 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.substring(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])})`;
    },
});

registerNode({
    id: 'CharAt',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Index', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Char', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.charAt(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'IndexOf(Str)',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'l'" },
        ],
        outputs: [
            { outputTitle: 'Index', dataType: 'Number', outOrder: 0 },
            { outputTitle: 'Found', dataType: 'Boolean', outOrder: 1 },
        ],
        color: 'Str',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        const str = compiler.handleInputs(inputPins[0]);
        const search = compiler.handleInputs(inputPins[1]);
        if (inputNode.srcOutputPinNumber == 0) return `${str}.indexOf(${search})`;
        return `(${str}.indexOf(${search}) !== -1)`;
    },
});

registerNode({
    id: 'LastIndexOf(Str)',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'l'" },
        ],
        outputs: [
            { outputTitle: 'Index', dataType: 'Number', outOrder: 0 },
            { outputTitle: 'Found', dataType: 'Boolean', outOrder: 1 },
        ],
        color: 'Str',
        rows: 2,
        colums: 16,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        const str = compiler.handleInputs(inputPins[0]);
        const search = compiler.handleInputs(inputPins[1]);
        if (inputNode.srcOutputPinNumber == 0) return `${str}.lastIndexOf(${search})`;
        return `(${str}.lastIndexOf(${search}) !== -1)`;
    },
});

registerNode({
    id: 'Replace',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'l'" },
            { inputTitle: 'Replace', dataType: 'String', defValue: "'r'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.replace(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])})`;
    },
});

registerNode({
    id: 'ReplaceAll',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'l'" },
            { inputTitle: 'Replace', dataType: 'String', defValue: "'r'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.replaceAll(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])})`;
    },
});

registerNode({
    id: 'Split',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'a,b,c'" },
            { inputTitle: 'Delimiter', dataType: 'String', defValue: "','" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Array', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.split(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Join',
    schema: {
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Delimiter', dataType: 'String', defValue: "','" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.join(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Trim',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "' hello '" }],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.trim()`;
    },
});

registerNode({
    id: 'ToUpperCase',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "'hello'" }],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.toUpperCase()`;
    },
});

registerNode({
    id: 'ToLowerCase',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "'HELLO'" }],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.toLowerCase()`;
    },
});

registerNode({
    id: 'StartsWith',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'he'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.startsWith(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'EndsWith',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'lo'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.endsWith(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Includes(Str)',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'hello'" },
            { inputTitle: 'Search', dataType: 'String', defValue: "'ell'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.includes(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Repeat',
    schema: {
        inputs: [
            { inputTitle: 'String', dataType: 'String', defValue: "'ab'" },
            { inputTitle: 'Count', dataType: 'Number', defValue: 3 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.repeat(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'ParseFloat',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "'0.0'", isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Number', dataType: 'Number', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `parseFloat(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'ToString',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'String', outOrder: 0 }],
        color: 'Str',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `String(${compiler.handleInputs(inputPins[0])})`;
    },
});

// ---------- Object/JSON: JSON Parse, JSON Stringify, CreateObject, SetProperty, GetProperty, DeleteProperty, HasProperty, ObjectKeys, ObjectValues, ObjectEntries, FromEntries, MergeObjects, ObjectSize, TypeOf, IsNull, IsArray ----------
registerNode({
    id: 'JSON Parse',
    schema: {
        inputs: [{ inputTitle: 'String', dataType: 'String', defValue: "'{}'" }],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `JSON.parse(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'JSON Stringify',
    schema: {
        inputs: [
            { inputTitle: 'Value', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Indent', dataType: 'Number', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'String', dataType: 'String', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `JSON.stringify(${compiler.handleInputs(inputPins[0])}, null, ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'CreateObject',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 2,
        colums: 13,
    },
    execCodegen(compiler, node) {
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let _obj${node._id} = {};\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `_obj${inputNode.node._id}`;
    },
});

registerNode({
    id: 'SetProperty',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'String', defValue: "'key'" },
            { inputTitle: 'Value', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 4,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}[${compiler.handleInputs(inputPins[1])}] = ${compiler.handleInputs(inputPins[2])};\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'GetProperty',
    schema: {
        inputs: [
            { inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'String', defValue: "'key'" },
        ],
        outputs: [
            { outputTitle: 'Value', dataType: 'Data', outOrder: 0 },
            { outputTitle: 'Exists', dataType: 'Boolean', outOrder: 1 },
        ],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) {
            return `${compiler.handleInputs(inputPins[0])}[${compiler.handleInputs(inputPins[1])}]`;
        }
        return `(${compiler.handleInputs(inputPins[1])} in Object(${compiler.handleInputs(inputPins[0])}))`;
    },
});

registerNode({
    id: 'DeleteProperty',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'String', defValue: "'key'" },
        ],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 2,
        colums: 14,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `delete ${compiler.handleInputs(inputPins[0])}[${compiler.handleInputs(inputPins[1])}];\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'HasProperty',
    schema: {
        inputs: [
            { inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'String', defValue: "'key'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[1])} in Object(${compiler.handleInputs(inputPins[0])}))`;
    },
});

registerNode({
    id: 'ObjectKeys',
    schema: {
        inputs: [{ inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Keys', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.keys(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'ObjectValues',
    schema: {
        inputs: [{ inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Values', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.values(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'ObjectEntries',
    schema: {
        inputs: [{ inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Entries', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.entries(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'FromEntries',
    schema: {
        inputs: [{ inputTitle: 'Entries', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.fromEntries(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'MergeObjects',
    schema: {
        inputs: [
            { inputTitle: 'ObjectA', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'ObjectB', dataType: 'Data', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.assign({}, ${compiler.handleInputs(inputPins[0])}, ${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'ObjectSize',
    schema: {
        inputs: [{ inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Size', dataType: 'Number', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.keys(${compiler.handleInputs(inputPins[0])}).length`;
    },
});

registerNode({
    id: 'TypeOf',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: 0 }],
        outputs: [{ outputTitle: 'Type', dataType: 'String', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `typeof ${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'IsNull',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `(${compiler.handleInputs(inputPins[0])} == null)`;
    },
});

registerNode({
    id: 'IsArray',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Data', defValue: 0 }],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Array.isArray(${compiler.handleInputs(inputPins[0])})`;
    },
});

// ---------- Map: CreateMap, MapSet, MapGet, MapHas, MapDelete, MapSize, MapClear, MapKeys, MapValues, MapEntries, MapFromObject, MapToObject, ForEachMap ----------
registerNode({
    id: 'CreateMap',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        outputs: [{ outputTitle: 'Map', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let _map${node._id} = new Map();\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        return `_map${inputNode.node._id}`;
    },
});

registerNode({
    id: 'MapSet',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'Data', defValue: "'key'" },
            { inputTitle: 'Value', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Map', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 4,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}.set(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'MapGet',
    schema: {
        inputs: [
            { inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'Data', defValue: "'key'" },
        ],
        outputs: [
            { outputTitle: 'Value', dataType: 'Data', outOrder: 0 },
            { outputTitle: 'Exists', dataType: 'Boolean', outOrder: 1 },
        ],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) {
            return `${compiler.handleInputs(inputPins[0])}.get(${compiler.handleInputs(inputPins[1])})`;
        }
        return `${compiler.handleInputs(inputPins[0])}.has(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'MapHas',
    schema: {
        inputs: [
            { inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'Data', defValue: "'key'" },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.has(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'MapDelete',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false },
            { inputTitle: 'Key', dataType: 'Data', defValue: "'key'" },
        ],
        outputs: [
            { outputTitle: 'Map', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Deleted', dataType: 'Boolean', outOrder: 2 },
        ],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let _mapDel${node._id} = ${compiler.handleInputs(inputPins[0])}.delete(${compiler.handleInputs(inputPins[1])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) return `${compiler.handleInputs(inputPins[0])}`;
        return `_mapDel${inputNode.node._id}`;
    },
});

registerNode({
    id: 'MapSize',
    schema: {
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Size', dataType: 'Number', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.size`;
    },
});

registerNode({
    id: 'MapClear',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Map', dataType: 'Data', outOrder: 1 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `${compiler.handleInputs(inputPins[0])}.clear();\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}`;
    },
});

registerNode({
    id: 'MapKeys',
    schema: {
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Keys', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...${compiler.handleInputs(inputPins[0])}.keys()]`;
    },
});

registerNode({
    id: 'MapValues',
    schema: {
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Values', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...${compiler.handleInputs(inputPins[0])}.values()]`;
    },
});

registerNode({
    id: 'MapEntries',
    schema: {
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Entries', dataType: 'Array', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...${compiler.handleInputs(inputPins[0])}.entries()]`;
    },
});

registerNode({
    id: 'MapFromObject',
    schema: {
        inputs: [{ inputTitle: 'Object', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Map', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `new Map(Object.entries(${compiler.handleInputs(inputPins[0])}))`;
    },
});

registerNode({
    id: 'MapToObject',
    schema: {
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Object', dataType: 'Data', outOrder: 0 }],
        color: 'Obj',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Object.fromEntries(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'ForEachMap',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 3 },
        ],
        inputs: [{ inputTitle: 'Map', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [
            { outputTitle: 'Key', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Value', dataType: 'Data', outOrder: 2 },
        ],
        color: 'Obj',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_fem${node._id}`;
        compiler.script += `${compiler.handleInputs(inputPins[0])}.forEach((val${v}, key${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_fem${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `key${v}`;
        return `val${v}`;
    },
});

// ---------- Clone/Array: DeepClone, CloneArray, Slice, Splice, FlattenArray, Spread(Array), Includes(Arr), Unique ----------
registerNode({
    id: 'DeepClone',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Data', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Clone', dataType: 'Data', outOrder: 0 }],
        color: 'Func',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `structuredClone(${compiler.handleInputs(inputPins[0])})`;
    },
});

registerNode({
    id: 'CloneArray',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Clone', dataType: 'Array', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...${compiler.handleInputs(inputPins[0])}]`;
    },
});

registerNode({
    id: 'Slice',
    schema: {
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Start', dataType: 'Number', defValue: 0 },
            { inputTitle: 'End', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Array', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.slice(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])})`;
    },
});

registerNode({
    id: 'Splice',
    schema: {
        execIn: true,
        execOut: [{ outOrder: 0 }],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Start', dataType: 'Number', defValue: 0 },
            { inputTitle: 'DelCount', dataType: 'Number', defValue: 1 },
        ],
        outputs: [
            { outputTitle: 'Array', dataType: 'Array', outOrder: 1 },
            { outputTitle: 'Removed', dataType: 'Array', outOrder: 2 },
        ],
        color: 'Get',
        rows: 4,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        compiler.script += `let _spliced${node._id} = ${compiler.handleInputs(inputPins[0])}.splice(${compiler.handleInputs(inputPins[1])}, ${compiler.handleInputs(inputPins[2])});\n`;
        compiler.coreAlgorithm(execOutPins[0]);
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        if (inputNode.srcOutputPinNumber == 0) return `${compiler.handleInputs(inputPins[0])}`;
        return `_spliced${inputNode.node._id}`;
    },
});

registerNode({
    id: 'FlattenArray',
    schema: {
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Depth', dataType: 'Number', defValue: 1 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Array', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 13,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.flat(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Spread(Array)',
    schema: {
        inputs: [
            { inputTitle: 'ArrayA', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'ArrayB', dataType: 'Array', isInputBoxRequired: false },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Array', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...${compiler.handleInputs(inputPins[0])}, ...${compiler.handleInputs(inputPins[1])}]`;
    },
});

registerNode({
    id: 'Includes(Arr)',
    schema: {
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Value', dataType: 'Data', defValue: 0 },
        ],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 14,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `${compiler.handleInputs(inputPins[0])}.includes(${compiler.handleInputs(inputPins[1])})`;
    },
});

registerNode({
    id: 'Unique',
    schema: {
        inputs: [{ inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false }],
        outputs: [{ outputTitle: 'Result', dataType: 'Array', outOrder: 0 }],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `[...new Set(${compiler.handleInputs(inputPins[0])})]`;
    },
});

// ---------- Higher-Order Array: Filter, ArrayMap, Reduce, Find, Every, Some ----------
registerNode({
    id: 'Filter',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 4 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Keep?', dataType: 'Boolean', defValue: true },
        ],
        outputs: [
            { outputTitle: 'Element', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
            { outputTitle: 'Result', dataType: 'Array', outOrder: 3 },
        ],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_fl${node._id}`;
        compiler.script += `let _flResult${node._id} = ${compiler.handleInputs(inputPins[0])}.filter((val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `return ${compiler.handleInputs(inputPins[1])};\n});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_fl${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `idx${v}`;
        return `_flResult${inputNode.node._id}`;
    },
});

registerNode({
    id: 'ArrayMap',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 4 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Mapped', dataType: 'Data', defValue: 0, isInputBoxRequired: false },
        ],
        outputs: [
            { outputTitle: 'Element', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
            { outputTitle: 'Result', dataType: 'Array', outOrder: 3 },
        ],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_mp${node._id}`;
        compiler.script += `let _mpResult${node._id} = ${compiler.handleInputs(inputPins[0])}.map((val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `return ${compiler.handleInputs(inputPins[1])};\n});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_mp${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `idx${v}`;
        return `_mpResult${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Reduce',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 5 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Initial', dataType: 'Data', defValue: 0 },
            { inputTitle: 'NextAcc', dataType: 'Data', defValue: 0, isInputBoxRequired: false },
        ],
        outputs: [
            { outputTitle: 'Accum', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Element', dataType: 'Data', outOrder: 2 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 3 },
            { outputTitle: 'Result', dataType: 'Data', outOrder: 4 },
        ],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_rd${node._id}`;
        compiler.script += `let _rdResult${node._id} = ${compiler.handleInputs(inputPins[0])}.reduce((acc${v}, val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `return ${compiler.handleInputs(inputPins[2])};\n}, ${compiler.handleInputs(inputPins[1])});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_rd${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `acc${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 2) return `idx${v}`;
        return `_rdResult${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Find',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 5 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Match?', dataType: 'Boolean', defValue: true },
        ],
        outputs: [
            { outputTitle: 'Element', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
            { outputTitle: 'Result', dataType: 'Data', outOrder: 3 },
            { outputTitle: 'FoundIdx', dataType: 'Number', outOrder: 4 },
        ],
        color: 'Get',
        rows: 2,
        colums: 12,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_fnd${node._id}`;
        compiler.script += `let _fndResult${node._id};\nlet _fndIdx${node._id} = -1;\n`;
        compiler.script += `${compiler.handleInputs(inputPins[0])}.some((val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `if (${compiler.handleInputs(inputPins[1])}) { _fndResult${node._id} = val${v}; _fndIdx${node._id} = idx${v}; return true; }\nreturn false;\n});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_fnd${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `idx${v}`;
        if (inputNode.srcOutputPinNumber == 2) return `_fndResult${inputNode.node._id}`;
        return `_fndIdx${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Every',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 4 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Match?', dataType: 'Boolean', defValue: true },
        ],
        outputs: [
            { outputTitle: 'Element', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
            { outputTitle: 'Result', dataType: 'Boolean', outOrder: 3 },
        ],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_ev${node._id}`;
        compiler.script += `let _evResult${node._id} = ${compiler.handleInputs(inputPins[0])}.every((val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `return ${compiler.handleInputs(inputPins[1])};\n});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_ev${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `idx${v}`;
        return `_evResult${inputNode.node._id}`;
    },
});

registerNode({
    id: 'Some',
    schema: {
        execIn: true,
        execOut: [
            { execOutTitle: 'Loop Body', outOrder: 0 },
            { execOutTitle: 'Completed', outOrder: 4 },
        ],
        inputs: [
            { inputTitle: 'Array', dataType: 'Array', isInputBoxRequired: false },
            { inputTitle: 'Match?', dataType: 'Boolean', defValue: true },
        ],
        outputs: [
            { outputTitle: 'Element', dataType: 'Data', outOrder: 1 },
            { outputTitle: 'Index', dataType: 'Number', outOrder: 2 },
            { outputTitle: 'Result', dataType: 'Boolean', outOrder: 3 },
        ],
        color: 'Get',
        rows: 2,
        colums: 10,
    },
    execCodegen(compiler, node) {
        const inputPins = compiler.getInputPins(node);
        const execOutPins = compiler.getExecOut(node);
        const v = `_sm${node._id}`;
        compiler.script += `let _smResult${node._id} = ${compiler.handleInputs(inputPins[0])}.some((val${v}, idx${v}) => {\n`;
        compiler.coreAlgorithm(execOutPins[0]);
        compiler.script += `return ${compiler.handleInputs(inputPins[1])};\n});\n`;
        compiler.coreAlgorithm(execOutPins[1]);
    },
    exprCodegen(compiler, inputNode) {
        const v = `_sm${inputNode.node._id}`;
        if (inputNode.srcOutputPinNumber == 0) return `val${v}`;
        if (inputNode.srcOutputPinNumber == 1) return `idx${v}`;
        return `_smResult${inputNode.node._id}`;
    },
});

// ---------- Menu order (null = separator) ----------
// Categories: Begin(Flow), Print(I/O), Logic, Math, Str(String), Obj(Object/Map), Get(Array), Func(Utility)
registerMenuOrder([
    // Flow
    'Begin', null,
    // I/O
    'Print', 'Alert', 'Confirm', 'Prompt', null,
    // Logic: control flow, comparison, boolean ops
    'If/Else', 'Try/Catch', 'WhileLoop', 'ForLoop', 'ForEachLoop', 'Continue', 'Break', 'Assert', 'Sleep',
    'Equals', 'Not Equals', 'Less', 'LessEq', 'Greater', 'GreaterEq',
    'AND', 'OR', 'XOR', 'NEG', 'Ternary', null,
    // Math: arithmetic, rounding, bitwise
    'Add', 'Subtract', 'Multiply', 'Divide', 'Modulo', 'Power', 'Random',
    'Ceil', 'Floor', 'Round', 'Abs', 'Clamp(Num)', 'Max(Num)', 'Min(Num)',
    'bAND', 'bOR', 'bXOR', 'bNEG', null,
    // String
    'Concat', 'StringLength', 'Substring', 'CharAt',
    'IndexOf(Str)', 'LastIndexOf(Str)', 'Replace', 'ReplaceAll',
    'Split', 'Join', 'Trim', 'ToUpperCase', 'ToLowerCase',
    'StartsWith', 'EndsWith', 'Includes(Str)', 'Repeat',
    'ParseInt', 'ParseFloat', 'ToString', 'StrToArray', 'ArrayToStr', null,
    // Object / Map
    'JSON Parse', 'JSON Stringify', 'CreateObject', 'SetProperty', 'GetProperty', 'GetByName(JSON)', 'DeleteProperty',
    'HasProperty', 'ObjectKeys', 'ObjectValues', 'ObjectEntries', 'FromEntries',
    'MergeObjects', 'ObjectSize', 'TypeOf', 'IsNull', 'IsArray',
    'CreateMap', 'MapSet', 'MapGet', 'MapHas', 'MapDelete', 'MapSize', 'MapClear',
    'MapKeys', 'MapValues', 'MapEntries', 'MapFromObject', 'MapToObject', 'ForEachMap', null,
    // Array
    'Length', 'Front', 'Back', 'GetByPos', 'SetByPos',
    'Search', 'BinarySearch(Num)', 'Includes(Arr)',
    'PushBack', 'PopBack', 'PushFront', 'PopFront', 'Insert',
    'Sort(Num)', 'isEmpty', 'Reverse', 'Max(Array)', 'Min(Array)',
    'Slice', 'Splice', 'Spread(Array)', 'FlattenArray', 'CloneArray', 'Unique',
    'Filter', 'ArrayMap', 'Reduce', 'Find', 'Every', 'Some', null,
    // Utility
    'Swap', 'DeepClone', 'OpenWindow', 'HttpRequest', null,
]);
