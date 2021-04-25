
export var InputBox = class{
    constructor(stage, layer, type, grp, position, colorMap, inputPin)
    {
        let rect = new Konva.Rect({
            width: (type == 'Boolean') ? 40 : 50,
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
            width: (type == 'Boolean') ? 40 : 50,
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
            defaultValue = "0";
            htmlInputBox = document.getElementById("string-ip");            
        }
        text.text(defaultValue);
        layer.draw();
        this.inputBox.on("click", () => {
            this.focused = true;
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
            this.inputBox.hide();
        })

        this.textBox = text;
        grp.add(this.inputBox);
    }
}