# node-red-contrib-redplc-rpi-mcp23s17

redPlc module node for MCP23017 16bit I/O Expander.<br>

## Install

[redPlc use this module node. Install redPlc.](https://www.npmjs.com/package/node-red-contrib-redplc)

[If you use this node for other nodes install this.](https://www.npmjs.com/package/node-red-contrib-redplc-module)

Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install node-red-contrib-redplc-rpi-mcp23s17
```
## Usage
Wire this node to first output of redPlc cpu node.<br>
Global variable I are updated with digital inputs.<br>
Global variable Q sets digital output.<br>
This node works only on Raspberry Pi with Raspberry Pi OS.<br>
Enable SPI with raspi-config.

### Digital Input (Variable I):
### Digital Output (Variable Q):

PA = Input, PB = Input<br>
PA = Output, PB = Output<br>

|Pin|Bit|Pin|Bit|
|:--|:-:|:--|:-:|
|PA0|0|PB0|8|
|PA1|1|PB1|9|
|PA2|2|PB2|10|
|PA3|3|PB3|11|
|PA4|4|PB4|12|
|PA5|5|PB5|13|
|PA6|6|PB6|14|
|PA7|7|PB7|15|

PA = Input, PB = Output<br>
PA = Output, PB = Input<br>

|Pin|Bit|Pin|Bit|
|:--|:-:|:--|:-:|
|PA0|0|PB0|0|
|PA1|1|PB1|1|
|PA2|2|PB2|2|
|PA3|3|PB3|3|
|PA4|4|PB4|4|
|PA5|5|PB5|5|
|PA6|6|PB6|6|
|PA7|7|PB7|7|

## Donate
If you like my work please support it with donate:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZDRCZBQFWV3A6)
