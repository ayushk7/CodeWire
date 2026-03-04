/**
 * Node registry entry point. Import this once (e.g. from main.js) to register all built-in nodes.
 * Then use the registry API for node descriptions, context menu order, and compiler codegen.
 */
import './definitions.js';
export {
    registerNode,
    registerMenuOrder,
    buildNodeDescription,
    getDefinition,
    getMenuOrder,
    runExecCodegen,
    runExprCodegen,
    hasType,
} from './registry.js';
