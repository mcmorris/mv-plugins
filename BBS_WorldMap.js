//=============================================================================
// Bluebooth Plugins - World Map
// BBS_WorldMap.js
//=============================================================================

//=============================================================================
 /*:
 * @title World Map Plugin
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Feb 11, 2016
 * @filename BBS_WorldMap.js
 * If you enjoy my work, consider supporting me on Patreon!
 *
 * https://www.patreon.com/bluebooth
 *
 * @plugindesc v2.01 Have your own comprehensive World Map system!
 * @author Michael Morris
 * Special Thanks to Tsukihime for all the help.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *   - Free for use in non-commercial projects with credits
 *   - Contact me for commercial use
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 * 
 * @param Node Window Position
 * @desc Where to display the node status window.
 * (2 - BOTTOM					8 - TOP)
 * @default 2
 * 
 * @param Arrow Buffer Size
 * @desc how large any interface elements surrounding the player will be, including gaps.  Arrowsize + gap.  Default: 42
 * These sizes can be found in whatever buttonset you use for BBS_MapControls.js.
 * @default 42
 * 
 * @param Idle Text
 * @desc Text to display when moving between nodes.
 * @default Traveling...
 * 
 * @param Parameter 1 Format 
 * @desc Specify a format in the form: %1%/2
 * where %1 is the first value, and %2 is the second value.
 * for example, %1/%2 where %1 is current value, %2 is max. value.
 * @default %1 %2
 
 * @param Parameter 2 Format 
 * @desc Specify a format in the form: %1%/2
 * where %1 is the first value, and %2 is the second value.
 * for example, %1/%2 where %1 is current value, %2 is max. value.
 * @default %1/%2
 *
 * @param Parameter 3 Format 
 * @desc Specify a format in the form: %1%/2
 * where %1 is the first value, and %2 is the second value.
 * for example, %1/%2 where %1 is current value, %2 is max. value.
 * @default %1/%2
 * 
 * @param Text Color
 * @desc Color for most text in Node Status Window.
 * (0 - 31, default 0)
 * @default 0
 * 
 * @param Name Color
 * @desc Color for node name in Node Status Window.
 * (0 - 31, default 0)
 * @default 0
 * 
 * @param Idle Color
 * @desc Color for idle text, displayed when moving between nodes.
 * (0 - 31, default 0)
 * @default 0
 *  
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * A port and more flexible design based on the original World Map system I put
 * together in RMXP.  Allows for a customizable, fully featured World Map system.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Use the following plugin commands to manipulate world map nodes.
 *
 * Plugin Commands:
 *   
 *   WorldMap UpdateNodeWindow id var1 var2 icon1 eval1 eval2 icon2 eval3 eval4 icon3	# Updates the Node Status Window with parameters given.
 *   WorldMap CloseNodeWindow			# Closes the Node Status Window.  Do not call Update after this without Opening again first.
 *   WorldMap DrawArrows N E S W		# Draws navigation arrows centered around player.
 *	 WorldMap EraseArrows				# To be called before player moves from one node to another or enters a node!
 * 
 * Description of Node event Plugin calls.
 *  USE STANDARD AREA TRANSITION TO ENTER WORLD MAP.  PLACE PLAYER ON APPROPRIATE STARTING NODE.
 *  CREATE AUTORUN EVENT ON WORLD MAP THAT CALLS WorldMap init THEN DEACTIVATES ITSELF
 *  
 *  NODE NAME, NOTE, X, and Y will be handled by the EVENT for NODE.
 *  NAME = EVENT NAME, NOTE = EVENT NOTES, X = EVENT X, Y = EVENT Y
 *  AT EACH NODE, UPDATE USING PLUGIN COMMANDS
 *    UPDATE LOCATION WINDOW EVENTID, VAR1, VAR2, ICON1, VAR3, VAR4, ICON2, VAR5, VAR6, ICON3
 *    SETSURROUNDINGNODES NORTH EAST SOUTH WEST
 *    ENABLESURROUNDINGNODES NESW
 *    DRAWARROWS NESW
 *    
 *	  INPUT LISTENER AND HANDLING
 *	  
 *    IF PLAYER MOVES ERASEARROWS
 * 
 *  CALL CLOSENODEWINDOW BEFORE TRANSITIONING PLAYER OUT (OF WORLD MAP) ON A NODE.
 *  CALL ERASEARROWS BEFORE TRANSITIONING PLAYER OUT (OF WORLD MAP) ON A NODE.
 * 
 * ============================================================================
 * Change Log
 * ============================================================================
 * 2.01  - Map name window no longer shows while Node info. window is open.
 * 2.00b - fixed logic error that could hide buttons underneath Node Status Window.
 * 2.00a - separated out world map arrows into BBS_MapControls.js and added mouse/touch support for arrows (now buttons).
 *		 - completed tests ensuring touch and mouse worked properly with world map.
 *		 - removed redundent functions.
 *		 - button commands now much easier to read.
 * 1.01c - separated out last map handling to BBS_TransitionHistory.js to fix world map daisy-chain.
 *  fixed player not facing down after moving between nodes.
 * 1.01b - node status window auto switches y position to avoid obscuring player and player arrows.
 * 1.01a - custom text color issues resolved thanks to Tsukihime.
 * 1.01  - Plugin finished.  All major bugs fixed.
 * 
 */
