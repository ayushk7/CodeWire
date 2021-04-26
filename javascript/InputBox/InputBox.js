
export var InputBox = class{
    constructor(stage, layer, type, grp, position, colorMap, inputPin)
    {
        let rect = new Konva.Rect({
            width: (type == 'Boolean') ? 50 : 50,
            height: 14,
            stroke: colorMap[type],
            strokeWidth: 1,
        });
        this.focused = false;
        let text = new Konva.Text({
            text: '',
            fontSize: 11,
            fontFamily: 'Verdana',
            fill: colorMap[type],
            width: (type == 'Boolean') ? 50 : 50,
            height: 12,
            padding: 2,
        });
        this.inputBox = new Konva.Group();
        this.inputBox.add(rect);
        this.inputBox.add(text);
        this.inputBox.position(position);
        
        let htmlInputBox = null;
        let defaultValue = null;
        if(type == "Number")
        {
            defaultValue = 0;
            htmlInputBox = document.getElementById("number-ip");
        }
        else if(type == "Boolean")
        {
            defaultValue = 1;
            htmlInputBox = document.getElementById("bool-ip");
        }
        else
        {
            defaultValue = 0;
            htmlInputBox = document.getElementById("string-ip");            
        }
        text.text(defaultValue);
        layer.draw();
        this.inputBox.on("click", () => {
            this.focused = true;
            text.visible(false);
            layer.draw();
            htmlInputBox.value = text.text();
            htmlInputBox.style.left = stage.getContainer().getBoundingClientRect().x + 7 + this.inputBox.getAbsolutePosition().x + "px";
            htmlInputBox.style.top = stage.getContainer().getBoundingClientRect().y + 7 + this.inputBox.getAbsolutePosition().y + "px";
            htmlInputBox.style.transform = `scale(${stage.scaleX()})`;
            htmlInputBox.style.display = "inline-block";
            htmlInputBox.focus();
        });
        stage.on("wheel", () => {
            htmlInputBox.blur();
        });
        htmlInputBox.addEventListener("blur", () => {
            text.visible(true);
            layer.draw();
            htmlInputBox.value = '';
            htmlInputBox.style.display = "none";
            this.focused = false;
        });
        htmlInputBox.addEventListener("input", () => {
            if(this.focused)
            {
                text.text(htmlInputBox.value);
            }
        });
        inputPin.on("wireconnected", (e) => {
            this.inputBox.visible(false);
        });
        inputPin.on("wireremoved", (e) => {
            if(e.isPinEmpty)
            {
                this.inputBox.visible(true);
            }
        });

        this.textBox = text;
        this.inputBox.on("mouseenter", (e) => {
            document.body.style.cursor = "text";
        });
        this.inputBox.on("mouseleave", (e) => {
            document.body.style.cursor = "default";
        });
        grp.add(this.inputBox);
    }
}