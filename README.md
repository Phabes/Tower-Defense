# Tower-Defence

Computer Game Technologies (Study Subject)

## Instruction to run project:

1. Clone project.
   ```javascript
   git clone https://github.com/Phabes/Tower-Defence.git
   ```
1. Open "backend" folder in command line.
1. Run:
   ```javascript
   npm install
   ```
1. Run:
   ```javascript
   nodemon server
   ```
1. Open "frontend" folder in second command line.
1. Run:
   ```javascript
   npm install
   ```
1. Run:
   ```javascript
   npm run dev
   ```

## Description

The game will be reflection of Tower Defense. It will be developed for browser use using three.js. The game will be intended for single player. Completing a certain level unlocks the next level. During the game, opponents will try to reach the end of the map, which may result in failure. There will be areas around the path where you can place structures that will attack your opponents. Killing an opponent results in receiving a certain amount of money, which we can spend on further buildings or improvements to existing ones.

There are two parts of the game:

1. Map Creator
1. Game

## Map Creator

Map creator enables creating new levels to game. You can crave you own path, set towers to specified locations and choose starting points where enemies will be spawned. You can set only one destination place where enemies will be marching. You can define own map size, number of round and time between spawn of enemies.

## Game

Game module provides gameplay based on created levels. The UI panel shows your money and HP during the gameplay. You can monitor messages from the game in proper section. You decide where to build and how to upgrade your towers. There are three possible tower upgrades:

1. Power - how much HP does each shot take
1. Range - range at which you can target the enemy
1. Frequency - time between two consecutive shots

After completing all rounds included in selected level you can unlock next level. If you lose your HP you can try as many times as you want to complete this level.
