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
import { BuilInFunctions } from '../VisualScriptToJavascript/builtInFunctions.js';

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
        color: 'Func',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
        color: 'Math',
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
    id: 'NEG',
    schema: {
        inputs: [{ inputTitle: 'Value', dataType: 'Boolean', defValue: false }],
        outputs: [{ outputTitle: 'Result', dataType: 'Boolean', outOrder: 0 }],
        color: 'Math',
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
        color: 'Get',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
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
        color: 'Func',
        rows: 2,
        colums: 11,
    },
    exprCodegen(compiler, inputNode) {
        const inputPins = compiler.getInputPins(inputNode.node);
        return `Math.min(...${compiler.handleInputs(inputPins[0])})`;
    },
});

// ---------- Menu order (null = separator) ----------
registerMenuOrder([
    'Begin', 'Print', 'Alert', 'Confirm', 'Prompt', null,
    'If/Else', 'Try/Catch', 'WhileLoop', 'ForLoop', 'ForEachLoop', 'Continue', 'Break', 'Assert', 'Sleep', null,
    'Add', 'Subtract', 'Multiply', 'Divide', 'Modulo', 'Power', 'Random', 'Ceil', 'Floor', 'Round', 'Abs', 'Clamp(Num)', 'Max(Num)', 'Min(Num)', null,
    'Swap', 'Equals', 'Not Equals', 'Less', 'LessEq', 'Greater', 'GreaterEq', null,
    'AND', 'OR', 'XOR', 'NEG', 'Ternary', null,
    'bAND', 'bOR', 'bXOR', 'bNEG', null,
    'OpenWindow', 'HttpRequest', 'GetByName(JSON)', 'ParseInt', null,
    'StrToArray', 'ArrayToStr', 'Length', 'Front', 'Back', 'GetByPos', 'SetByPos', 'Search', 'BinarySearch(Num)',
    'PushBack', 'PopBack', 'PushFront', 'PopFront', 'Insert', 'Sort(Num)', 'isEmpty', 'Reverse', 'Max(Array)', 'Min(Array)', null,
]);
