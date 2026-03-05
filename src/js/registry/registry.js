/**
 * Central node registry: single source of truth for node types.
 * Register a node once with schema + codegen; it drives the context menu, node creation, and compiler.
 */

const definitions = new Map();
const menuOrder = [];

/**
 * Build full nodeDescription (with null pin ids) from a compact schema.
 * Schema shape:
 * - nodeTitle (id string)
 * - execIn?: boolean
 * - execOut?: Array<{ execOutTitle?: string }>  (outOrder = index)
 * - inputs?: Array<{ inputTitle, dataType, defValue }>
 * - outputs?: Array<{ outputTitle, dataType, outOrder }>
 * - color, rows, colums
 */
function schemaToNodeDescription(schema) {
    const nodeDescription = {
        nodeTitle: schema.nodeTitle,
        color: schema.color,
        rows: schema.rows,
        colums: schema.colums,
    };
    if (schema.execIn !== undefined) {
        nodeDescription.execIn = schema.execIn;
        nodeDescription.pinExecInId = null;
    }
    if (schema.execOut && schema.execOut.length > 0) {
        nodeDescription.execOut = {};
        schema.execOut.forEach((out, i) => {
            nodeDescription.execOut[`execOut${i}`] = {
                execOutTitle: out.execOutTitle ?? null,
                pinExecOutId: null,
                outOrder: out.outOrder ?? i,
            };
        });
    }
    if (schema.inputs && schema.inputs.length > 0) {
        nodeDescription.inputs = {};
        schema.inputs.forEach((inp, i) => {
            nodeDescription.inputs[`input${i}`] = {
                inputTitle: inp.inputTitle,
                dataType: inp.dataType,
                defValue: inp.defValue !== undefined ? inp.defValue : null,
                pinInId: null,
                isInputBoxRequired: inp.isInputBoxRequired !== false,
            };
        });
    }
    if (schema.outputs && schema.outputs.length > 0) {
        nodeDescription.outputs = {};
        schema.outputs.forEach((out, i) => {
            nodeDescription.outputs[`output${i}`] = {
                outputTitle: out.outputTitle,
                dataType: out.dataType,
                pinOutId: null,
                outOrder: out.outOrder ?? i,
            };
        });
    }
    return nodeDescription;
}

/**
 * Register a node type. All node definitions live here (or in files that call this).
 * @param {Object} def - { id, label?, schema, execCodegen?, exprCodegen? }
 * - id: unique string (e.g. 'Print')
 * - label: display name in context menu (default: id)
 * - schema: compact schema for nodeDescription (nodeTitle, execIn, execOut, inputs, outputs, color, rows, colums)
 * - execCodegen(compiler, node): called for execution flow (append to compiler.script, call compiler.coreAlgorithm)
 * - exprCodegen(compiler, inputNode): optional; called for expression value (return string)
 */
export function registerNode(def) {
    const id = def.id;
    const schema = { ...def.schema, nodeTitle: id };
    definitions.set(id, {
        id,
        label: def.label ?? id,
        schema,
        execCodegen: def.execCodegen ?? null,
        exprCodegen: def.exprCodegen ?? null,
    });
    return id;
}

/**
 * Register a menu separator (no node, just order). Call with registerNode({ id: null, menuOnly: true }) or add a separate API.
 * We use menuOrder array: push null for separator when registering. So we need registerSeparator() or we add to menuOrder in definitions.js.
 */
export function registerMenuOrder(orderedIdsAndNulls) {
    menuOrder.length = 0;
    menuOrder.push(...orderedIdsAndNulls);
}

/**
 * Get full nodeDescription for a registered type (for Nodes.CreateNode). Returns null if not found.
 */
export function buildNodeDescription(type) {
    const def = definitions.get(type);
    if (!def) return null;
    return schemaToNodeDescription(def.schema);
}

/**
 * Get registry definition for a type.
 */
export function getDefinition(type) {
    return definitions.get(type) ?? null;
}

/**
 * Get ordered list of menu entries: array of node ids (string) or null for separator.
 */
export function getMenuOrder() {
    return [...menuOrder];
}

/**
 * Get menu order grouped by category (schema.color). Preserves order: categoryOrder lists
 * categories in first-appearance order; groups[category] lists node ids in menu order.
 * @returns {{ categoryOrder: string[], groups: Record<string, string[]> }}
 */
export function getMenuOrderGroupedByCategory() {
    const categoryOrder = [];
    const groups = Object.create(null);
    for (const id of menuOrder) {
        if (id === null) continue;
        const def = definitions.get(id);
        if (!def || !def.schema || !def.schema.color) continue;
        const cat = def.schema.color;
        if (!groups[cat]) {
            categoryOrder.push(cat);
            groups[cat] = [];
        }
        groups[cat].push(id);
    }
    return { categoryOrder, groups };
}

/**
 * Run exec codegen for a node type. No-op if no execCodegen.
 */
export function runExecCodegen(type, compiler, node) {
    const def = definitions.get(type);
    if (def && def.execCodegen) def.execCodegen(compiler, node);
}

/**
 * Run expr codegen for a node type. Returns undefined if no exprCodegen (caller should handle).
 */
export function runExprCodegen(type, compiler, inputNode) {
    const def = definitions.get(type);
    if (def && def.exprCodegen) return def.exprCodegen(compiler, inputNode);
    return undefined;
}

/**
 * Check if a type is registered (built-in node). Get/Set are not registered.
 */
export function hasType(type) {
    return definitions.has(type);
}