//=============================================================================

var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.WorldMap = 1;
BBS.WorldMap = BBS.WorldMap || {};

(function() {

	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_WorldMap');
	var debugging		  = eval(String(parameters['Debug Mode'] || 'false'));
	
	var enableNodeWnd	  = eval(String(parameters['Enable Node Window'] || 'true'));
	var nodeWindowPos	  = Number(parameters['Node Window Position'] || '2');
	var btnBufferSize	  = Number(parameters['Arrow Buffer Size'] || '42');
	
	var idleText		  = String(parameters['Idle Text'] || 'Traveling...');
	var textColor		  = Number(parameters['Text Color'] || '0');
	var nameColor		  = Number(parameters['Name Color'] || '0');
	var idleColor		  = Number(parameters['Idle Color'] || '0');
	
	var param1Format	  = String(parameters['Parameter 1 Format'] || '%1 %2');
	var param2Format	  = String(parameters['Parameter 2 Format'] || '%1/%2');
	var param3Format	  = String(parameters['Parameter 3 Format'] || '%1/%2');

	var nodeWindowOpen = false;
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================
    var BBS_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === 'WorldMap') {
            switch (args[0]) {
			case 'init':
				SceneManager._scene.onLoad();
				break;
			case 'CloseNodeWindow':
				SceneManager._scene.closeNodeWindow();
				break;
			case 'UpdateNodeWindow':
				SceneManager._scene.changeNode(Number(args[1]), String(args[2]), String(args[3]), String(args[4]), String(args[5]), String(args[6]), String(args[7]), String(args[8]), String(args[9]), eval(args[10]), String(args[11]));
				break;
			};
        }
		else {
			BBS_Game_Interpreter_pluginCommand.call(this, command, args);
		}
    };

	//=============================================================================
	// Window_MapName
	//=============================================================================	
	var BBS_CSI_Window_MapName_updateFadeIn = Window_MapName.prototype.updateFadeIn;
	Window_MapName.prototype.updateFadeIn = function() {
		if (nodeWindowOpen === false) {
			BBS_CSI_Window_MapName_updateFadeIn.call(this);
		}
	};
	
	var BBS_CSI_Window_MapName_open = Window_MapName.prototype.open;
	Window_MapName.prototype.open = function() {
		if (nodeWindowOpen === true) {
			this.close();
		} else {
			BBS_CSI_Window_MapName_open.call(this);			
		}
	};

	//=============================================================================
	// Window_NodeStatus
	//=============================================================================	
	function Window_NodeStatus() {
        this.initialize.apply(this, arguments);
    }
	
	Window_NodeStatus.prototype = Object.create(Window_Base.prototype);
	Window_NodeStatus.prototype.constructor = Window_NodeStatus;
	
	Window_NodeStatus.prototype.initialize = function(nodeWindowPos) {
		var y = 0;
		var width = Graphics.boxWidth;
		var height = 128;
		
		// Handle positioning offset.
		if (nodeWindowPos === 2) {
			y = Graphics.boxHeight - height;
		}
		
		Window_Base.prototype.initialize.call(this, 0, y, width, height);
		this.refresh();
	};
	
	Window_NodeStatus.prototype.refresh = function() {
		var x = this.textPadding();
		var y = 0;
		var width = this.contents.width - this.textPadding() * 2;
		var lineHeight = this.lineHeight() - 6;
		this.contents.clear();
		
		if (this._node <= 0) {
			// Special case: traveling between nodes.
			this.textColor(idleColor);
			this.drawText(idleText, (Graphics.boxWidth / 2) - (this.textWidth(idleText) / 2) - 18, lineHeight * 1);
			this.changeTextColor(this.normalColor());
			return;
		}
		
		//this.changeTextColor(nameColor);
		this.textColor(nameColor);
		this.drawText(this._name, x, lineHeight * 0);
		
		this.textColor(textColor);
		this.drawText(this._desc, x, Math.floor(lineHeight * 1.5));
		
		// Draw additional parameters.
		// Param 1
		var col2X = x + (width / 6) * 3;
		var icon1Width = 0;
		
		if (this._icon1 > 0) {
			this.drawIcon(this._icon1, col2X, lineHeight * 0 + 4);
			icon1Width = 48;
		}
		
		var text1 = param1Format.format(String(this._var1), String(this._var2));
		this.drawText(String(text1), col2X + icon1Width, lineHeight * 0);
		
		// Param 2
		var col3X = x + (width / 6) * 4;
		var icon2Width = 0;
		
		if (this._icon2 > 0) {
			this.drawIcon(this._icon2, col3X, lineHeight * 0 + 4);
			icon2Width = 48;
		}		
		
		var text2 = param2Format.format(eval(this._eval1), eval(this._eval2));
		this.drawText(String(text2), col3X + icon2Width, lineHeight * 0);
	
		// Param 3
		var col4X = x + (width / 6) * 5;
		var icon3Width = 0;
		
		if (this._icon3 > 0) {
			this.drawIcon(this._icon3, col4X, lineHeight * 0 + 4);
			icon3Width = 48;
		}	
		
		var text3 = param3Format.format(eval(this._eval3), eval(this._eval4));
		this.drawText(String(text3), col4X + icon3Width, lineHeight * 0);
		
		this.changeTextColor(this.normalColor());
	};

	Window_NodeStatus.prototype.changeNode = function(node, var1, var2, icon1, eval1, eval2, icon2, eval3, eval4, icon3) {
		
		this._node = node;
		
		// Avoid accessing bad array elements.
		if (node < 0 || $dataMap === undefined) {
			this.refresh();
			return;
		}
		
		this._name = $dataMap.events[node].name;
		this._desc = $dataMap.events[node].note;
		this._var1 = var1;
		this._var2 = var2;
		this._icon1 = icon1;
		this._eval1 = eval1;
		this._eval2 = eval2;
		this._icon2 = icon2;
		this._eval3 = eval3;
		this._eval4 = eval4;
		this._icon3 = icon3;
		
		this.refresh();
	};

	BBS.Window_NodeStatus_update = Window_NodeStatus.prototype.update;
	var BBS_Window_NodeStatus_Update = Window_NodeStatus.prototype.update;
	Window_NodeStatus.prototype.update = function() {
		BBS_Window_NodeStatus_Update.call(this);

		// Avoid hiding player.
		switch (nodeWindowPos) {
			case 2:
				var heightClearance = this.y - btnBufferSize;
				if ($gamePlayer.screenY() >= heightClearance) {
					// Switch y position.
					console.log("Time to move up");
					nodeWindowPos = 8;
					this.y = 0;
				}
				break;
			case 8:
				var heightClearance = this.height + btnBufferSize;
				if ($gamePlayer.screenY() <= heightClearance) {
					// Switch y position.
					nodeWindowPos = 2;
					this.y = Graphics.boxHeight - this.height;
				}
				break;
		};

	}
 
	//=============================================================================
	// Scene_Map
	//=============================================================================
	BBS.Scene_Map_update = Scene_Map.prototype.update;
	var BBS_Scene_Map_Update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
		BBS_Scene_Map_Update.call(this);
		if (this.isNodeWindowOpen()) {
			this._nodeWindow.update();
		}
	};
	
	Scene_Map.prototype.openNodeWindow = function() {
		this._nodeWindow = new Window_NodeStatus(nodeWindowPos);
		this._nodeWindowOpen = true;
		nodeWindowOpen = true;
		
		this.addWindow(this._nodeWindow);
	};
	
	Scene_Map.prototype.changeNode = function(node, var1, var2, icon1, eval1, eval2, icon2, eval3, eval4, icon3) {
		if (!this.isNodeWindowOpen()) {
			this.openNodeWindow();
		}
		
		this._nodeWindow.changeNode(node, var1, var2, icon1, eval1, eval2, icon2, eval3, eval4, icon3);
	};
	
	Scene_Map.prototype.isNodeWindowOpen = function() {
		if (this._nodeWindowOpen === undefined) return false;
		return this._nodeWindowOpen;
	};
	
	Scene_Map.prototype.closeNodeWindow = function() {
		if (this.isNodeWindowOpen()) {
			this._nodeWindow.close();
			nodeWindowOpen = false;
		}
	};
	
	Scene_Map.prototype.onLoad = function() {
		// Start origin node event handling (mimics player walking onto said event).
		var eId = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y);
		if (eId) {
			$gameMap.event(eId, 1).start();
		}

	};

})(BBS.WorldMap);
//=============================================================================
// End of File
//=============================================================================
