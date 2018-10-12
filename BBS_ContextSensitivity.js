//=============================================================================
// Bluebooth Plugins - Context Sensitivity
// BBS_ContextSensitivity.js
//=============================================================================

//=============================================================================
 /*:
 * @title Context Sensitivity
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Aug 28, 2016
 * @filename BBS_BGMFadeIn.js
 *
 * @plugindesc v1.04 Adds context sensitive HUD during Scene_Map.  Also adds context
 * sensitive icons either all the time, when near an event with context, or never
 * (based on user settings).
 * Credits: Galv's ActionIndicators, Galv Animated Cursors, and Galv_Tools, which
 * serve as the base for this plugin.
 * Special Thanks to 'Ramza' Michael Sweeney for all the support.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Contact me for commercial use
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param === CORE ===
 * @param Default for Showing Context Icons
 * @desc The default for Showing Context Icons in the Options menu.
 * Default true
 * @default true
 *
 * @param Default for Showing Context Popups
 * @desc The default for Showing Context Popups in the Options menu.
 * Default true
 * @default true
 *
 * @param Default for Showing Help Context
 * @desc The default for Showing Context Help in the Options menu.
 * Default true
 * @default true
 *
 * @param Context Popup Button Charset
 * @desc An optional charset with buttons for the Context Popup (animated buttons).
 * Default 
 * @default 
 *
 * @param Context Popup Button Text Color
 * @desc The System color to use for button names in the Context Popup.
 * Default 3
 * @default 3
 *
 * @param Hide HUD Switch Index
 * @desc The Game Switch index for Hiding Context Sensitive UI - use during story events, etc.
 * Default 800
 * @default 800 
 *
 * @param === CONTEXT POPUP ICON ===
 * 
 * @param Context Icon X Offset
 * @desc Pixel X offset from context-sensitive event, used for the context icon.
 * Default 0
 * @default 0
 *
 * @param Context Icon Y Offset
 * @desc Pixel Y offset from context-sensitive event, used for the context icon.
 * Default 0
 * @default 0
 *
 * @param Context Icon Z Position
 * @desc The Z position of the icon (controls if it appears over/under map objects).
 * Default 5
 * @default 5
 *
 * @param Context Icon Opacity
 * @desc 0-255. The opacity of any visible context icons
 * Default 255 (fully opaque)
 * @default 255
 * 
 * @param === CONTEXT POPUP WINDOW ===
 * 
 * @param Context Popup X Offset
 * @desc The x location of the Context Popup.
 * Default 322
 * @default 322
 * 
 * @param Context Popup Y Offset
 * @desc The y location of the Context Popup.
 * Default 84
 * @default 84
 * 
 * @param Context Popup Width
 * @desc Maximum width for the Term window. Default: 312
 * @default 312
 * 
 * @param Context Popup Height
 * @desc Maximum height for the Term window. Default: 74
 * @default 74
 * 
 * @param Context Popup Windowskin
 * @desc The windowskin to apply to the Context Popup Window. Default: 
 * @default 
 * 
 * @param === CONTEXT POPUP TEXT ===
 * 
 * @param Context Popup Font
 * @desc Context Popup Window Font face. Leave blank to use standard. See help.
 * @default
 * 
 * @param Context Popup Size
 * @desc Context Popup Window font size.
 * Default: 20
 * @default 20
 * 
 * @param Context Popup Color
 * @desc Context Popup Window font color. Use CSS format, or leave blank
 * to use standard color.
 * @default
 * 
 * @param Context Popup Outline Color
 * @desc Context Popup Window text outline color. Use CSS format or leave
 * blank to use standard.
 * @default
 * 
 * @param Context Popup Italic
 * @desc Context Popup Window font in Italic?      YES: true      NO: false 
 * Default: false
 * @default false
 *  
 * @param Context Popup Text X Offset
 * @desc The X Offset of the Context Popup Text.
 * Default 48
 * @default 48
 * 
 * @param Context Popup Text Y Offset
 * @desc The Y Offset of the Context Popup Text.
 * Default 10
 * @default 10
 *
 * @param === HELP CONTEXT POPUP ===
 *
 * @param Disable Help Context Switch
 * @desc The Game Switch index for Hiding Help Context - use during story events, etc.
 * Default 8
 * @default 8 
 * 
 * @param Change Help Context Icon Switch
 * @desc The Game Switch index for Switching the Help Context icon.
 * Default 15
 * @default 15
 *  
 * @param Help Context Icon 1 Index
 * @desc Help Context Icon 1
 * Default 3
 * @default 3
 *
 * @param Help Context Icon 2 Index
 * @desc Help Context Icon 2
 * Default 4
 * @default 4
 * 
 * @param Help Context Icon X
 * @desc Pixel X offset for help icon.
 * Default 0
 * @default 0
 *
 * @param Help Context Icon Y
 * @desc Pixel Y offset for help icon.
 * Default 0
 * @default 0
 *  
 * @param Help Text X Offset
 * @desc The X Offset of the Help Context Text.
 * Default 48
 * @default 48
 * 
 * @param Help Text Y Offset
 * @desc The Y Offset of the Help Context Text.
 * Default 10
 * @default 10
 *
 * 
 * @param Help Context Popup Width
 * @desc Maximum width for the Help Context window. Default: 120
 * @default 120
 * 
 * @param Help Context Popup Height
 * @desc Maximum height for the Help Context window. Default: 64
 * @default 64
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Adds context sensitive HUD during Scene_Map.  Also adds context sensitive icons
 * either all the time, when near an event with context, or never (based on user 
 * settings).
 *
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.04 - Help Context Window with changing icon added.
 * 1.03a- Config option added for help context button.
 * 1.03 - Finally got button charset to show.  Seemed to be problem with base.drawCharacter(...) ?
 * 1.02 - Added Context Popup and too many parameters.
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.ContextSensitivity = 1;
BBS.ContextSensitivity = BBS.ContextSensitivity || {};

(function() {

	var _mapNameOpen = false;
	var _dirty = true;
	
   	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_ContextSensitivity');
	var pDefDisplayContextIcons			= String(parameters['Default for Showing Context Icons'] || 'true');	// Display icons above contextual events [YES / NO] will be options menu setting
	var pDefDisplayContextPopups		= String(parameters['Default for Showing Context Popups'] || 'true');	// Display "Press [X] to talk/pet/open/search/fight/teleport/detonate/use/exit, etc."
	var pDefDisplayContextHelp			= String(parameters['Default for showing Help Context'] || 'true');		// [MANUAL/GAEA ICON] Help
	var pButtonCharset					= String(parameters['Context Popup Button Charset'] || '').trim(); 
	var pButtonTextColor				= Number(parameters['Context Popup Button Text Color'] || 3);
	var pHideHudSwitch					= Number(parameters['Hide HUD Switch Index'] || 800);
	
	var pIconXOffset					= Number(parameters['Context Icon X offset'] || 0);
	var pIconYOffset	  				= Number(parameters['Context Icon Y Offset'] || 0);
	var pIconZPos	  					= Number(parameters['Context Icon Z Position'] || 80);						// Want message box - 1 Z pos.
	var pIconOpacity	  				= Number(parameters['Context Icon Icon Opacity'] || 255);
	
	var pContextPopupX					= Number(parameters['Context Popup X Offset'] || 322);
	var pContextPopupY					= Number(parameters['Context Popup Y Offset'] || 84);
	var pContextPopupWidth				= Number(parameters['Context Popup Width'] || 312);
	var pContextPopupHeight				= Number(parameters['Context Popup Height'] || 74);
	var pContextPopupWindowskin			= String(parameters['Context Popup Windowskin'] || '').trim();
	
	var pContextPopupFont				= String(parameters['Context Popup Font'] || '').trim();
	var pContextPopupFontSize			= Number(parameters['Context Popup Font Size'] || 20);
	var pContextPopupTextColor			= String(parameters['Context Popup Text Color'] || '').trim();
	var pContextPopupTextOutlineColor	= String(parameters['Context Popup Text Outline Color'] || '').trim();
	var pContextPopupFontItalic 		= eval(String(parameters['Context Popup Text Italic'] || 'false'));
	var pTextXOffset					= Number(parameters['Context Popup Text X Offset'] || 48);
	var pTextYOffset					= Number(parameters['Context Popup Text Y Offset'] || 10);
	
	var pDisableHelpSwitch				= Number(parameters['Disable Help Context Switch'] || 8);
	var pChangeHelpIconSwitch			= Number(parameters['Change Help Context Icon Switch'] || 15);
	var pHelpIcon1Id					= Number(parameters['Help Context Icon 1 Index'] || 3);
	var pHelpIcon2Id					= Number(parameters['Help Context Icon 2 Index'] || 4);
	var pHelpIconX						= Number(parameters['Help Context Icon X'] || 0);
	var pHelpIconY						= Number(parameters['Help Context Icon Y'] || 0);
	var pHelpTextXOffset				= Number(parameters['Help Text X Offset'] || 10);
	var pHelpTextYOffset				= Number(parameters['Help Text Y Offset'] || 10);
	var pHelpContextPopupWidth			= Number(parameters['Help Context Popup Width'] || 120);
	var pHelpContextPopupHeight			= Number(parameters['Help Context Popup Height'] || 64);

	var pDebugging = false;
	
	
	checkContextIcon = function() {
		var x2 = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
		var y2 = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
		var action = null;
		
		// Skip the events we're standing on top of, because it's too late to provide
		// context for them.
		
		// CHECK EVENT IN FRONT
		if (!action) {
			$gameMap.eventsXy(x2, y2).forEach(function(event) {
				// Get events below and at player priority levels. -Ramza
				if (event._priorityType < 2) {
					action = checkEventForContextIcon(event);
				};
			});
		};
		
		// CHECK COUNTER
		if (!action && $gameMap.isCounter(x2, y2)) {
			var direction = $gamePlayer.direction();
			var x3 = $gameMap.roundXWithDirection(x2, direction);
			var y3 = $gameMap.roundYWithDirection(y2, direction);
			$gameMap.eventsXy(x3, y3).forEach(function(event) {
				// Get events below and at player priority levels. -Ramza
				if (event._priorityType < 2) {
					action = checkEventForContextIcon(event);
				};
			});
		};
		
		action = action || {'eventId': 0, 'iconId': 0};
		$gamePlayer.actionIconTarget = action;
	};


	checkEventForContextIcon = function(event) {
		if (event.page()) {
			var listCount = event.page().list.length;
			
			for (var i = 0; i < listCount; i++) {
				if (event.page().list[i].code === 108) {
					// Parse comment out here.  Optimization note: should this all be loaded into DB first?  
					var iconCheck = event.page().list[i].parameters[0].match(/<contextInfo: (.*)>/i);
					if (iconCheck) {
						var args = iconCheck[1].split(",");
						if (pDebugging === true) {
							console.log(args);
						}
						
						for (var i = 0; i < args.length; i++) {
							args[i] = args[i].trim();
						}
						
						// create target object
						return {'eventId': event._eventId, 'iconId': Number(args[0]), 'input': String(args[1]), 'context': String(args[2])};
						break;
					};
				};
			};
		};
		
		return null;
	};
	
	getInputIndex = function(input) {
		var index = 0;
		
		switch(input) {
			case 'ok':
				index = 0;
				break;
			case 'cancel':
				index = 1;
				break;
			case 'menu':
				index = 2;
				break;
			case 'shift':
				index = 3;
				break;
			case 'ltrigger':
				index = 4;
				break;
			case 'rtrigger':
				index = 5;
				break;
			case 'select':
				index = 6;
				break;
			case 'touch':
				index = 7;
				break;
			default:
				// Bad input.
				console.log("Rejected input button " + input + "!");
				index = -1;
				break;
		};
		
		return index;
	};
			
	//=============================================================================
	// Game_System
	//=============================================================================
	var BBS_CSI_Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		BBS_CSI_Game_System_initialize.call(this);
	};

	//=============================================================================
	// Game_Map
	//=============================================================================
	var BBS_CSI_Game_Map_requestRefresh = Game_Map.prototype.requestRefresh;
	Game_Map.prototype.requestRefresh = function(mapId) {
		BBS_CSI_Game_Map_requestRefresh.call(this, mapId);
		_dirty = true;
	};
	
	//=============================================================================
	// Game_CharacterBase
	//=============================================================================
	var BBS_CSI_Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
	Game_CharacterBase.prototype.moveStraight = function(direction) {
		BBS_CSI_Game_CharacterBase_moveStraight.call(this, direction);
		_dirty = true;
	};

	//=============================================================================
	// Spriteset_Map
	//=============================================================================
	var BBS_CSI_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
	Spriteset_Map.prototype.createLowerLayer = function() {
		BBS_CSI_Spriteset_Map_createLowerLayer.call(this);
		this.createCSIHud();
	};

	Spriteset_Map.prototype.createCSIHud = function() {
		this._contextIconSprite = new Sprite_ActionIcon();
		this._tilemap.addChild(this._contextIconSprite);
	};
	
	//=============================================================================
	// Scene_Map
	//=============================================================================
	var BBS_CSI_Scene_Map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		BBS_CSI_Scene_Map_start.call(this);
		this._contextPopup = new Window_Context_Popup();
		this._helpPopup = new Window_HelpContext_Popup();
		this.addChild(this._contextPopup);
		this.addChild(this._helpPopup);
	};
	
	//=============================================================================
	// Window_MapName
	//=============================================================================	
	var BBS_CSI_Window_MapName_updateFadeIn = Window_MapName.prototype.updateFadeIn;
	Window_MapName.prototype.updateFadeIn = function() {
		BBS_CSI_Window_MapName_updateFadeIn.call(this);
		if (this.contentsOpacity > 0) {
			_mapNameOpen = true;
		}
	};

	var BBS_CSI_Window_MapName_updateFadeOut = Window_MapName.prototype.updateFadeOut;
	Window_MapName.prototype.updateFadeOut = function() {
		BBS_CSI_Window_MapName_updateFadeOut.call(this);
		if (this.contentsOpacity < 1) {
			_mapNameOpen = false;
		}
	};

	var BBS_CSI_Window_MapName_open = Window_MapName.prototype.open;
	Window_MapName.prototype.open = function() {
		BBS_CSI_Window_MapName_open.call(this);
		_mapNameOpen = true;
	};

	var BBS_CSI_Window_MapName_close = Window_MapName.prototype.close;
	Window_MapName.prototype.close = function() {
		BBS_CSI_Window_MapName_close.call(this);
		_mapNameOpen = false;
	};

	var BBS_CSI_WindowLayer_webglMaskWindow = WindowLayer.prototype._webglMaskWindow;
	WindowLayer.prototype._webglMaskWindow = function(renderSession, win) {
		if (win._ignoreMask) return;
		BBS_CSI_WindowLayer_webglMaskWindow.call(this, renderSession, win);
	};

	//=============================================================================
	// Window_HelpContext_Popup
	//=============================================================================
	function Window_HelpContext_Popup() {
		this.initialize.apply(this, arguments);
	}

	Window_HelpContext_Popup.prototype = Object.create(Window_Base.prototype);
	Window_HelpContext_Popup.prototype.constructor = Window_HelpContext_Popup;
	
	Window_HelpContext_Popup.prototype.initialize = function() {
		var x = 10;
		var y = 10;
		var width = Math.min(pHelpContextPopupWidth, Graphics.boxWidth - 10);
		var height = Math.min(pHelpContextPopupHeight, Graphics.boxHeight - 10);

		Window_Base.prototype.initialize.call(this, x, y, width, height);		
		if (pContextPopupWindowskin !== '') {
			this.windowskin = ImageManager.loadSystem(pContextPopupWindowskin);
		}
		else {			
			this._ignoreMask = true;
			this.opacity = 0;
		}
		
		this._iconId = undefined;
		this._correctIconId = undefined;
		if ($gameSwitches.value(pChangeHelpIconSwitch) === true) {
			this._correctIconId = pHelpIcon2Id;
		}
		else {
			this._correctIconId = pHelpIcon1Id;
		}
		
		this.mod = 0.2;
		this.contentsOpacity = 255;
		this.hide();
	};
	
	Window_HelpContext_Popup.prototype.drawGabBackground = function() {
		var width = this.contentsWidth();
		this.drawBackground(0, 0, width, this.lineHeight() * 2);
	};

	// Thanks to Yanfly
	Window_HelpContext_Popup.prototype.drawBackground = function(wx, wy, ww, wh) {
		var color1 = this.dimColor1();
		var color2 = this.dimColor2();
		var ww1 = Math.ceil(ww * 0.25)
		var ww2 = Math.ceil(ww * 0.75)
		this.contents.gradientFillRect(wx, wy, ww1, wh, color1, color1);
		this.contents.gradientFillRect(ww1, wy, ww2, wh, color1, color2);
	};

	Window_HelpContext_Popup.prototype.clear = function() {
		this.hide();
	};
		
	Window_HelpContext_Popup.prototype.updateOpacity = function() {
		if (_mapNameOpen === true || $gameSwitches.value(pHideHudSwitch) === true || $gameSwitches.value(pDisableHelpSwitch) === true) {
			this._iconId = undefined;
			this.hide();
			return;
		} 
				
		// Open again if we have a valid context.
		if (ConfigManager.displayContextHelp) {
			this.show();
			return;
		}
	};
	
	Window_HelpContext_Popup.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.updateOpacity();
		
		// Minimize number of redraws.
		if (this.visible === true && this._iconId !== this._correctIconId) {
			this.initPopVars();
			this._dirty = true;
			this.refresh(); 
		}
	};
	
	Window_HelpContext_Popup.prototype.refresh = function() {
		if (this._dirty === false) { return; }
		if ($gameSwitches.value(pDisableHelpSwitch) === true) {
			this.contents.clear();
			this.hide();
			return; 
		}		

		if (pDebugging) {
			console.log("Redrawing Help Popup");
		}
		
		// Prep for draw
		this.contents.clear();
		this.resetFontSettings();
		this.contentsOpacity = 255;
		this.drawGabBackground();
				
		var drawWidth = this.width - this.textPadding() - this.standardPadding() * 2;
		var drawX = this.standardPadding() * 2;
		var drawY = pHelpTextYOffset;
		
		// Handle customization options
		this.contents.fontSize = pContextPopupFontSize;
		this.contents.fontItalic = pContextPopupFontItalic;
		if(pContextPopupFont !== '') {
			this.contents.fontFace = pContextPopupFont;	
		}
		
		if(pContextPopupTextOutlineColor !== '') {
			this.contents.outlineColor = pContextPopupTextOutlineColor;
		}
		
		// Draw text appropriate to context
		if ($gameSwitches.value(pChangeHelpIconSwitch) === true) {
			this._correctIconId = pHelpIcon2Id;
			this._iconId = pHelpIcon2Id;
			
			this.drawIcon(this._iconId, drawX, drawY);
		}
		else {
			this._correctIconId = pHelpIcon1Id;
			this._iconId = pHelpIcon1Id;
			
			this.drawIcon(this._iconId, drawX, drawY);
		}

		drawX = drawX + 32 + this.standardPadding() * 2;
		drawY = drawY - 2;
	
	
		text = "\\c[" + pButtonTextColor + "]\\fiHelp\\fi\\c[0]";
		this.drawTextEx(text, drawX, drawY);
		this._dirty = false;
	};
	
	Window_HelpContext_Popup.prototype.standardPadding = function() {
		return 6;
	};

	Window_HelpContext_Popup.prototype.textPadding = function() {
		return 4;
	};

	Window_HelpContext_Popup.prototype.initPopVars = function() {
		this.opacity = 0;
		this.mod = 0.2;
	};
	
	//=============================================================================
	// Window_Context_Popup
	//=============================================================================
	function Window_Context_Popup() {
		this.initialize.apply(this, arguments);
	}

	Window_Context_Popup.prototype = Object.create(Window_Base.prototype);
	Window_Context_Popup.prototype.constructor = Window_Context_Popup;
	
	Window_Context_Popup.prototype.initialize = function() {
		var x = Graphics.boxWidth - pContextPopupX;
		var y = Graphics.boxHeight - pContextPopupY;
		var width = Math.min(pContextPopupWidth, Graphics.boxWidth);
		var height = Math.min(pContextPopupHeight, Graphics.boxHeight);

		Window_Base.prototype.initialize.call(this, x, y, width, height);		
		if (pContextPopupWindowskin !== '') {
			this.windowskin = ImageManager.loadSystem(pContextPopupWindowskin);
		}
		else {
			this._ignoreMask = true;
			this.opacity = 0;
		}
		
		this._buttonAnim = new Sprite_AnimatedButton(this);
		this.addChild(this._buttonAnim);

		this._input = $gamePlayer.actionIconTarget.input;
		this._context = $gamePlayer.actionIconTarget.context;
		this._buttonCharsetIndex = -1;
		this.mod = 0.2;
		
		this.contentsOpacity = 255;
		this.hide();
	};
	
	Window_Context_Popup.prototype.clear = function() {
		this._context = '';
		this.setPopupDetails();
	};

	Window_Context_Popup.prototype.setPopupDetails = function() {	
		if (this._context === '') {
			this._input = '';
			text = "";
			
			this._buttonCharsetIndex = -1;
			
			this.hide();
			this.setButtonChar();
			this.refresh();
		} 
		else {
			this._input = $gamePlayer.actionIconTarget.input;
			
			// -1 is special index meant to indicate NO CHAR TO DISPLAY.
			this._buttonCharsetIndex = 0;
			this.setButtonChar();
			this._dirty = true;
			this.show();
			
			this.refresh();
		}
	};
	
	Window_Context_Popup.prototype.setButtonChar = function() {
		if (this._buttonCharsetIndex === -1) { return; }
		
		if (pDebugging === true) {
			console.log(pButtonCharset);
			console.log(this._buttonBitmap);
			console.log(this._buttonCharsetIndex);
			console.log(this._input);
		}
		
		// Don't bother processing charset display if no charset.
		// [0: OK, 1: CANCEL, 2: MENU, 3: SHIFT, 4: LTRIGGER, 5: RTRIGGER, 6: START/SELECT, 7: TOUCH]
		if (this._buttonBitmap !== undefined) {
			this._buttonIndex = getInputIndex(this._input);
		}
	};
	
		
	Window_Context_Popup.prototype.drawGabBackground = function() {
		var width = this.contentsWidth();
		this.drawBackground(0, 0, width, this.lineHeight() * 2);
	};

	// Thanks to Yanfly
	Window_Context_Popup.prototype.drawBackground = function(wx, wy, ww, wh) {
		var color1 = this.dimColor1();
		var color2 = this.dimColor2();
		var ww1 = Math.ceil(ww * 0.25)
		var ww2 = Math.ceil(ww * 0.75)
		this.contents.gradientFillRect(wx, wy, ww1, wh, color1, color1);
		this.contents.gradientFillRect(ww1, wy, ww2, wh, color1, color2);
	};
	
	Window_Context_Popup.prototype.updateOpacity = function() {
		if ($gameSwitches.value(pHideHudSwitch) === true) {
			this.hide();
			return;
		} 
		
		// Open again if we have a valid context.
		if (ConfigManager.displayContextPopups && this._context !== undefined) {
			this.show();
			return;
		}
	};
	
	Window_Context_Popup.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.updateOpacity();
		
		// If variables don't match, need to redraw - don't rely on _dirty, it is set to true when drawing icon.
		if (this._context !== $gamePlayer.actionIconTarget.context) {	
			this._context = $gamePlayer.actionIconTarget.context;
			this.setPopupDetails();
			this.initPopVars();
			this.refresh(); 
		}
		
	};
	
	Window_Context_Popup.prototype.refresh = function() {
		if (this._dirty === false) { return; }
		if (this._context === undefined) {
			this.contents.clear();
			this.hide();
			return; 
		}
		
		// Prep for draw
		this.contents.clear();
		this.resetFontSettings();
		this.contentsOpacity = 255;
		this.drawGabBackground();
				
		var drawWidth = this.width - this.textPadding() - this.standardPadding() * 2;
		var drawX = this.standardPadding() * 2;
		var drawY = 0;
		
		// Handle customization options
		this.contents.fontSize = pContextPopupFontSize;
		this.contents.fontItalic = pContextPopupFontItalic;
		if(pContextPopupFont !== '') {
			this.contents.fontFace = pContextPopupFont;	
		}
		
		if(pContextPopupTextOutlineColor !== '') {
			this.contents.outlineColor = pContextPopupTextOutlineColor;
		}

		if (pButtonCharset !== '') {
			if (pDebugging === true) {
				console.log(pButtonCharset);
				console.log(this._buttonCharsetIndex);
				console.log(drawX);
				console.log(drawY);
			}
			
			this.drawCharacter(pButtonCharset, this._buttonCharsetIndex, drawX, drawY);
		}

		//drawX = drawX + pTextXOffset + this.standardPadding() * 2;
		drawY = drawY + pTextYOffset;
		
		// Draw text appropriate to context
		if (this._input === 'touch') {
			text = "\\c[" + pButtonTextColor + "]\\fiTouch\\c[0]\\fi  to " + this._context;
		}
		else {
			text = "Press \\fi\\c[" + pButtonTextColor + "]" + this._input + "\\c[0]\\fi  to " + this._context;
		}
		
		this.drawTextEx(text, drawX, drawY);
		this._dirty = false;
	};
	
	Window_Context_Popup.prototype.standardPadding = function() {
		return 6;
	};

	Window_Context_Popup.prototype.textPadding = function() {
		return 4;
	};

	Window_Context_Popup.prototype.initPopVars = function() {
		this.opacity = 0;
		this.mod = 0.2;
	};
	
	
	//=============================================================================
	// Sprite_AnimatedButton
	//=============================================================================
	// Thanks to Galv Cursor Image for the idea.
	function Sprite_AnimatedButton() {
		this.initialize.apply(this, arguments);
	}

	Sprite_AnimatedButton.prototype = Object.create(Sprite_Base.prototype);
	Sprite_AnimatedButton.prototype.constructor = Sprite_AnimatedButton;

	Sprite_AnimatedButton.prototype.initialize = function(window) {
		Sprite_Base.prototype.initialize.call(this);
		this._window = window;
		this.createImage();
		this._ticker = 0;
		this._pattern = 0;
		this.x = this._window.standardPadding() * 2;
		this.y = this._window.standardPadding() + this._window.textPadding() + 24;
		this.frameWidth = 48;
		this.frameHeight = 48;
		this.updateFrame();
	};

	Sprite_AnimatedButton.prototype.createImage = function() {
		this.bitmap = ImageManager.loadCharacter(pButtonCharset);
		this._maxPattern = 2;
		this._tickSpeed = 30;
		this.anchor.y = 0.5;
		this.opacity = 0;
	};

	// UPDATE IF VISIBLE
	Sprite_AnimatedButton.prototype.update = function() {
		if (ConfigManager.displayContextPopups !== true) { return; }
		
		Sprite_Base.prototype.update.call(this);
		if (this._window.visible === true) {
			this.opacity = this._window.opacity;
			this.updateFrame();
		} else {
			this.opacity = 0;
		}
	};
	
	// MUST MATCH WITH CHARSET 
	Sprite_AnimatedButton.prototype.updateFrame = function() {
		var n = getInputIndex(this._window._input);
		var max = this._maxPattern + 1;
		
		var sx = (n % 4 * 3 + this._pattern) * this.frameWidth;
		var sy = (Math.floor(n / 4) * 4) * this.frameHeight;
	
		if (pDebugging === true) {
			console.log(this._window._input);
			console.log(n);
			console.log(this._pattern);
			console.log(max);
			
			console.log(sx);
			console.log(sy);
			console.log(this.frameWidth);
			console.log(this.frameHeight);
			console.log(this.x);
			console.log(this.y);
			console.log(this._window.opacity);
		}
		
		this.setFrame(sx, sy, this.frameWidth, this.frameHeight);
		
		this._ticker += 1;
		if (this._ticker >= this._tickSpeed) {
			this._pattern = this._pattern == this._maxPattern ? 0 : this._pattern + 1;
			this._ticker = 0;
		}		
	};
	
	//=============================================================================
	// Sprite_ActionIcon
	//=============================================================================
	function Sprite_ActionIcon() {
		this.initialize.apply(this, arguments);
	}

	Sprite_ActionIcon.prototype = Object.create(Sprite.prototype);
	Sprite_ActionIcon.prototype.constructor = Sprite_ActionIcon;

	Sprite_ActionIcon.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);
		$gamePlayer.actionIconTarget = $gamePlayer.actionIconTarget || {'eventId': 0, 'iconId': 0}; 
		this._iconIndex = 0;
		this.z = pIconZPos;
		this.changeBitmap();
		this._tileWidth = $gameMap.tileWidth();
		this._tileHeight = $gameMap.tileHeight();
		this._offsetX = -(Window_Base._iconWidth / 2);
		this._offsetY = -38 + pIconYOffset;
		this.anchor.y = 1;
		this._float = 0.1;
		this.mod = 0.2;
		_dirty = true;
	};

	Sprite_ActionIcon.prototype.changeBitmap = function() {
		if ($gamePlayer.actionIconTarget.eventId <= 0) {
			this._iconIndex = 0;
		} else {
			this._iconIndex = $gamePlayer.actionIconTarget.iconId;
		};

		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = this._iconIndex % 16 * pw;
		var sy = Math.floor(this._iconIndex / 16) * ph;
		
		this.bitmap = new Bitmap(pw,ph);
		if (this._iconIndex <= 0) return;
		var bitmap = ImageManager.loadSystem('IconSet');
		this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
		_dirty = false;
	};

	Sprite_ActionIcon.prototype.initPopVars = function() {
		this.scale.y = 0.1;
		this.opacity = 0;
		this.mod = 0.2;
		this._float = 0.1;
	};

	Sprite_ActionIcon.prototype.updateOpacity = function() {
		if ($gameSwitches.value(pHideHudSwitch) === true) {
			this.opacity -= 40;
			return;
		}
		
		this.opacity = ConfigManager.displayContextIcons ? pIconOpacity : 0;
	};

	Sprite_ActionIcon.prototype.update = function() {
		Sprite.prototype.update.call(this);
		
		if (_dirty === true) checkContextIcon();
		
		if ($gamePlayer.actionIconTarget.eventId != this._eventId) {
			this.initPopVars();
			this._eventId = $gamePlayer.actionIconTarget.eventId;
		}
		
		if (this._iconIndex !== $gamePlayer.actionIconTarget.iconId) this.changeBitmap();
		if (this._iconIndex <= 0) return;

		
		this.x = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenX() + this._offsetX;
		this.y = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenY() + this._offsetY + this._float;

		this.scale.y = Math.min(this.scale.y + 0.1, 1);
		
		this.updateOpacity();

		this._float += this.mod;
		if (this._float < -0.1) {
			this.mod = Math.min(this.mod + 0.01, 0.2);
		} else if (this._float >= 0.1) {
			this.mod = Math.max(this.mod + -0.01, -0.2);
		};

	};
	
	//=============================================================================
	// ConfigManager
	//=============================================================================
	getDefaultDisplayContextIconsOption = function() {
		if (pDefDisplayContextIcons.match(/true/i)) {
		  return true;
		} else if (pDefDisplayContextIcons.match(/false/i)) {
		  return false;
		} else {
		  return Utils.isNwjs();
		}
	};

	getDefaultDisplayContextPopupsOption = function() {
		if (pDefDisplayContextPopups.match(/true/i)) {
		  return true;
		} else if (pDefDisplayContextPopups.match(/false/i)) {
		  return false;
		} else {
		  return Utils.isNwjs();
		}
	};
	
	getDefaultDisplayContextHelpOption = function() {
		if (pDefDisplayContextHelp.match(/true/i)) {
		  return true;
		} else if (pDefDisplayContextHelp.match(/false/i)) {
		  return false;
		} else {
		  return Utils.isNwjs();
		}
	};
	
	
	ConfigManager.displayContextIcons = getDefaultDisplayContextIconsOption();
	ConfigManager.displayContextPopups = getDefaultDisplayContextPopupsOption();
	ConfigManager.displayContextHelp = getDefaultDisplayContextHelpOption();

	var bbs_csi_Configmanager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var config = bbs_csi_Configmanager_makeData.call(this);
		config.displayContextIcons = this.displayContextIcons;
		config.displayContextPopups = this.displayContextPopups;
		config.displayContextHelp = this.displayContextHelp;
		return config;
	};

	var bbs_csi_Configmanager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		bbs_csi_Configmanager_applyData.call(this, config);
		this.displayContextIcons = this.readDisplayContextIconsOption(config, 'displayContextIcons');
		this.displayContextPopups = this.readDisplayContextPopupsOption(config, 'displayContextPopups');
		this.displayContextHelp = this.readDisplayContextHelpOption(config, 'displayContextHelp');
	};

	ConfigManager.readDisplayContextIconsOption = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return value;
		} else {
			return getDefaultDisplayContextIconsOption();
		}
	};

	ConfigManager.readDisplayContextPopupsOption = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return value;
		} else {
			return getDefaultDisplayContextPopupsOption();
		}
	};
	
	ConfigManager.readDisplayContextHelpOption = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return value;
		} else {
			return getDefaultDisplayContextHelpOption();
		}
	};
	
	
	//=============================================================================
	// Window_Options
	//=============================================================================
	var bbs_csi_Window_Options_addGeneralOptions =
		Window_Options.prototype.addGeneralOptions;
	Window_Options.prototype.addGeneralOptions = function() {
		bbs_csi_Window_Options_addGeneralOptions.call(this);
		this.addCommand('Show Context Icons?', 'displayContextIcons');
		this.addCommand('Show Context Popups?', 'displayContextPopups');
		this.addCommand('Show Help Context?', 'displayContextHelp');
	};
	
})(BBS.ContextSensitivity);
//=============================================================================
// End of File
//=============================================================================
