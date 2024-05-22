/* Version Pre 0 2024.0519.1826:0051 */

import { world, system } from '@minecraft/server';

var events = [];

events["world"] = [];

world.afterEvents.playerJoin.subscribe((event) => {
	events[event.playerId] = [];
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
	const block = event.block;

	events[event.player.id].push(new NewEvent("block_place", new NewBlock(block.typeId, block.x, block.y, block.z), false));
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
	const block = event.block;

	events[event.player.id].push(new NewEvent("block_break", new NewBlock(block.typeId, block.x, block.y, block.z), false));
});

world.beforeEvents.itemUse.subscribe((event) => {
	const player = event.source;
	const item = event.itemStack.typeId;

	if (item == "minecraft:stick") {
		if (player.isSneaking) {
			if (events["world"].length == 0) {
				world.sendMessage("Nothing to undo globally.");
				return;
			}

			const undoing = events["world"].pop();

			switch (undoing.event) {
				case "explosion":
					undoing.blocks.forEach((block) => {
						system.run(() => {
							event.source.dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} ${block.typeId}`);
						});
					});

					world.sendMessage("Undid an explosion.");

					break;
				default:
					player.sendMessage("§4An unexpected error has occurred.\nPlease report to author immediately.");
			}

			return;
		}

		if (events[player.id].length == 0) {
			player.sendMessage("Nothing to undo.");
			return;
		}

		const undo = events[player.id].pop();

		switch (undo.event) {
			case "block_break":
				if (!undo.multiple) {
					const block = undo.blocks;

					system.run(() => {
						event.source.dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} ${block.typeId}`);
					});

					player.sendMessage(`Undid broken block ${block.typeId} @ <${block.x} ${block.y} ${block.z}>`);
				}

				break;
			case "block_place":
				if (!undo.multiple) {
					const block = undo.blocks;

					system.run(() => {
						event.source.dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air`);
					});

					player.sendMessage(`Undid placed block ${block.typeId} @ <${block.x} ${block.y} ${block.z}>`);
				}

				break;
			default:
				player.sendMessage("§4An unexpected error has occurred.\nPlease report to author immediately.");
		}
	}
});

world.beforeEvents.explosion.subscribe((event) => {
	let impacted = [];

	event.getImpactedBlocks().forEach((block) => {
		impacted.push(new NewBlock(block.typeId, block.x, block.y, block.z));
	});

	events["world"].push(new NewEvent("explosion", impacted, true));
});

class NewEvent {
	constructor(event, blocks, multiple) {
		this.event = event;
		this.blocks = blocks;
		this.multiple = multiple;
	}
}

class NewBlock {
	constructor(typeId, x, y, z) {
		this.typeId = typeId;
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
