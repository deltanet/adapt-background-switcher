# adapt-background-switcher  

**Background switcher** is an *extension* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

This extension displays block backgrounds as the users scrolls the page.  

## Installation

**Background switcher** must be manually installed in the adapt framework and authoring tool.

If **Background switcher** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/deltanet/adapt_authoring/wiki/Plugin-Manager).  

## Settings Overview

**Background switcher** is configured on two levels: page (*contentObjects.json*), and block (*blocks.json*).

The attributes listed below are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-background-switcher/blob/master/example.json).  

### Attributes

**Course**

The Background switcher attribute group at page level contains values for **_isActive**.

>**_isActive** (boolean):  Turns on and off the **Background switcher** extension. Can be set to disable **Background switcher** when not required.  

**Block**

The Background switcher attribute group at block level contains values for **src**, and **mobileSrc**.  

>**src** (string): File name (including path) of the image used when page is viewed at desktop resolution. Path should be relative to the *src* folder.  

>**mobileSrc** (string): File name (including path) of the image used when page is viewed on a mobile device. Path should be relative to the *src* folder.  

## Limitations

No known limitations.  

----------------------------
**Version number:**  3.0.0  
**Framework versions:** 4+  
**Author / maintainer:** Deltanet forked from [Adapt Core](https://github.com/cgkineo/adapt-background-switcher)    
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (latest version), Edge, IE11, IE Mobile 11, Safari 11+12 for macOS+iOS  
