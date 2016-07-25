Object.defineProperty(Element.prototype, "placeholder", {
  get: function() {
    return this.getAttribute("placeholder");
  },

  set: function(value) {
    if (!value || !/^(input|textarea)$/i.test(this.nodeName) || !/^(email|number|password|search|tel|text|url|)$/i.test(this.getAttribute("type"))) {
      return;
    }

    var
      element = this,
      xInput = document.createElement("ms-input"),
      xPlaceholder = xInput.appendChild(document.createElement("ms-placeholder")),
      xInputRuntimeStyle = xInput.runtimeStyle,
      xPlaceholderRuntimeStyle = xPlaceholder.runtimeStyle,
      elementCurrentStyle;

    xPlaceholder.appendChild(document.createTextNode(value));

    setTimeout(function() {

      elementCurrentStyle = element.currentStyle;

      xInputRuntimeStyle.display = "inline-block";
      xInputRuntimeStyle.fontSize = elementCurrentStyle.fontSize;
      xInputRuntimeStyle.margin = elementCurrentStyle.margin;
      xInputRuntimeStyle.width = elementCurrentStyle.width;

      element.parentNode.insertBefore(xInput, element).appendChild(element);

      xPlaceholderRuntimeStyle.width = "36px";
      xPlaceholderRuntimeStyle.backgroundColor = "transparent";
      xPlaceholderRuntimeStyle.color = "#d9d9d9";
      xPlaceholderRuntimeStyle.fontFamily = elementCurrentStyle.fontFamily;
      xPlaceholderRuntimeStyle.fontSize = elementCurrentStyle.fontSize;
      xPlaceholderRuntimeStyle.textAlign = "left";
      xPlaceholderRuntimeStyle.lineHeight = elementCurrentStyle.lineHeight;
      xPlaceholderRuntimeStyle.margin = "0";
      xPlaceholderRuntimeStyle.padding = "14px 0 0 6px";
      xPlaceholderRuntimeStyle.position = "absolute";
      xPlaceholderRuntimeStyle.display = element.value ? "none" : "inline-block";

      element.runtimeStyle.margin = "0";

      if (element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
        element.setAttribute("readonly", "");
        element.setAttribute("tabindex", "-1");
        element.runtimeStyle.backgroundColor = "#f2f2f2";
        element.onfocus = function() {
          element.runtimeStyle.outline = "none";
          element.runtimeStyle.boxShadow = "none";
        };
      }

    }, 0);

    document.forms.matrixForm.attachEvent("onreset", function() {
      xPlaceholderRuntimeStyle.display = "inline-block";
    });

    xPlaceholder.attachEvent("onclick", function() {
      if (element.hasAttribute("readonly")) {
        return;
      }
      element.focus();
    });

    element.attachEvent("focus", function() {
      if (element.hasAttribute("readonly")) {
        return;
      }
    });

    element.attachEvent("onpropertychange", function() {
      if (event.propertyName == "value") {
        xPlaceholderRuntimeStyle.display = element.value ? "none" : "inline-block";
      }
    });

    element.attachEvent("onkeypress", function() {
      xPlaceholderRuntimeStyle.display = element.value ? "none" : "inline-block";
    });

    element.attachEvent("onkeyup", function() {
      xPlaceholderRuntimeStyle.display = element.value ? "none" : "inline-block";
    });

    Object.defineProperty(element, "placeholder", {
      get: function() {
        return xPlaceholder.innerHTML;
      },
      set: function(value) {
        xPlaceholder.innerHTML = value;
      }
    });
  }
});

document.attachEvent("onreadystatechange", function() {
  if (document.readyState === "complete") {
    for (var elements = document.querySelectorAll("input,textarea"), index = 0, length = elements.length; index < length; ++index) {
      if (elements[index].placeholder) {
        elements[index].placeholder = elements[index].placeholder;
      }
    }
  }
});

