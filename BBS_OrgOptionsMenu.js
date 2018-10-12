//=============================================================================
// Bluebooth Plugins - Organized Options Menu
// BBS_OrgOptionsMenu.js
//=============================================================================

//=============================================================================
 /*:
 * @title Organized Options Menu
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Feb 13, 2016
 * @filename BBS_OrgOptionsMenu.js
 * If you enjoy my work, consider supporting me on Patreon!
 *
 * https://www.patreon.com/bluebooth
 *
 * @plugindesc v1.03 Organizes options menu into categories.  No more disorganized
 * options menu!  Designed to hook in to option menu additions from other plugins 
 * with minimal changes.
 * Special Thanks to Tsukihime for all the help.
 * Special Thanks to 'Ramza' Michael Sweeney for helping so much with testing.
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
 * @param Graphics Option Text
 * @desc Text to display for the graphics option item.  Default: Graphics
 * @default Graphics
 *
 * @param Audio Option Text
 * @desc Text to display for the graphics option item.  Default: Audio
 * @default Audio
 *
 * @param Gameplay Option Text
 * @desc Text to display for all other option item.  Default: Gameplay
 * @default Gameplay
 * 
 * @param Customize Option Text
 * @desc Text to display for all GUI option item.  Default: Customize
 * @default Customize
 * 
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Organizes options menu into categories.  No more disorganized options menu!  Designed to hook in
 * to option menu additions from other plugins with minimal changes.
 * 
 * ============================================================================
 * Change Log
 * 
 * 1.03b - Added in brightness support variable
 * 1.03a - Added in support for new Log Speed option.
 * 1.03  - Added in new Customize section with support with LeNotification additions.
 * 1.02d - Now compatible with BBS_DifficultyLevels.
 * 1.02c - SRD's Fullscreen option now sorts into Graphics menu.
 * 1.02b - Sliders are now processed as separate category after scene change commands and before common option commands (true/false).
 *		   Options are therefore organized in decreasing order of complexity.
 * 1.02a - Input options moved to main options menu, as submenu caused scene creation to fail for them.
 * 1.02 - Alphabetical sorting added by special and then normal commands.
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.OrgOptionsMenu = 1;
BBS.OrgOptionsMenu = BBS.OrgOptionsMenu || {};

(function() {

	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_OrgOptionsMenu');
	var pGrOptText	  = String(parameters['Graphics Option Text'] || 'Graphics');
	var pAuOptText	  = String(parameters['Audio Option Text'] || 'Audio');
	var pGaOptText	  = String(parameters['Gameplay Option Text'] || 'Gameplay');
	var pCuOptText	  = String(parameters['Customize Option Text'] || 'Customize');
	var pDebugging	  = eval(String(parameters['Debug Mode'] || 'false'));
	
	// Prepare array vars
	var _allGrOptSymbols = ['brightness', 'animateTiles', 'battleCamera', 'synchFps', 'flashes', 'fullscreen', 'lighting', 'fog'];
	var _allAuOptSymbols = ['bgmVolume', 'bgsVolume', 'meVolume', 'seVolume', 'closedCaptioning'];
	var _allCuOptSymbols = ['logSpeed', 'displayContextHelp', 'logAudioChanges', 'logSkillChanges', 'logLevelChanges', 'logItemChanges', 'logExpChanges', 'logGoldChanges'];
	var _allGaOptSymbols = [];
	
	
	// Controller/Keyboard Input members of gameplay.
	var _allReOptSymbols = ['auConfig', 'gaConfig', 'cuConfig', 'gamepadConfig', 'keyConfig', 'grConfig'];
	
	// The following commands all cause scene changes, and are not drawn or processed like other options.
	var _allSceneChangeSymbols = ['auConfig', 'gaConfig', 'cuConfig', 'gamepadConfig', 'grConfig', 'keyConfig'];
	
	var _allSliderSymbols = ['bgmVolume', 'bgsVolume', 'meVolume', 'seVolume', 'brightness', 'battleDifficulty', 'puzzleDifficulty'];
	
	// Arrays for sorting and catching input options from other plugins.
	var _grOptCommands = [];
	var _auOptCommands = [];
	var _gaOptCommands = [];
	var _cuOptCommands = [];
	
	// For the sake of readability.  Debugging this is hard enough already.
	var searchArr = function(symbol, arr) {
		if (pDebugging === true) { console.log("Searching: " + arr + " for " + symbol); }
		
		for (var i=0; i < arr.length; i++) {
			if (pDebugging === true) { console.log("Comparing: " + arr[i].symbol + " vs " + symbol); }
			if (arr[i].symbol === symbol) {
				if (pDebugging === true) { console.log("Found: " + symbol + " in " + arr + " at index: " + i); }
				return i;
			}
		}
		
		if (pDebugging === true) { console.log("Did not find: " + symbol + " in " + arr); }
		return -1;
	};
 
	//=============================================================================
	// Window_GrOptions
	//=============================================================================
	function Window_GrOptions() {
		this.initialize.apply(this, arguments);
	}

	Window_GrOptions.prototype = Object.create(Window_Options.prototype);
	Window_GrOptions.prototype.constructor = Window_GrOptions;

	Window_GrOptions.prototype.initialize = function() {
		Window_Options.prototype.initialize.call(this, 0, 0);
	};

	Window_GrOptions.prototype.makeCommandList = function() {
		this.cmdFilter = _allGrOptSymbols;
		this.addGraphicOptions();
	};

	Window_GrOptions.prototype.addGraphicOptions = function() {
		var grSpecCommands = [];
		var grSliderCommands = [];
		var grNormCommands = [];
		
		for (var i = 0; i < _grOptCommands.length; i++) {
			if (_allSceneChangeSymbols.indexOf(_grOptCommands[i].symbol) != -1) {
				grSpecCommands.push({ name: _grOptCommands[i].name, symbol: _grOptCommands[i].symbol, enabled: _grOptCommands[i].enabled, ext: _grOptCommands[i].ext });
			} else if (_allSliderSymbols.indexOf(_grOptCommands[i].symbol) != -1) {
				grSliderCommands.push({ name: _grOptCommands[i].name, symbol: _grOptCommands[i].symbol, enabled: _grOptCommands[i].enabled, ext: _grOptCommands[i].ext });				
			} else {
				grNormCommands.push({ name: _grOptCommands[i].name, symbol: _grOptCommands[i].symbol, enabled: _grOptCommands[i].enabled, ext: _grOptCommands[i].ext });
			}
		}

		// Scene change options always go first, in alphabetical order.
		for (var i = 0; i < grSpecCommands.length; i++) {
			this.addCommand(grSpecCommands[i].name, grSpecCommands[i].symbol, grSpecCommands[i].enabled, grSpecCommands[i].ext);
		}

		// Sliders go next, in alphabetical order.
		for (var i = 0; i < grSliderCommands.length; i++) {
			this.addCommand(grSliderCommands[i].name, grSliderCommands[i].symbol, grSliderCommands[i].enabled, grSliderCommands[i].ext);
		}
		
		// Remaining options go last, in alphabetical order.
		for (var i = 0; i < grNormCommands.length; i++) {
			this.addCommand(grNormCommands[i].name, grNormCommands[i].symbol, grNormCommands[i].enabled, grNormCommands[i].ext);
		}
	};

	//=============================================================================
	// Window_AuOptions
	//=============================================================================
	function Window_AuOptions() {
		this.initialize.apply(this, arguments);
	}
	
	Window_AuOptions.prototype = Object.create(Window_Options.prototype);
	Window_AuOptions.prototype.constructor = Window_AuOptions;
	
	Window_AuOptions.prototype.initialize = function() {
		Window_Options.prototype.initialize.call(this, 0, 0);
	};

	Window_AuOptions.prototype.makeCommandList = function() {
		this.cmdFilter = _allAuOptSymbols;
		this.addVolumeOptions();
	};

	Window_AuOptions.prototype.addVolumeOptions = function() {
		var auSpecCommands = [];
		var auSliderCommands = [];
		var auNormCommands = [];
		
		for (var i = 0; i < _auOptCommands.length; i++) {
			if (_allSceneChangeSymbols.indexOf(_auOptCommands[i].symbol) != -1) {
				auSpecCommands.push({ name: _auOptCommands[i].name, symbol: _auOptCommands[i].symbol, enabled: _auOptCommands[i].enabled, ext: _auOptCommands[i].ext });
			} 
			else if (_allSliderSymbols.indexOf(_auOptCommands[i].symbol) != -1) {
				auSliderCommands.push({ name: _auOptCommands[i].name, symbol: _auOptCommands[i].symbol, enabled: _auOptCommands[i].enabled, ext: _auOptCommands[i].ext });				
			} else {
				auNormCommands.push({ name: _auOptCommands[i].name, symbol: _auOptCommands[i].symbol, enabled: _auOptCommands[i].enabled, ext: _auOptCommands[i].ext });
			}
		}

		// Scene change options always go first, in alphabetical order.
		for (var i = 0; i < auSpecCommands.length; i++) {
			this.addCommand(auSpecCommands[i].name, auSpecCommands[i].symbol, auSpecCommands[i].enabled, auSpecCommands[i].ext);
		}

		// Sliders go next, in alphabetical order.
		for (var i = 0; i < auSliderCommands.length; i++) {
			this.addCommand(auSliderCommands[i].name, auSliderCommands[i].symbol, auSliderCommands[i].enabled, auSliderCommands[i].ext);
		}
		
		// Remaining options go last, in alphabetical order.
		for (var i = 0; i < auNormCommands.length; i++) {
			this.addCommand(auNormCommands[i].name, auNormCommands[i].symbol, auNormCommands[i].enabled, auNormCommands[i].ext);
		}
	};
	
	//=============================================================================
	// Window_GaOptions
	//=============================================================================
	function Window_GaOptions() {
		this.initialize.apply(this, arguments);
	}

	Window_GaOptions.prototype = Object.create(Window_Options.prototype);
	Window_GaOptions.prototype.constructor = Window_GaOptions;

	Window_GaOptions.prototype.initialize = function() {
		Window_Options.prototype.initialize.call(this, 0, 0);
	};

	Window_GaOptions.prototype.makeCommandList = function() {
		this.cmdFilter = _allGaOptSymbols;
		this.addGeneralOptions();
	};

	Window_GaOptions.prototype.addGeneralOptions = function() {
		var gaSpecCommands = [];
		var gaSliderCommands = [];
		var gaNormCommands = [];
		
		for (var i = 0; i < _gaOptCommands.length; i++) {
			if (_allSceneChangeSymbols.indexOf(_gaOptCommands[i].symbol) != -1) {
				gaSpecCommands.push({ name: _gaOptCommands[i].name, symbol: _gaOptCommands[i].symbol, enabled: _gaOptCommands[i].enabled, ext: _gaOptCommands[i].ext });
			} else if (_allSliderSymbols.indexOf(_gaOptCommands[i].symbol) != -1) {
				gaSliderCommands.push({ name: _gaOptCommands[i].name, symbol: _gaOptCommands[i].symbol, enabled: _gaOptCommands[i].enabled, ext: _gaOptCommands[i].ext });				
			} else {
				gaNormCommands.push({ name: _gaOptCommands[i].name, symbol: _gaOptCommands[i].symbol, enabled: _gaOptCommands[i].enabled, ext: _gaOptCommands[i].ext });
			}
		}

		// Scene change options always go first, in alphabetical order.
		for (var i = 0; i < gaSpecCommands.length; i++) {
			this.addCommand(gaSpecCommands[i].name, gaSpecCommands[i].symbol, gaSpecCommands[i].enabled, gaSpecCommands[i].ext);
		}
		
		// Sliders go next, in alphabetical order.
		for (var i = 0; i < gaSliderCommands.length; i++) {
			this.addCommand(gaSliderCommands[i].name, gaSliderCommands[i].symbol, gaSliderCommands[i].enabled, gaSliderCommands[i].ext);
		}
		
		// Remaining options go last, in alphabetical order.
		for (var i = 0; i < gaNormCommands.length; i++) {
			this.addCommand(gaNormCommands[i].name, gaNormCommands[i].symbol, gaNormCommands[i].enabled, gaNormCommands[i].ext);
		}		
	};

	//=============================================================================
	// Window_CuOptions
	//=============================================================================
	function Window_CuOptions() {
		this.initialize.apply(this, arguments);
	}

	Window_CuOptions.prototype = Object.create(Window_Options.prototype);
	Window_CuOptions.prototype.constructor = Window_CuOptions;

	Window_CuOptions.prototype.initialize = function() {
		Window_Options.prototype.initialize.call(this, 0, 0);
	};

	Window_CuOptions.prototype.makeCommandList = function() {
		this.cmdFilter = _allCuOptSymbols;
		this.addGeneralOptions();
	};

	Window_CuOptions.prototype.addGeneralOptions = function() {
		var cuSpecCommands = [];
		var cuSliderCommands = [];
		var cuNormCommands = [];
		
		for (var i = 0; i < _cuOptCommands.length; i++) {
			if (_allSceneChangeSymbols.indexOf(_cuOptCommands[i].symbol) != -1) {
				cuSpecCommands.push({ name: _cuOptCommands[i].name, symbol: _cuOptCommands[i].symbol, enabled: _cuOptCommands[i].enabled, ext: _cuOptCommands[i].ext });
			} else if (_allSliderSymbols.indexOf(_cuOptCommands[i].symbol) != -1) {
				cuSliderCommands.push({ name: _cuOptCommands[i].name, symbol: _cuOptCommands[i].symbol, enabled: _cuOptCommands[i].enabled, ext: _cuOptCommands[i].ext });				
			} else {
				cuNormCommands.push({ name: _cuOptCommands[i].name, symbol: _cuOptCommands[i].symbol, enabled: _cuOptCommands[i].enabled, ext: _cuOptCommands[i].ext });
			}
		}

		// Scene change options always go first, in alphabetical order.
		for (var i = 0; i < cuSpecCommands.length; i++) {
			this.addCommand(cuSpecCommands[i].name, cuSpecCommands[i].symbol, cuSpecCommands[i].enabled, cuSpecCommands[i].ext);
		}
		
		// Sliders go next, in alphabetical order.
		for (var i = 0; i < cuSliderCommands.length; i++) {
			this.addCommand(cuSliderCommands[i].name, cuSliderCommands[i].symbol, cuSliderCommands[i].enabled, cuSliderCommands[i].ext);
		}
		
		// Remaining options go last, in alphabetical order.
		for (var i = 0; i < cuNormCommands.length; i++) {
			this.addCommand(cuNormCommands[i].name, cuNormCommands[i].symbol, cuNormCommands[i].enabled, cuNormCommands[i].ext);
		}		
	};
	
	//=============================================================================
	// Window_Options
	//=============================================================================	
	BBS.OrgOptionsMenu.Window_Options_makeCommandList =
		Window_Options.prototype.makeCommandList;	
	Window_Options.prototype.makeCommandList = function() {
		this.cmdFilter = _allReOptSymbols;
		this.addCommand(pGrOptText, 'grConfig');
		this.addCommand(pAuOptText, 'auConfig');
		this.addCommand(pGaOptText, 'gaConfig');
		this.addCommand(pCuOptText, 'cuConfig');
		
		BBS.OrgOptionsMenu.Window_Options_makeCommandList.call(this);
	};
	
	BBS.OrgOptionsMenu.Window_Options_addCommand =
		Window_Options.prototype.addCommand;
	Window_Options.prototype.addCommand = function(name, symbol, enabled, ext) {

		// Add data grab to get name and symbols from other plugins adding to Options menu, and then reorganize entries.

		// Graphics
		if (_allGrOptSymbols.indexOf(symbol) != -1) {
			// Then this symbol is for a graphics option.  Make sure it hasn't already been added to graphic options.
			if (searchArr(symbol, _grOptCommands) === -1) {
				_grOptCommands.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
			}
		}
		
		// Audio
		else if (_allAuOptSymbols.indexOf(symbol) != -1) {
			// Then this symbol is for an audio option.  Make sure it hasn't already been added to audio options.
			if (searchArr(symbol, _auOptCommands) === -1) {
				_auOptCommands.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
			}
		}
		
		// Customize
		else if (_allCuOptSymbols.indexOf(symbol) != -1) {
			// Then this symbol is not one of the new options categories.  
			_allCuOptSymbols.push(symbol);
			
			// Make sure it hasn't already been added to gameplay options.
			if (searchArr(symbol, _cuOptCommands) === -1) {
				_cuOptCommands.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
			}
		}
		// Gameplay, if not reserved symbol
		else if (_allReOptSymbols.indexOf(symbol) === -1) {
			// Then this symbol is not one of the new customize categories
			_allGaOptSymbols.push(symbol);
			
			// Make sure it hasn't already been added to customize options.
			if (searchArr(symbol, _gaOptCommands) === -1) {
				_gaOptCommands.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
			}
		}
		// Else: Item not sorted.
		if (this.cmdFilter.indexOf(symbol) != -1) {
			BBS.OrgOptionsMenu.Window_Options_addCommand.call(this, name, symbol, enabled, ext);
		}
	};

	// Alias for scene redirects.
	BBS.OrgOptionsMenu.Window_Options_drawItem =
		Window_Options.prototype.drawItem;
	Window_Options.prototype.drawItem = function(index) {
		// If this option is for a command causing a scene change, it is drawn differently.
		if(_allSceneChangeSymbols.indexOf(this.commandSymbol(index)) != -1) {
			var rect = this.itemRectForText(index);
			var text = this.commandName(index);
			this.resetTextColor();
			this.changePaintOpacity(this.isCommandEnabled(index));
			this.drawText(text, rect.x, rect.y, rect.width, 'left');
		} else {
			BBS.OrgOptionsMenu.Window_Options_drawItem.call(this, index);
		}
	};
	
	// Alias for status text handling
	Window_Options.prototype.isVolumeSymbol = function(symbol) {
		return (_allSliderSymbols.indexOf(symbol) != -1);
	};
	
	// Alias for scene redirects.
	BBS.OrgOptionsMenu.Window_Options_cursorRight =
		Window_Options.prototype.cursorRight;	
	Window_Options.prototype.cursorRight = function(wrap) {
		var index = this.index();
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		
		if (symbol === "logSpeed") {
			switch(value) {
				case "Very Slow":
					this.changeValue(symbol, "Slow");
					break;
				case "Slow":
					this.changeValue(symbol, "Normal");
					break;
				case "Normal":
					this.changeValue(symbol, "Fast");
					break;
				case "Fast":
					this.changeValue(symbol, "Very Fast");
					break;
				case "Very Fast":
					this.changeValue(symbol, "Very Slow");
					break;
				default:
					this.changeValue(symbol, "Normal");
					break;
			};
			
		}
		else {
			BBS.OrgOptionsMenu.Window_Options_cursorRight.call(this, wrap);
		}
		
	};

	// Alias for scene redirects.
	BBS.OrgOptionsMenu.Window_Options_cursorLeft =
		Window_Options.prototype.cursorLeft;	
	Window_Options.prototype.cursorLeft = function(wrap) {
		var index = this.index();
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		
		if (symbol === "logSpeed") {
			switch(value) {
				case "Very Slow":
					this.changeValue(symbol, "Very Fast");
					break;
				case "Slow":
					this.changeValue(symbol, "Very Slow");
					break;
				case "Normal":
					this.changeValue(symbol, "Slow");
					break;
				case "Fast":
					this.changeValue(symbol, "Normal");
					break;
				case "Very Fast":
					this.changeValue(symbol, "Fast");
					break;
				default:
					this.changeValue(symbol, "Normal");
					break;
			};
			
		}
		else {
			BBS.OrgOptionsMenu.Window_Options_cursorLeft.call(this, wrap);
		}
		
	};
	
	// Alias for scene redirects.
	BBS.OrgOptionsMenu.Window_Options_processOk =
		Window_Options.prototype.processOk;
	Window_Options.prototype.processOk = function() {
		// If this option is for a command causing a scene change, it is handled differently.
		if(_allSceneChangeSymbols.indexOf(this.commandSymbol(this.index())) != -1) {
			Window_Command.prototype.processOk.call(this);
		}
		else {
			BBS.OrgOptionsMenu.Window_Options_processOk.call(this);
		}
	};
	
	//=============================================================================
	// Scene_Options
	//=============================================================================
	// Override for scene and command redirects.
	Scene_Options.prototype.createOptionsWindow = function() {
		if (pDebugging === true) {
			console.log(_grOptCommands);
			console.log(_auOptCommands);
			console.log(_gaOptCommands);
			console.log(_cuOptCommands);
		}
		
		this._optionsWindow = new Window_Options();
		this._optionsWindow.setHandler('grConfig', this.commandGrConfig.bind(this));
		this._optionsWindow.setHandler('auConfig', this.commandAuConfig.bind(this));
		this._optionsWindow.setHandler('gaConfig', this.commandGaConfig.bind(this));
		this._optionsWindow.setHandler('cuConfig', this.commandCuConfig.bind(this));
		this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	};

	Scene_Options.prototype.commandGrConfig = function() {
		SceneManager.push(Scene_GrConfig);
	};

	Scene_Options.prototype.commandAuConfig = function() {
		SceneManager.push(Scene_AuConfig);
	};
	
	Scene_Options.prototype.commandGaConfig = function() {
		SceneManager.push(Scene_GaConfig);
	};

	Scene_Options.prototype.commandCuConfig = function() {
		SceneManager.push(Scene_CuConfig);
	};
	
	//=============================================================================
	// Scene_GrConfig
	//=============================================================================
	function Scene_GrConfig() {
		this.initialize.apply(this, arguments);
	}

	Scene_GrConfig.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_GrConfig.prototype.constructor = Scene_GrConfig;

	Scene_GrConfig.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_GrConfig.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createGrOptionsWindow();
	};

	Scene_GrConfig.prototype.terminate = function() {
		Scene_MenuBase.prototype.terminate.call(this);
		ConfigManager.save();
	};

	Scene_GrConfig.prototype.createGrOptionsWindow = function() {
		this._optionsWindow = new Window_GrOptions();
		this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	};
	
	//=============================================================================
	// Scene_AuConfig
	//=============================================================================
	function Scene_AuConfig() {
		this.initialize.apply(this, arguments);
	}

	Scene_AuConfig.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_AuConfig.prototype.constructor = Scene_AuConfig;

	Scene_AuConfig.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_AuConfig.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createAuOptionsWindow();
	};

	Scene_AuConfig.prototype.terminate = function() {
		Scene_MenuBase.prototype.terminate.call(this);
		ConfigManager.save();
	};

	Scene_AuConfig.prototype.createAuOptionsWindow = function() {
		this._optionsWindow = new Window_AuOptions();
		this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	};	
	
	//=============================================================================
	// Scene_GaConfig
	//=============================================================================
	function Scene_GaConfig() {
		this.initialize.apply(this, arguments);
	}

	Scene_GaConfig.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_GaConfig.prototype.constructor = Scene_GaConfig;

	Scene_GaConfig.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_GaConfig.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createGaOptionsWindow();
	};

	Scene_GaConfig.prototype.terminate = function() {
		Scene_MenuBase.prototype.terminate.call(this);
		ConfigManager.save();
	};

	Scene_GaConfig.prototype.createGaOptionsWindow = function() {
		this._optionsWindow = new Window_GaOptions();
		this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	};

	//=============================================================================
	// Scene_CuConfig
	//=============================================================================
	function Scene_CuConfig() {
		this.initialize.apply(this, arguments);
	}

	Scene_CuConfig.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_CuConfig.prototype.constructor = Scene_CuConfig;

	Scene_CuConfig.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_CuConfig.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createCuOptionsWindow();
	};

	Scene_CuConfig.prototype.terminate = function() {
		Scene_MenuBase.prototype.terminate.call(this);
		ConfigManager.save();
	};

	Scene_CuConfig.prototype.createCuOptionsWindow = function() {
		this._optionsWindow = new Window_CuOptions();
		this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	};
	
})(BBS.OrgOptionsMenu);
//=============================================================================
// End of File
//=============================================================================