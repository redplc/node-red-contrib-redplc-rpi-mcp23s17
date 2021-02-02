/**
 * Copyright 2021 Ocean (iot.redplc@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";

	const syslib = require('./lib/syslib.js');
	const sysmodule = syslib.LoadModule("rpi_mcp23s17.node");

	const MODE_INPUT       = "0";
	const MODE_INPUTPULLUP = "1";
	const MODE_OUTPUT      = "2";

	RED.nodes.registerType("mcp23s17", function (n) {
		var node = this;
		RED.nodes.createNode(node, n);

		node.devadr = parseInt(n.devadr);
		node.devspi = parseInt(n.devspi);
		node.name = "@" + node.devspi + ",2" + n.devadr;

		node.isdi = ((n.mode0 === MODE_INPUT) || (n.mode1 === MODE_INPUT) || (n.mode0 === MODE_INPUTPULLUP) || (n.mode1 === MODE_INPUTPULLUP));
		node.isdo = ((n.mode0 === MODE_OUTPUT) || (n.mode1 === MODE_OUTPUT));

		node.store = node.context().global;
		node.iserror = false;
		node.iserrorInput = false;
		node.iserrorOutput = false;

		node.tagnamedi = "I" + n.addressdi;
		node.tagnamedo = "Q" + n.addressdo;

		node.statustxt = "";

		if (sysmodule === undefined)
			node.iserror = syslib.outError(node, "sysmodule", "sysmodule not load");

		if (!node.iserror && node.isdi) {
			if (typeof node.store.keys().find(key => key == node.tagnamedi) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate: " + node.tagnamedi, "duplicate address: " + node.tagnamedi);
			else {
				node.store.set(node.tagnamedi, 0);
				node.statustxt = node.tagnamedi;
			}
		}

		if (!node.iserror && node.isdo) {
			if (typeof node.store.keys().find(key => key == node.tagnamedo) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate: " + node.tagnamedo, "duplicate address: " + node.tagnamedo);
			else {
				node.store.set(node.tagnamedo, 0);
				node.statustxt += " " + node.tagnamedo;
			}
		}

		if (!node.iserror) {
			if (sysmodule.inuse(node.devspi, node.devadr))
				node.iserror = syslib.outError(node, "in use " + node.name, "address in use " + node.name);
			else if (!sysmodule.initDIO(node.devspi, node.devadr, parseInt(n.mode0), parseInt(n.mode1)))
				node.iserror = syslib.outError(node, "init", "error on init");
		}

		if (!node.iserror) {
			node.statustxt = node.statustxt.trim();
			syslib.setStatus(node, node.statustxt);
		}

		node.on("input", function (msg) {
			if (!node.iserror) {
				if (node.isdi && (msg.payload === "input")) {
					var ret_val = sysmodule.updateDI(node.devadr);
					node.iserrorInput = (ret_val === undefined);
						
					if (!node.iserrorInput)
						node.store.set(node.tagnamedi, ret_val);
				}

				if (node.isdo && (msg.payload === "output"))
					node.iserrorOutput = !sysmodule.updateDO(node.devadr, node.store.get(node.tagnamedo));

				if (node.iserrorInput || node.iserrorOutput)
					syslib.outError(node, "update", "error on update");
				else
					syslib.setStatus(node, node.statustxt);
			}

			node.send(msg);
		});

		node.on('close', function () {
			sysmodule.inuseClear();

			if (node.isdi)
				node.store.set(node.tagnamedi, undefined);

			if (node.isdo)
				node.store.set(node.tagnamedo, undefined);
        });
	});
}
