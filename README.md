# unredo
Unredo is a bahavior pack for Minecraft Bedrock Edition, that lets you undo and redo your last actions during that session.

## How to use
Download this repositiory and add it to your behavior packs folder. Then, add it to the world you want it in. If you want to undo an action, right-click the stick item. Currently, explosions are catergorized in global actions. Therefore if you want to undo those, you need to crouch on the ground and right-click the stick item.

## Current Version
Version Pre 0 "Initial-Concepts"
Published 2024.0519.1826:0061
Product of Second City Software

### Changelog
- Using stick undos players' last world action.
  - Player breaking blocks were added to actions.
    - Block ID gets lost when recording these actions. 
  - Player placing blocks were added to actions.
- Using stick while crouching undos global's last world action.
  - Explosions were added to global actions.
    - Block ID gets lost when recording these actions.
    - Items dropped from explosions do not despawn.

## Future Features
- The redo implementation.
- Smarter systems for detecting who did what explosion.
- Ways to undo commands.
- Get block IDs.
- Track entities being killed or spawned.

## Feedback
Please report anything of note, issues, new ideas, or other feedback to this [discord server](https://discord.gg/Pv6agYuc4C).
