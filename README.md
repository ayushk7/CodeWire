# CodeWire: A Comprehensive Guide

![GitHub stars](https://img.shields.io/github/stars/ayushk7/CodeWire?style=social)
![GitHub forks](https://img.shields.io/github/forks/ayushk7/CodeWire?style=social)
![GitHub license](https://img.shields.io/github/license/ayushk7/CodeWire)


![CodeWire](images/Code%20Wire%20Logo.png)



Welcome to **CodeWire**, a visual scripting tool inspired by Unreal Engine 4's Blueprints. It is designed to help users visualize code and automate repetitive tasks efficiently. CodeWire is language-agnostic, meaning multiple programming languages can be supported as target outputs in future updates. 

Thanks @L-o-o-t for Logo and Discord Server.

Try CodeWire at: [CodeWire](https://ayushk7.github.io/CodeWire/)

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Workflow](#basic-workflow)
3. [Nodes and Connections](#nodes-and-connections)
4. [Creating Variables](#creating-variables)
5. [Node Anatomy](#node-anatomy)
6. [Executing Code](#executing-code)
7. [Adding New Nodes](#adding-new-nodes)
8. [Contributing to CodeWire](#contributing)

## Getting Started
To start using CodeWire, open the application, right-click on the canvas, and start adding nodes. CodeWire provides a visual flow for writing scripts, allowing for faster prototyping of ideas.

## Features
- 🚀 **Node-Based Editor** for visual scripting
- 🌐 **Multi-Language Support** (Currently supports JavaScript)
- 🎨 **Intuitive User Interface** for better visualization and faster coding
- 🛠️ **Custom Nodes** creation for extended functionality

## Basic Workflow
1. **Add a Node**: Right-click anywhere on the canvas and select "Begin" to start your node chain.
2. **Connect Nodes**: After adding the "Begin" node, continue adding nodes such as Print, Variables, etc., by right-clicking and selecting from the context menu.
3. **Pan & Zoom**: Use the middle mouse button to pan across the canvas. Use the scroll wheel to zoom in and out.
4. **Connect Wires**: 
   - **White Wires**: These control the flow of execution between nodes.
   - **Colored Wires**: These handle data inputs and outputs between nodes.
5. **Delete Nodes or Wires**: Hold `Ctrl` and click a node or wire to delete it, or right-click and select "Delete."

## Nodes and Connections
Nodes are the building blocks in CodeWire that perform actions. They are connected by wires that represent the flow of execution and data.

- **Execution Flow**: Nodes use white wires to control the script's sequence.
- **Data Flow**: Colored wires represent the input/output of data between nodes. The color indicates the data type being transferred.

## Creating Variables
Variables can be created using the left-hand panel:
1. Click "New Variable" on the left panel to create a new variable.
2. The variable will be available in the right-click context menu or can be dragged from the panel onto the canvas.

### Connecting Variables
- Variables are used to pass data between nodes. Simply drag the variable to the desired node or select it from the context menu.

## Node Anatomy
Each node has specific attributes depending on its type. Here's the breakdown:

1. **Title**: Displays the node's name (e.g., "Print").
2. **Execution Pins**: White triangle pins to control the flow of execution.
   - **Input Execution Pin**: Marks the start of a node’s execution.
   - **Output Execution Pin**: Marks the next step in the flow.
3. **Input Pins**: Colored pins that receive data into the node.
4. **Output Pins**: Colored pins that output data from the node.
5. **Actions**: Nodes like Print or Add perform specific operations.

For example, a **Print Node** would have:
- Input: A single pin for the value to print.
- Output: A white execution pin to control the next step.

### Example: Fibonacci Series Node
To generate a Fibonacci series, you can chain nodes that loop through calculations, each connected to the next using data pins (colored) and execution flow pins (white).

![Fibonacci Example](images/fib.png)

## Executing Code
Once your nodes are connected and ready, you can generate native JavaScript code by clicking on the **Code** button. This transforms the visual representation into a runnable script.

![Compiled Code](images/httpreq.png)

## Adding New Nodes
To extend CodeWire by adding new JavaScript nodes, follow these steps:

1. **Define Node**: Add the node’s description in the `javascript/Nodes/nodes.js` file.
    ```js
    if (type == 'Print') {
        nodeDescription.nodeTitle = 'Print';
        nodeDescription.execIn = true;
        nodeDescription.execOut = { execOut0: { outOrder: 0 }};
        nodeDescription.inputs = { input0: { inputTitle: 'Value', dataType: 'Data' }};
        nodeDescription.color = 'Print';
    }
    ```

2. **Add to Context Menu**: In `index.html`, include the node in the right-click context menu.
    ```html
    <div class="context-menu-items">Print</div>
    ```

3. **Define Code Generation**: In `VisualScriptToJavascript.js`, add the logic to convert the node’s operation into JavaScript code.
    ```js
    case "Print": {
        this.script += `console.log(${this.handleInp(inputPins[0])});\n`;
        this.coreAlgorithm(execOutPins[0]);
    }
    ```

### Example: Adding a Print Node
By following these steps, you'll add a new "Print" node that outputs console logs when executed in JavaScript.

![Print Node Example](images/print_example.JPG)

## Contributing to CodeWire
CodeWire is an open-source project and welcomes contributions. Join the community on Discord: [Join Discord](https://discord.gg/VuB2UjzqrK).

The project is in active development, and we encourage developers to fork the repository, add features, or raise pull requests. Contributions like sandboxing, undo features, and function nodes are welcome!

For guidance on adding complex nodes such as mathematical operations or logic nodes, refer to the "Adding New Nodes" section.

---

Thank you for checking out CodeWire! We hope you find it useful for your scripting needs.

If you have any suggestions, feel free to reach out!
