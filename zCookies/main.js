var zCookies;
var zDatabase = {
    upgrades: [],
    priceList: [],
    nextUpgrade: {
      name: 'N/A',
      getPrice: function () { return 0 },
      id: 0,
    },
    nextSingleProduct: {},
    nextBulkProduct: {},
    nextMissingProduct: {},
    nextProduct: {},
    nextProductPrice: 0,
    desiredPlant: 0,
    unlockedPlants: [],
    currentPlantAmount: 0,
    lastPlants: '',
    overrideIDs: [69], //nice
    wrinklerHoard: 0,
    UITimeout: 1000,
    zSciVal: 1e3,
    init:false
};
Game.registerMod("zCookies", {
  init: function () {
    zCookies = this;
    zDatabase = zDatabase
    document.getElementById("smallSupport").remove(); //remove adspot
    Game.registerHook('reset',function(hard){
      zCookies.zDBMan.setDefaults(hard);
    });
    //define info area elements
    var zInfoArea = document.createElement("div")
    zInfoArea.id = "zInfoArea";
    zInfoArea.classList.add("zCookies");

    var zInfoAreaTitle = document.createElement("h1");
    zInfoAreaTitle.id = "zInfoAreaTitle"
    zInfoAreaTitle.classList.add("zCookies");
    zInfoAreaTitle.innerText = "[== zCookies v. " + zCookies.variables.zCookiesVersion + " ==]"

    var zInfoAreaFlavour = document.createElement("h1");
    zInfoAreaFlavour.id = "zInfoAreaFlavour"
    zInfoAreaFlavour.classList.add("zCookies");

    var zInfoAreaProgressPercentWrapper = document.createElement("div");
    zInfoAreaProgressPercentWrapper.classList.add("block")
    var zInfoAreaProgressPercent = document.createElement("p")
    zInfoAreaProgressPercent.id = "zInfoAreaProgressPercent";
    zInfoAreaProgressPercent.classList.add("zCookies");
    zInfoAreaProgressPercent.classList.add("ascendNumber");
    zInfoAreaProgressPercent.classList.add("zHasPopup");
    zInfoAreaProgressPercent.classList.add("inline-block");
    zInfoAreaProgressPercent.innerText = 'Level: 0\n00.00% to next level'
    zInfoAreaProgressPercentWrapper.appendChild(zInfoAreaProgressPercent);

    var zInfoAreaWrinklerInfoWrapper = document.createElement("div");
    zInfoAreaWrinklerInfoWrapper.classList.add("block")
    var zInfoAreaWrinklerInfo = document.createElement("p")
    zInfoAreaWrinklerInfo.id = "zInfoAreaWrinklerInfo";
    zInfoAreaWrinklerInfo.classList.add("zCookies");
    zInfoAreaWrinklerInfo.classList.add("zHasPopup");
    zInfoAreaWrinklerInfo.classList.add("inline-block");
    zInfoAreaWrinklerInfo.innerText = 'Wrinklers: 00s | Autopop threshold: ' + zCookies.hmsCalc(zCookies.variables.wrinklerThreshold, false, 0);
    zInfoAreaWrinklerInfoWrapper.appendChild(zInfoAreaWrinklerInfo);

    var zInfoAreaClickPowerWrapper = document.createElement("div");
    zInfoAreaClickPowerWrapper.classList.add("block")
    var zInfoAreaClickPower = document.createElement("p")
    zInfoAreaClickPower.id = "zInfoAreaClickPower";
    zInfoAreaClickPower.classList.add("zCookies");
    zInfoAreaClickPower.classList.add("inline-block");
    zInfoAreaClickPower.classList.add("zMono");
    zInfoAreaClickPower.innerText = 'Click power: ' + 0;
    zInfoAreaClickPowerWrapper.appendChild(zInfoAreaClickPower);

    var zInfoAreaCPSWrapper = document.createElement("div");
    zInfoAreaCPSWrapper.classList.add("block")
    var zInfoAreaCPS = document.createElement("p")
    zInfoAreaCPS.id = "zInfoAreaCPS";
    zInfoAreaCPS.classList.add("zCookies");
    zInfoAreaCPS.classList.add("inline-block");
    zInfoAreaCPS.classList.add("zMono");
    zInfoAreaCPS.innerText = 'Cur CPS: ' + 0;
    zInfoAreaCPSWrapper.appendChild(zInfoAreaCPS);

    var zInfoAreaCPSRawWrapper = document.createElement("div");
    zInfoAreaCPSRawWrapper.classList.add("block")
    var zInfoAreaCPSRaw = document.createElement("p")
    zInfoAreaCPSRaw.id = "zInfoAreaCPSRaw";
    zInfoAreaCPSRaw.classList.add("zCookies");
    zInfoAreaCPSRaw.classList.add("inline-block");
    zInfoAreaCPSRaw.classList.add("zMono");
    zInfoAreaCPSRaw.innerText = 'Raw CPS: ' + 0;
    zInfoAreaCPSRawWrapper.appendChild(zInfoAreaCPSRaw);

    var zInfoAreaLastProduct = document.createElement("p")
    zInfoAreaLastProduct.id = "zInfoAreaLastProduct"
    zInfoAreaLastProduct.classList.add("zCookies");
    zInfoAreaLastProduct.classList.add("zInfoAreaText")
    zInfoAreaLastProduct.classList.add("borderHandler");
    zInfoAreaLastProduct.classList.add('potentialBorderObject');
    zInfoAreaLastProduct.innerText = "Last product:\nN/A\nN/A";

    var zInfoAreaLastUpgrade = document.createElement("p")
    zInfoAreaLastUpgrade.id = "zInfoAreaLastUpgrade"
    zInfoAreaLastUpgrade.classList.add("zCookies");
    zInfoAreaLastUpgrade.classList.add("zInfoAreaText")
    zInfoAreaLastUpgrade.classList.add("borderHandler");
    zInfoAreaLastUpgrade.classList.add('potentialBorderObject');
    zInfoAreaLastUpgrade.innerText = "Last upgrade:\nN/A\nN/A";

    var zInfoAreaLastShimmer = document.createElement("p")
    zInfoAreaLastShimmer.id = "zInfoAreaLastShimmer"
    zInfoAreaLastShimmer.classList.add("zCookies");
    zInfoAreaLastShimmer.classList.add("zInfoAreaText")
    zInfoAreaLastShimmer.classList.add("borderHandler");
    zInfoAreaLastShimmer.classList.add('potentialBorderObject');
    zInfoAreaLastShimmer.innerText = "Last shimmer:\nN/A\nN/A";

    var zInfoAreaLastPlant = document.createElement("p")
    zInfoAreaLastPlant.id = "zInfoAreaLastPlant"
    zInfoAreaLastPlant.classList.add("zCookies");
    zInfoAreaLastPlant.classList.add("zInfoAreaText")
    zInfoAreaLastPlant.classList.add("borderHandler");
    zInfoAreaLastPlant.classList.add('potentialBorderObject');
    zInfoAreaLastPlant.classList.add("zHasPopup");
    zInfoAreaLastPlant.innerText = "Last plant:\nN/A\nN/A";

    var zLastWrapper = document.createElement("div");
    zLastWrapper.id = "zLastWrapper";
    zLastWrapper.classList.add("zInfoWrapper");
    zLastWrapper.classList.add("zCookies");
    zLastWrapper.classList.add('zWrapper');
    zLastWrapper.appendChild(zInfoAreaLastProduct);
    zLastWrapper.appendChild(zInfoAreaLastUpgrade);
    zLastWrapper.appendChild(zInfoAreaLastShimmer);
    zLastWrapper.appendChild(zInfoAreaLastPlant);

    var zInfoAreaNextPurchase = document.createElement("p")
    zInfoAreaNextPurchase.id = "zInfoAreaNextPurchase"
    zInfoAreaNextPurchase.classList.add("zCookies");
    zInfoAreaNextPurchase.classList.add("zInfoAreaText")
    zInfoAreaNextPurchase.classList.add("borderHandler");
    zInfoAreaNextPurchase.classList.add('potentialBorderObject');
    zInfoAreaNextPurchase.innerText = "Next purchase: ";

    var zInfoAreaNextUpgrade = document.createElement("p")
    zInfoAreaNextUpgrade.id = "zInfoAreaNextUpgrade"
    zInfoAreaNextUpgrade.classList.add("zCookies");
    zInfoAreaNextUpgrade.classList.add("zInfoAreaText")
    zInfoAreaNextUpgrade.classList.add("borderHandler");
    zInfoAreaNextUpgrade.classList.add('potentialBorderObject');
    zInfoAreaNextUpgrade.innerText = "Next upgrade: ";

    var zInfoAreaNextPlant = document.createElement("p")
    zInfoAreaNextPlant.id = "zInfoAreaNextPlant"
    zInfoAreaNextPlant.classList.add("zCookies");
    zInfoAreaNextPlant.classList.add("zInfoAreaText")
    zInfoAreaNextPlant.classList.add("borderHandler");
    zInfoAreaNextPlant.classList.add('potentialBorderObject');
    zInfoAreaNextPlant.innerText = "Next plant: ";

    var zNextWrapper = document.createElement("div");
    zNextWrapper.id = "zNextWrapper";
    zNextWrapper.classList.add("zInfoWrapper");
    zNextWrapper.classList.add("zCookies");
    zNextWrapper.classList.add('zWrapper');
    zNextWrapper.appendChild(zInfoAreaNextPurchase);
    zNextWrapper.appendChild(zInfoAreaNextUpgrade);
    zNextWrapper.appendChild(zInfoAreaNextPlant);

    //hijack beautify
    

    //append isEven
    Math.isEven = function (val) {
      if (val % 2 == 0) {
        return true
      } else {
        return false
      }
    }
    //namecheck function

    var hRF = [];
    var retString;
    var i = 0;

    //append stylesheet
    var zStyleSheet = document.createElement("link")
    zStyleSheet.href = "https://ziotech.github.io/zCookies/zCookies_style.css"
    zStyleSheet.rel = "stylesheet"
    zStyleSheet.type = "text/css"
    document.head.appendChild(zStyleSheet)

    var zStyles = new Object;
    //zMenuLocation.fixStyling()

    //lazy br additions
    function zIBS(times) {
      if (times == 0 || times === undefined || times === null) {
        times = 1;
      }
      for (var i = 0; i < times; i++) {
        zInfoArea.appendChild(document.createElement("br"));
      }
    }

    function zTS(){
      var tmp = document.createElement("div");
      tmp.classList.add("topSpacer");
      tmp.classList.add("zSize300");
      zInfoArea.appendChild(tmp);
    }

    zCookies.structureObjects();

    //hacky timer control
    var zBarContainer = document.createElement("div");
    zBarContainer.id = "zBarContainer";
    var zBar = document.createElement("input");
    zBar.type = "range";
    zBar.min = 10;
    zBar.max = 100;
    zBar.value = 100;
    zBar.id = "zBar";

    var zBarDesc = document.createElement("p");
    zBarDesc.id = "zBarDesc";
    zBarDesc.innerText = "zTimerValue: ";
    zBarDesc.style.display = "inline";

    var zBarText = document.createElement("p");
    zBarText.id = "zBarText";
    zBarText.innerText = zBar.value;
    zBarText.style.display = "inline";

    zBarContainer.appendChild(zBar);
    zBarContainer.appendChild(document.createElement("br"));
    zBarContainer.appendChild(zBarDesc);
    zBarContainer.appendChild(zBarText);

    zSelectionContainer = document.createElement("div");
    zSelectionContainer.id = "zSelectionContainer";
    zSelectionContainer.appendChild(zCookies.objects.zPurchaseTarget.wrapper);
    zSelectionContainer.appendChild(zCookies.objects.zBuyProducts.wrapper);
    zSelectionContainer.appendChild(zCookies.objects.zBuyUpgrades.wrapper);
    zSelectionContainer.appendChild(zCookies.objects.zBuyToClosest.wrapper);
    zSelectionContainer.appendChild(zCookies.objects.zHandleGarden.wrapper);

    zBar.addEventListener("change", zCookies.zBarUpdater);
    //construct the info area
    zIBS();
    zInfoArea.appendChild(zInfoAreaTitle);
    zInfoArea.appendChild(zInfoAreaFlavour);
    zInfoArea.appendChild(zCookies.objects.zMenuHider.element);
    zIBS(2);
    zInfoArea.appendChild(zCookies.objects.zMenuLocation.element);
    zIBS(2);
    zInfoArea.appendChild(zInfoAreaProgressPercentWrapper);
    zIBS(1);
    zInfoArea.appendChild(zInfoAreaWrinklerInfoWrapper);
    zIBS(1);
    zInfoArea.appendChild(zInfoAreaClickPowerWrapper);
    zTS()
    zInfoArea.appendChild(zInfoAreaCPSWrapper);
    zTS()
    zInfoArea.appendChild(zInfoAreaCPSRawWrapper)
    zIBS(4);
    zInfoArea.appendChild(zLastWrapper);
    zIBS(2);
    zInfoArea.appendChild(zNextWrapper);
    zIBS(2);
    zInfoArea.appendChild(zBarContainer);
    zIBS(2);
    zInfoArea.appendChild(zSelectionContainer);
    zIBS();
    var zBottomRow = document.createElement("div");
    zBottomRow.id = "zBottomRow";
    zBottomRow.classList.add("separatorBottom");
    zInfoArea.appendChild(zBottomRow);
    //infoArea try/catch
    try {
      storeTitle.prepend(zInfoArea);
    } catch (error) {
      console.log(error)
    }

    //Hijack function
    //Stolen from http://jsfiddle.net/kXkFS/

    function hijack(scope, original, before) {
      var copy = original;
      return function (arguments) {
        before.apply(scope, arguments);
        copy.apply(scope, arguments)
      };
    }

    //Hijack UpdateMenu()
    Game.UpdateMenu = hijack(this, Game.UpdateMenu, function () {
      zCookies.zInfoAreaToggler();
    });

    Game.BuildStore();
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].href == zStyleSheet.href) {
        zStyles = document.styleSheets[i];
      }
    }
    zCookies.objects.zMenuLocation.fixStyling(zCookies.objects.zMenuLocation.value)
    //zCookies.objects.zHandleGarden.updateDesiredPlant();

    Game.ascendNumber.remove();
    zInfoAreaLastPlant.onclick = zCookies.zFunctions.showLastPlant;
    zInfoAreaWrinklerInfo.onclick = zCookies.zFunctions.wrinklerHelp;
    zInfoAreaProgressPercent.onclick = zCookies.zFunctions.toggleSlowMode;
    zCookies.zFunctions.nextPurchase(false);
    Game.Notify(`zCookies v:` + zCookies.variables.zCookiesVersion + ` loaded.`, `Enjoy your automation.`, [16, 5], true);
    zCookies.mainLoop()
  },
  variables: {
    zCookiesVersion: "0.6.2",
    zFlavourText: ["Now with flavour!",
      "The beauty update!",
      "UI-ho!",
      "Bug-B-Gone!",
      "Pop! Goes the wrinkler~",
      "Neverclick!",
      "Space, my dude.",
      "No Toggling in the Pool!",
      "Buy the rework!",
      "Wow! Updating!",
      "Enhanced logic!",
      "More numbers!",
      "What's in a notation?",
      "Lumpy dumpy!",
      "Gardening for fun!",
      "Speedfarming!",
      "Forgetfulness!",
      "NaN no more!",
      "Navigation!",
      "Hidden in plain sight!",
      "Square zero!",
      "Synchronicity!",
      "Agreeable!",
      "Daily wrinkles!",
      "Woah! Slow down!",
      "Agressively poppin'!",
      "Portable!"
    ],
    //declare all variables
    zGameReadyState: false,
    zTimerValue: 1000,
    zProducts: [],
    zUpgrades: [],
    zLastUpgradeTime: 0,
    zLastUpgradeHumanTime: 0,
    zLastUpgradeID: 0,
    zLastUpgradeName: 0,
    zLastProductTime: 0,
    zLastProductHumanTime: 0,
    zLastShimmerTime: 0,
    zLastShimmerHumanTime: 0,
    zPercMsg: '',
    zPerc: 0,
    //
    nameSet: false,
    zMiddleRows: document.getElementById("rows"),
    zRunLoop: true,
    zPlantCounter: 0,
    storeTitle: document.getElementById('store'),
    promptForFont: true,
    wrinklerThreshold: (3600 * 24) * 7,
    lowPerfMode: false,
  },
  save: function () {
    return JSON.stringify(new zCookies.zDBMan.zCookiesDBBuilder)
  },
  load: function (str) {
    var oldDB = JSON.parse(str)
    zDatabase.zSciVal = oldDB.zSciVal
    zInfoAreaLastUpgrade.innerHTML = oldDB.lastUpgrade;
    zInfoAreaLastProduct.innerHTML = oldDB.lastProduct;
    zInfoAreaLastShimmer.innerHTML = oldDB.lastShimmer;
    zInfoAreaLastPlant.innerHTML = oldDB.lastPlant;
    zCookies.variables.zTimerValue = oldDB.zTimerValue;
    zCookies.zBarUpdater()
    zBar.value = oldDB.zBarValue;
    zCookies.variables.zPlantCounter = oldDB.zPlantCounter;
    zCookies.objects.zBuyProducts.value = oldDB.zBuyProductsValue;
    zCookies.objects.zBuyProducts.element.checked = oldDB.zBuyProductsValue;
    zCookies.objects.zBuyUpgrades.value = oldDB.zBuyUpgradesValue;
    zCookies.objects.zBuyUpgrades.element.checked = oldDB.zBuyUpgradesValue;
    zCookies.objects.zPurchaseTarget.value = oldDB.zPurchaseTargetValue;
    zCookies.objects.zPurchaseTarget.element.value = oldDB.zPurchaseTargetValue;
    zCookies.objects.zBuyToClosest.value = oldDB.zBuyToClosestValue;
    zCookies.objects.zBuyToClosest.element.checked = oldDB.zBuyToClosestValue;
    zCookies.objects.zHandleGarden.value = parseInt(oldDB.zHandleGardenValue);
    zCookies.objects.zHandleGarden.element.value = oldDB.zHandleGardenValue;
    zCookies.objects.zHandleGarden.element2.innerHTML = oldDB.zHandleGardenHTML;
    zCookies.objects.zHandleGarden.element2.value = oldDB.zHandleGardenSelected;
    zCookies.objects.zHandleGarden.element3.checked = oldDB.zHandleGardenCheckered;
    zCookies.objects.zHandleGarden.checkered = oldDB.zHandleGardenCheckered;
    zCookies.objects.zMenuHider.value = !oldDB.zMenuHidden;
    zCookies.objects.zMenuLocation.value = !oldDB.zMenuLocation;
    zDatabase.lastPlants = oldDB.lastPlants;
    zCookies.variables.nameSet = oldDB.nameSet
    zCookies.variables.promptForFont = oldDB.promptForFont;
    zCookies.variables.lowPerfMode = oldDB.lowPerfMode;
    zCookies.variables.wrinklerThreshold = oldDB.wrinklerThreshold;
    if (oldDB.zBuyToClosestValue) {
      zCookies.objects.zPurchaseTarget.desc.innerText = "Buy to closest: "
    }
    zCookies.zBarUpdater();
    zCookies.objects.zHandleGarden.toggleVisible(zCookies.objects.zHandleGarden.value);
    zCookies.zFunctions.updateUI();
    zCookies.zFunctions.updateSubtitle();
    zCookies.zFunctions.updateUITimeout();
    zCookies.objects.zMenuHider.toggle();
    zCookies.objects.zMenuLocation.toggle();
    zCookies.objects.zMenuLocation.fixStyling();
  },
  objects: {
    zPurchaseTarget: {
      update: function () {
        zCookies.objects.zPurchaseTarget.value = parseInt(zCookies.objects.zPurchaseTarget.element.value)
      }
    },
    zBuyProducts: {
      update: function () {
        zCookies.objects.zBuyProducts.value = zCookies.objects.zBuyProducts.element.checked
      }
    },
    zBuyUpgrades: {
      update: function () {
        zCookies.objects.zBuyUpgrades.value = zCookies.objects.zBuyUpgrades.element.checked
      }
    },
    zBuyToClosest: {
      update: function () {
        zCookies.objects.zBuyToClosest.value = zCookies.objects.zBuyToClosest.element.checked
        if (zCookies.objects.zBuyToClosest.value) { zCookies.objects.zBuyToClosest.desc.innerText = "Buy to closest: " }
        else { zCookies.objects.zBuyToClosest.desc.innerText = "Buy amount: " }
      }
    },
    zHandleGarden: {
      update: function () {
        if (zCookies.objects.zHandleGarden.element2.value != 'nil') {
          zCookies.objects.zHandleGarden.value = parseInt(zCookies.objects.zHandleGarden.element.value);
          zCookies.objects.zHandleGarden.toggleVisible(zCookies.objects.zHandleGarden.value);
        }
      },
      toggleVisible: function (state) {
        if (state > 1) {
          zCookies.objects.zHandleGarden.desc2.style.display = 'inline-block';
          zCookies.objects.zHandleGarden.element2.style.display = 'inline-block';
          zCookies.objects.zHandleGarden.desc3.style.display = 'inline-block';
          zCookies.objects.zHandleGarden.element3.style.display = 'inline-block';
        } else {
          zCookies.objects.zHandleGarden.desc2.style.display = 'none';
          zCookies.objects.zHandleGarden.element2.style.display = 'none';
          zCookies.objects.zHandleGarden.desc3.style.display = 'none';
          zCookies.objects.zHandleGarden.element3.style.display = 'none';
        }
      },
      updateDesiredPlant: async function (callFunctions) {
        if(callFunctions != false && callFunctions != true){
          callFunctions = true;
        }
        if (callFunctions) {
         await zCookies.objects.zHandleGarden.populateList(!callFunctions)
        }
        if (zCookies.variables.zPlantCounter === undefined || zCookies.variables.zPlantCounter === null || zCookies.variables.zPlantCounter < 0 || zCookies.variables.zPlantCounter >= zDatabase.unlockedPlants.length) { zCookies.variables.zPlantCounter = 0 }
        if (callFunctions != false && callFunctions != true) { callFunctions = true }
        var tmpVal = zCookies.objects.zHandleGarden.element2.value
        if (tmpVal != 'nil' && Game.Objects['Farm'].minigame !== undefined && tmpVal != 'all') {
          zDatabase.desiredPlant = Game.Objects['Farm'].minigame.plantsById[tmpVal];
        } else if (tmpVal == 'all') {
          zDatabase.desiredPlant = zDatabase.unlockedPlants[zCookies.variables.zPlantCounter];
        }
      },
      populateList: async function (callFunctions) {
        if (callFunctions != false && callFunctions != true) { callFunctions = true }
        try {
          if(zDatabase.unlockedPlants.length > 0){
            zDatabase.unlockedPlants = [];
          }
          var tmpObj = Game.Objects['Farm'].minigame.plantsById
          var tmpPlant = '';
          var oldPlant = zCookies.objects.zHandleGarden.element2.value;
          for (var i = 0; i < tmpObj.length; i++) {
            if (tmpObj[i].unlocked == 1) {
              zDatabase.unlockedPlants.push(tmpObj[i]);
            }
          }
          zCookies.objects.zHandleGarden.element2.innerHTML = ''
          for (var i = 0; i < zDatabase.unlockedPlants.length; i++) {
            tmpPlant = zDatabase.unlockedPlants[i];
            zCookies.objects.zHandleGarden.element2.innerHTML += '<option value=' + tmpPlant.id + '>' + tmpPlant.name + '</option>\n';
          }
          zCookies.objects.zHandleGarden.element2.innerHTML += '<option value=all>All Available</option>'
          zCookies.objects.zHandleGarden.element2.value = oldPlant;
        } catch (error) {
          zCookies.objects.zHandleGarden.element.value = 0;
          zCookies.objects.zHandleGarden.update();
          if (callFunctions) {
            zCookies.objects.zHandleGarden.updateDesiredPlant(!callFunctions);
          }
        }
      },
      toggleCheckered: function () {
        zCookies.objects.zHandleGarden.checkered = zCookies.objects.zHandleGarden.element3.checked;
      },
      value:0
    },  
    zMenuHider:{
      toggle: function(){
        if(zCookies.objects.zMenuHider.value == false){
          zCookies.objects.zMenuHider.value = true
          zInfoArea.appendChild(zBottomRow);
          zInfoArea.style.maxHeight = null;
        }else{
          zCookies.objects.zMenuHider.value = false
          zInfoArea.append(zBottomRow);
          if(zCookies.objects.zMenuLocation.value == false){
            zInfoArea.style.maxHeight = "60px"
          }else{
            zInfoArea.style.maxHeight = "65px"
          }
        }
      },
      value:false
    },
    zMenuLocation:{
      value: true,
      toggle: function () {
        if (zCookies.objects.zMenuLocation.value == false) {
          zCookies.objects.zMenuLocation.value = true;
          zInfoArea.style.maxWidth = zCookies.variables.zMiddleRows.offsetWidth + "px";
          zCookies.zInfoAreaToggler();
          zCookies.variables.zMiddleRows.prepend(zInfoArea)
        } else {
          zCookies.objects.zMenuLocation.value = false;
          zInfoArea.style.maxWidth = zCookies.variables.storeTitle.offsetWidth + "px";
          zCookies.variables.storeTitle.prepend(zInfoArea);
        }
        zCookies.objects.zMenuLocation.fixStyling(zCookies.objects.zMenuLocation.value);
      },
      fixStyling: function(mode){
        var tmpAll = document.getElementsByClassName('zCookies');
        var tmpBorder = document.getElementsByClassName('potentialBorderObject');
        var style = ''
        var fontSize = '11px'
        var borderMode = false;
        if(mode === undefined || mode === null){
          mode = zCookies.objects.zMenuLocation.value;
        }
        if(mode == false){
          style = 'block';
          fontSize = '11px';
          borderMode = false;
        }else{
          style = 'inline-block';
          fontSize = '13px';
          borderMode = true;
        }
        for(var i = 0; i < zLastWrapper.childElementCount; i++){
          zLastWrapper.childNodes[i].style.display = style
        }
        for(var i = 0; i < zNextWrapper.childElementCount; i++){
          zNextWrapper.childNodes[i].style.display = style
        }
        for(var i = 0; i < zSelectionContainer.childElementCount; i++){
          zSelectionContainer.childNodes[i].style.display = style
        }
        for(var i = 0; i < tmpAll.length; i++){
          tmpAll[i].style.fontSize = fontSize
        }
        for(var i = 0; i < tmpBorder.length; i++){
          if(borderMode){
            tmpBorder[i].classList.add('borderHandler');
          }else{
            tmpBorder[i].classList.remove('borderHandler');
          }
        }
      }
    },
    wrinklerInput:{
      inputBox: document.createElement("input")
    },
  },
  zDBMan: {
    zCookiesDBBuilder: function () {
      this.zBarValue = zBar.value;
      this.zTimerValue = zCookies.variables.zTimerValue;
      this.zBuyProductsValue = zCookies.objects.zBuyProducts.value;
      this.zBuyUpgradesValue = zCookies.objects.zBuyUpgrades.value;
      this.zPurchaseTargetValue = zCookies.objects.zPurchaseTarget.value;
      this.zBuyToClosestValue = zCookies.objects.zBuyToClosest.value;
      this.zHandleGardenValue = zCookies.objects.zHandleGarden.value;
      this.zHandleGardenHTML = zCookies.objects.zHandleGarden.element2.innerHTML;
      this.zHandleGardenSelected = zCookies.objects.zHandleGarden.element2.value;
      this.zHandleGardenCheckered = zCookies.objects.zHandleGarden.checkered;
      this.lastUpgrade = zInfoAreaLastUpgrade.innerHTML;
      this.lastProduct = zInfoAreaLastProduct.innerHTML;
      this.lastShimmer = zInfoAreaLastShimmer.innerHTML;
      this.lastPlant = zInfoAreaLastPlant.innerHTML;
      this.zMenuHidden = zCookies.objects.zMenuHider.value;
      this.zMenuLocation = zCookies.objects.zMenuLocation.value;
      this.nameSet = zCookies.variables.nameSet;
      this.zSciVal = zDatabase.zSciVal;
      this.zPlantCounter = zCookies.variables.zPlantCounter;
      this.promptForFont = zCookies.objects.promptForFont;
      this.lastPlants = zDatabase.lastPlants;
      this.wrinklerThreshold = zCookies.variables.wrinklerThreshold;
      this.lowPerfMode = zCookies.variables.lowPerfMode;
    },
    purge: function () {
      if (window.confirm("Are you sure you want to purge zCookiesDB?")) {
        zDBMan.setDefaults(true);
        zCookies.save(null);
      }
    },
    setDefaults: function (fullReset) {
      if (fullReset === undefined || fullReset === null) {
        fullReset = false;
      }
      zInfoAreaLastUpgrade.innerText = "Last upgrade:\nN/A\nN/A\nN/A";
      zInfoAreaLastProduct.innerText = "Last purchase:\nN/A\nN/A\nN/A";
      if (zCookies.objects.zMenuLocation == true) {
        zInfoAreaLastShimmer.innerText = "Last shimmer:\nN/A\n\nN/A";
      } else {
        zInfoAreaLastShimmer.innerText = 'Last shimmer:\nN/A\nN/A';
      }
      zInfoAreaLastPlant.innerText = "Last plant:\nN/A\nN/A\nN/A";
      if (fullReset) {
        zCookies.objects.zHandleGarden.value = 0;
        zCookies.objects.zHandleGarden.toggleVisible(zCookies.objects.zHandleGarden.value);
        zCookies.objects.zHandleGarden.element.value = 0;
        zCookies.objects.zHandleGarden.element2.innerHTML = '<option value="nil">nil</option>';
        zCookies.objects.zHandleGarden.element2.value = 'nil';
        zCookies.objects.zHandleGarden.element3.checked = false;
        zCookies.objects.zHandleGarden.checkered = false;
        zCookies.objects.zBuyProducts.value = true;
        zCookies.objects.zBuyProducts.element.checked = true;
        zCookies.objects.zBuyUpgrades.value = true;
        zCookies.objects.zBuyUpgrades.element.checked = true;
        zCookies.objects.zPurchaseTarget.value = 10;
        zCookies.objects.zPurchaseTarget.element.value = 10;
        zCookies.objects.zBuyToClosest.value = true;
        zCookies.objects.zBuyToClosest.element.checked = true;
        zCookies.objects.zPurchaseTarget.desc.innerText = "Buy to closest: "
        zCookies.variables.zTimerValue = 1000;
        zBar.value = 100;
        zCookies.variables.zPlantCounter = 0;
        zDatabase.lastPlants = ''
        zCookies.zBarUpdater();
        nameSet = false;
        zCookies.zCheckName();
        zCookies.objects.zMenuHider.value = false;
        zCookies.objects.zMenuLocation.value = true;
        zCookies.objects.zMenuHider.toggle();
        zCookies.objects.zMenuLocation.toggle()
        zCookies.zDBMan.save();
      }
    }
  },
  structureObjects: async function () {
    //Construct Objects
    //zPurchaseTarget
    zCookies.objects.zPurchaseTarget.desc = document.createElement("div");
    zCookies.objects.zPurchaseTarget.desc.innerText = 'Buy amount: ';
    zCookies.objects.zPurchaseTarget.desc.classList.add("zCookies");
    zCookies.objects.zPurchaseTarget.desc.id = "zPurchaseTargetDesc"
    zCookies.objects.zPurchaseTarget.desc.classList.add("zSelectionObjects");
    zCookies.objects.zPurchaseTarget.element = document.createElement("select");
    zCookies.objects.zPurchaseTarget.element.id = "zPurchaseTargetElement";
    zCookies.objects.zPurchaseTarget.element.classList.add("zSelectionObjects");
    zCookies.objects.zPurchaseTarget.element.innerHTML = '<option value=\"1\">1</option>\n<option value=\"5\">5</option>\n<option value=\"10\">10</option>\n<option value=\"25\">25</option>\n<option value=\"50\">50</option>\n<option value=\"100\">100</option>\n<option value=\"1000\">1000</option>';
    zCookies.objects.zPurchaseTarget.element.classList.add("zCookies");
    zCookies.objects.zPurchaseTarget.element.classList.add("blackText");
    zCookies.objects.zPurchaseTarget.value = 1;
    zCookies.objects.zPurchaseTarget.wrapper = document.createElement("div");
    zCookies.objects.zPurchaseTarget.wrapper.id = "zBuyProductsWrapper";
    zCookies.objects.zPurchaseTarget.wrapper.classList.add("zSelectionWrapper");
    zCookies.objects.zPurchaseTarget.wrapper.classList.add("zCookies");
    zCookies.objects.zPurchaseTarget.wrapper.appendChild(zCookies.objects.zPurchaseTarget.desc);
    zCookies.objects.zPurchaseTarget.wrapper.appendChild(zCookies.objects.zPurchaseTarget.element);
    //zBuyProducts
    zCookies.objects.zBuyProducts.desc = document.createElement("div");
    zCookies.objects.zBuyProducts.desc.innerText = 'Buy products: ';
    zCookies.objects.zBuyProducts.desc.classList.add("zCookies");
    zCookies.objects.zBuyProducts.desc.id = "zBuyProductsDesc"
    zCookies.objects.zBuyProducts.desc.classList.add("zSelectionObjects");
    zCookies.objects.zBuyProducts.element = document.createElement("input");
    zCookies.objects.zBuyProducts.element.id = "zBuyProductsElement";
    zCookies.objects.zBuyProducts.element.classList.add("zSelectionObjects");
    zCookies.objects.zBuyProducts.element.type = "checkbox";
    zCookies.objects.zBuyProducts.element.classList.add("zCookies");
    zCookies.objects.zBuyProducts.element.checked = true;
    zCookies.objects.zBuyProducts.value = true;
    zCookies.objects.zBuyProducts.wrapper = document.createElement("div");
    zCookies.objects.zBuyProducts.wrapper.id = "zBuyProductsWrapper";
    zCookies.objects.zBuyProducts.wrapper.classList.add("zSelectionWrapper");
    zCookies.objects.zBuyProducts.wrapper.classList.add("zCookies");
    zCookies.objects.zBuyProducts.wrapper.appendChild(zCookies.objects.zBuyProducts.desc);
    zCookies.objects.zBuyProducts.wrapper.appendChild(zCookies.objects.zBuyProducts.element);
    //zBuyUpgrades
    zCookies.objects.zBuyUpgrades.desc = document.createElement("div");
    zCookies.objects.zBuyUpgrades.desc.innerText = 'Buy upgrades: ';
    zCookies.objects.zBuyUpgrades.desc.classList.add("zCookies");
    zCookies.objects.zBuyUpgrades.desc.id = "zBuyUpgradesDesc"
    zCookies.objects.zBuyUpgrades.desc.classList.add("zSelectionObjects");
    zCookies.objects.zBuyUpgrades.element = document.createElement("input");
    zCookies.objects.zBuyUpgrades.element.id = "zBuyUpgradesElement";
    zCookies.objects.zBuyUpgrades.element.classList.add("zSelectionObjects");
    zCookies.objects.zBuyUpgrades.element.type = "checkbox";
    zCookies.objects.zBuyUpgrades.element.classList.add("zCookies");
    zCookies.objects.zBuyUpgrades.element.checked = true;
    zCookies.objects.zBuyUpgrades.value = true;
    zCookies.objects.zBuyUpgrades.wrapper = document.createElement("div");
    zCookies.objects.zBuyUpgrades.wrapper.id = "zBuyUpgradesWrapper";
    zCookies.objects.zBuyUpgrades.wrapper.classList.add("zSelectionWrapper");
    zCookies.objects.zBuyUpgrades.wrapper.classList.add("zCookies");
    zCookies.objects.zBuyUpgrades.wrapper.appendChild(zCookies.objects.zBuyUpgrades.desc);
    zCookies.objects.zBuyUpgrades.wrapper.appendChild(zCookies.objects.zBuyUpgrades.element);
    //zBuyToClosest
    zCookies.objects.zBuyToClosest.desc = document.createElement("div");
    zCookies.objects.zBuyToClosest.desc.innerText = 'Buy to closest: ';
    zCookies.objects.zBuyToClosest.desc.classList.add("zCookies");
    zCookies.objects.zBuyToClosest.desc.id = "zBuyToClosestDesc"
    zCookies.objects.zBuyToClosest.desc.classList.add("zSelectionObjects");
    zCookies.objects.zBuyToClosest.element = document.createElement("input");
    zCookies.objects.zBuyToClosest.element.id = "zBuyToClosestElement";
    zCookies.objects.zBuyToClosest.element.classList.add("zSelectionObjects");
    zCookies.objects.zBuyToClosest.element.type = "checkbox";
    zCookies.objects.zBuyToClosest.element.classList.add("zCookies");
    zCookies.objects.zBuyToClosest.element.checked = false;
    zCookies.objects.zBuyToClosest.value = false;
    zCookies.objects.zBuyToClosest.wrapper = document.createElement("div");
    zCookies.objects.zBuyToClosest.wrapper.id = "zBuyToClosestWrapper";
    zCookies.objects.zBuyToClosest.wrapper.classList.add("zSelectionWrapper");
    zCookies.objects.zBuyToClosest.wrapper.classList.add("zCookies");
    zCookies.objects.zBuyToClosest.wrapper.appendChild(zCookies.objects.zBuyToClosest.desc);
    zCookies.objects.zBuyToClosest.wrapper.appendChild(zCookies.objects.zBuyToClosest.element);
    //zHandleGarden
    zCookies.objects.zHandleGarden.objWrapper1 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc = document.createElement("div");
    zCookies.objects.zHandleGarden.desc.innerText = 'Handle garden: ';
    zCookies.objects.zHandleGarden.desc.classList.add("zCookies");
    zCookies.objects.zHandleGarden.desc.id = "zHandleGardenDesc"
    zCookies.objects.zHandleGarden.desc.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element = document.createElement("select");
    zCookies.objects.zHandleGarden.element.id = "zHandleGardenElement";
    zCookies.objects.zHandleGarden.element.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element.innerHTML = '<option value=0>None</option>\n<option value=1>Harvesting</option>\n<option value=2>Planting</option>\n<option value=3>Both</option>';
    zCookies.objects.zHandleGarden.element.classList.add("zCookies");
    zCookies.objects.zHandleGarden.element.classList.add("blackText");
    zCookies.objects.zHandleGarden.value = 0;
    zCookies.objects.zHandleGarden.wrapper = document.createElement("div");
    zCookies.objects.zHandleGarden.wrapper.id = "zHandleGardenWrapper";
    zCookies.objects.zHandleGarden.wrapper.classList.add("zSelectionWrapper");
    zCookies.objects.zHandleGarden.wrapper.classList.add("zCookies");
    zCookies.objects.zHandleGarden.objWrapper1.appendChild(zCookies.objects.zHandleGarden.desc);
    zCookies.objects.zHandleGarden.objWrapper1.appendChild(zCookies.objects.zHandleGarden.element);
    //zHandleGarden - Part 2
    zCookies.objects.zHandleGarden.objWrapper2 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc2 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc2.innerText = 'Desired plant: ';
    zCookies.objects.zHandleGarden.desc2.classList.add("zCookies");
    zCookies.objects.zHandleGarden.desc2.id = "zHandleGardenDesc2"
    zCookies.objects.zHandleGarden.desc2.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element2 = document.createElement("select");
    zCookies.objects.zHandleGarden.element2.id = "zHandleGardenElement2";
    zCookies.objects.zHandleGarden.element2.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element2.innerHTML = '<option value=nil>nil</option>';
    zCookies.objects.zHandleGarden.element2.classList.add("zCookies");
    zCookies.objects.zHandleGarden.element2.classList.add("blackText");
    zCookies.objects.zHandleGarden.objWrapper2.appendChild(zCookies.objects.zHandleGarden.desc2);
    zCookies.objects.zHandleGarden.objWrapper2.appendChild(zCookies.objects.zHandleGarden.element2);
    //zHandleGarden - Part 3
    zCookies.objects.zHandleGarden.objWrapper3 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc3 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc3.innerText = 'Plant checkered: ';
    zCookies.objects.zHandleGarden.desc3.classList.add("zCookies");
    zCookies.objects.zHandleGarden.desc3.id = "zHandleGardenDesc3"
    zCookies.objects.zHandleGarden.desc3.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element3 = document.createElement("input");
    zCookies.objects.zHandleGarden.element3.id = "zHandleGardenElement3";
    zCookies.objects.zHandleGarden.element3.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element3.type = "checkbox";
    zCookies.objects.zHandleGarden.element3.classList.add("zCookies");
    zCookies.objects.zHandleGarden.element3.checked = false;
    zCookies.objects.zHandleGarden.checkered = false;
    zCookies.objects.zHandleGarden.objWrapper3.appendChild(zCookies.objects.zHandleGarden.desc3);
    zCookies.objects.zHandleGarden.objWrapper3.appendChild(zCookies.objects.zHandleGarden.element3);
    //zHandleGarden - Part 4
    zCookies.objects.zHandleGarden.objWrapper4 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc4 = document.createElement("div");
    zCookies.objects.zHandleGarden.desc4.innerText = '´Reserve cookies: ';
    zCookies.objects.zHandleGarden.desc4.classList.add("zCookies");
    zCookies.objects.zHandleGarden.desc4.id = "zHandleGardenDesc4"
    zCookies.objects.zHandleGarden.desc4.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element4 = document.createElement("input");
    zCookies.objects.zHandleGarden.element4.id = "zHandleGardenElement4";
    zCookies.objects.zHandleGarden.element4.classList.add("zSelectionObjects");
    zCookies.objects.zHandleGarden.element4.type = "checkbox";
    zCookies.objects.zHandleGarden.element4.classList.add("zCookies");
    zCookies.objects.zHandleGarden.element4.checked = false;
    zCookies.objects.zHandleGarden.reserve = false;
    zCookies.objects.zHandleGarden.objWrapper4.appendChild(zCookies.objects.zHandleGarden.desc4);
    zCookies.objects.zHandleGarden.objWrapper4.appendChild(zCookies.objects.zHandleGarden.element4);
    //wrap
    zCookies.objects.zHandleGarden.wrapper.appendChild(zCookies.objects.zHandleGarden.objWrapper1);
    zCookies.objects.zHandleGarden.wrapper.appendChild(zCookies.objects.zHandleGarden.objWrapper2);
    zCookies.objects.zHandleGarden.wrapper.appendChild(zCookies.objects.zHandleGarden.objWrapper3);
    //zMenuHider
    zCookies.objects.zMenuHider.element = document.createElement("button");
    zCookies.objects.zMenuHider.element.innerText = "Toggle Menu";
    zCookies.objects.zMenuHider.element.id = "zMenuHiderElement";
    zCookies.objects.zMenuHider.element.classList.add("zCookies");
    //zCookies.objects.zMenuHider.value = true;
    //zMenuLocation
    zCookies.objects.zMenuLocation.element = document.createElement("button");
    zCookies.objects.zMenuLocation.element.innerText = "Toggle Menu Location";
    zCookies.objects.zMenuLocation.element.id = "zMenuLocationElement";
    zCookies.objects.zMenuLocation.element.classList.add("zCookies");
    zCookies.objects.zMenuLocation.value = false;
    //menuLocation funcs
    //zWrinklerInput
    zCookies.objects.wrinklerInput.inputBox.id = "zWrinklerInput";
    zCookies.objects.wrinklerInput.inputBox.type = "number";
    zCookies.objects.wrinklerInput.inputBox.classList.add("zCookies");
    zCookies.objects.wrinklerInput.inputBox.classList.add("framed");
    zCookies.objects.wrinklerInput.inputBox.placeholder = "Enter Pop Value"
    zCookies.objects.wrinklerInput.inputBox.value = zCookies.variables.wrinklerThreshold;
    //zMenuLocation.fixStyling()
    zCookies.objects.zMenuLocation.fixStyling = function (mode) {
      var tmpAll = document.getElementsByClassName('zCookies');
      var tmpBorder = document.getElementsByClassName('potentialBorderObject');
      var style = ''
      var fontSize = '11px'
      var borderMode = false;
      if (mode === undefined || mode === null) {
        mode = zCookies.objects.zMenuLocation.value;
      }
      if (mode == false) {
        style = 'block';
        fontSize = '11px';
        borderMode = false;
      } else {
        style = 'inline-block';
        fontSize = '13px';
        borderMode = true;
      }
      for (var i = 0; i < zLastWrapper.childElementCount; i++) {
        zLastWrapper.childNodes[i].style.display = style
      }
      for (var i = 0; i < zNextWrapper.childElementCount; i++) {
        zNextWrapper.childNodes[i].style.display = style
      }
      for (var i = 0; i < zSelectionContainer.childElementCount; i++) {
        zSelectionContainer.childNodes[i].style.display = style
      }
      for (var i = 0; i < tmpAll.length; i++) {
        tmpAll[i].style.fontSize = fontSize
      }
      for (var i = 0; i < tmpBorder.length; i++) {
        if (borderMode) {
          tmpBorder[i].classList.add('borderHandler');
        } else {
          tmpBorder[i].classList.remove('borderHandler');
        }
      }
    }
    //eventListeners
    zCookies.objects.zPurchaseTarget.element.addEventListener("change", zCookies.objects.zPurchaseTarget.update);
    zCookies.objects.zBuyProducts.element.addEventListener("change", zCookies.objects.zBuyProducts.update);
    zCookies.objects.zBuyUpgrades.element.addEventListener("change", zCookies.objects.zBuyUpgrades.update);
    zCookies.objects.zBuyToClosest.element.addEventListener("change", zCookies.objects.zBuyToClosest.update);
    zCookies.objects.zMenuHider.element.addEventListener("click", zCookies.objects.zMenuHider.toggle);
    zCookies.objects.zMenuLocation.element.addEventListener("click", zCookies.objects.zMenuLocation.toggle);
    zCookies.objects.zHandleGarden.element.addEventListener("change", zCookies.objects.zHandleGarden.update);
    zCookies.objects.zHandleGarden.element2.addEventListener("change", zCookies.objects.zHandleGarden.updateDesiredPlant);
    zCookies.objects.zHandleGarden.element3.addEventListener("change", zCookies.objects.zHandleGarden.toggleCheckered);
    zCookies.objects.wrinklerInput.inputBox.addEventListener("change",function(){zCookies.variables.wrinklerThreshold = parseInt(zCookies.objects.wrinklerInput.inputBox.value),document.getElementById("wrinklerInfoAppendPoint").innerText = zCookies.hmsCalc(zCookies.variables.wrinklerThreshold,false,0)});

  },
  zFunctions: {
    buyBulk: async function(objectID){
      if(zCookies.objects.zBuyProducts.value && Game.buyMode == 1 && Math.floor(Game.cookies) >= zDatabase.nextProductPrice) {
        var tmpPrice = Beautify(zDatabase.nextProductPrice);
        var oldAmount = Game.ObjectsById[objectID].amount;
        Game.ObjectsById[objectID].buy(zCookies.objects.zPurchaseTarget.value);
        zCookies.variables.zLastProductTime = new Date();
        zCookies.variables.zLastProductHumanTime = zCookies.humanReadableTime(zCookies.variables.zLastProductTime);
        zInfoAreaLastProduct.innerText = "Last product: \n"+Game.ObjectsById[objectID].name+" (x"+(Game.ObjectsById[objectID].amount - oldAmount).toString()+")\n"+tmpPrice+"\n"+zCookies.variables.zLastProductHumanTime;
        zCookies.variables.zProducts = document.getElementsByClassName("product");
      }
    },
    buyToClosest: async function(objectID){
      if (zCookies.objects.zBuyProducts.value && Game.buyMode == 1 && Math.floor(Game.cookies) >= zDatabase.nextProductPrice) {
        var tmpPrice = Beautify(zDatabase.nextProductPrice);
        var oldAmount = Game.ObjectsById[objectID].amount
        Game.ObjectsById[objectID].buy(zCookies.objects.zPurchaseTarget.value-(Game.ObjectsById[objectID].amount%zCookies.objects.zPurchaseTarget.value));
        zCookies.variables.zLastProductTime = new Date();
        zCookies.variables.zLastProductHumanTime = zCookies.humanReadableTime(zCookies.variables.zLastProductTime);
        zInfoAreaLastProduct.innerText = "Last product: \n"+Game.ObjectsById[objectID].name+" (x"+(Game.ObjectsById[objectID].amount - oldAmount)+")\n"+tmpPrice+"\n"+zCookies.variables.zLastProductHumanTime;
        zCookies.variables.zProducts = document.getElementsByClassName("product");
      }
    },
    nextPurchase: function(skipTimeout){
      if(skipTimeout === undefined || skipTimeout === null){skipTimeout = false}
      var minPriceBULK = Number.POSITIVE_INFINITY;
      var minPriceSINGLE = Number.POSITIVE_INFINITY;
      var minPriceMISSING = Number.POSITIVE_INFINITY;
      var buyAmt = zCookies.objects.zPurchaseTarget.value;
      for(var i = Game.ObjectsById.length -1;i >= 0 ;i--){
        var tmpObj = Game.ObjectsById[i];
        if(tmpObj.getSumPrice(buyAmt) < minPriceBULK){
          zDatabase.nextBulkProduct = Game.ObjectsById[i];
          minPriceBULK = tmpObj.getSumPrice(buyAmt);
        }
        if(tmpObj.amount%buyAmt != 0 && tmpObj.getSumPrice(1) < minPriceSINGLE){
            zDatabase.nextSingleProduct = Game.ObjectsById[i];
            minPriceSINGLE = tmpObj.getSumPrice(1);
        }
        if(tmpObj.amount == 0 && tmpObj.getSumPrice(1) < minPriceMISSING){
          zDatabase.nextMissingProduct = Game.ObjectsById[i];
          minPriceMISSING = tmpObj.getSumPrice(1);
        }
      }
      var nextTarget = 0;
      var nextName = '';
      var nextAmount = 0;
      if(minPriceMISSING < minPriceBULK && minPriceMISSING < minPriceSINGLE){
        nextAmount = 1;
        nextTarget = zDatabase.nextMissingProduct.getSumPrice(nextAmount);
        nextName = zDatabase.nextMissingProduct.name;
        zDatabase.nextProduct = zDatabase.nextMissingProduct;
        zDatabase.nextProductPrice = nextTarget;
      }
      else if(zCookies.objects.zBuyToClosest.value == true && minPriceSINGLE < minPriceBULK){
        nextAmount = 1;
        nextTarget = zDatabase.nextSingleProduct.getSumPrice(nextAmount);
        nextName = zDatabase.nextSingleProduct.name;
        zDatabase.nextProduct = zDatabase.nextSingleProduct;
        zDatabase.nextProductPrice = nextTarget;
      }else{
        nextAmount = buyAmt;
        nextTarget = zDatabase.nextBulkProduct.getSumPrice(nextAmount);
        nextName = zDatabase.nextBulkProduct.name;
        zDatabase.nextProduct = zDatabase.nextBulkProduct;
        zDatabase.nextProductPrice = nextTarget;
      }
      var formattedPrice = Beautify(zDatabase.nextProductPrice)
      var doReturn = false;
      var retHTML = ''
      if(zCookies.objects.zBuyProducts.value == true){
        doReturn = true;
        if(Game.cookiesPs > 0){
          var msg = zCookies.hmsCalc(((nextTarget-Game.cookies)/Game.cookiesPs),false,0);
          retHTML= "Next purchase:"+'<div class="topSpacer"></div>'+nextName+" (x"+nextAmount+")<br/>"+formattedPrice+"<br/>"+msg;
        }else{
          if(zCookies.objects.zMenuLocation.value){retHTML= "Next purchase:<br><br><br>Waiting for cookies.."}else{retHTML= "Next purchase:<br>Waiting for cookies.."}
        }
      }else{
        doReturn = true;
        if(zCookies.objects.zMenuLocation.value){retHTML= "Next purchase:<br><br><br>Not buying products."}else{retHTML= "Next purchase:<br> Not buying products."}
      }
      if(!skipTimeout){
        setTimeout(zCookies.zFunctions.nextPurchase,500);
      }
      if(doReturn){
        return [true,retHTML]
      }else{
        return[false,"null"]
      }
    },
    nextUpgrade: function(skipTimeout){
      if(skipTimeout === undefined || skipTimeout === null){skipTimeout = false}
      var minPrice = Number.POSITIVE_INFINITY;
      var upgradeAvailable = false;
      for(var i in Game.UpgradesById){
        var tmpObj = Game.UpgradesById[i];
        if(tmpObj.unlocked == 1 && tmpObj.bought == 0 && tmpObj.getPrice() < minPrice && tmpObj.pool != "toggle"){
          zDatabase.nextUpgrade = Game.UpgradesById[i];
          minPrice = tmpObj.getPrice();
          if(upgradeAvailable==false){upgradeAvailable=true;}
        }
      }
      var msg = 'N/A'
      if(upgradeAvailable){
        try{
          msg = zCookies.hmsCalc(((zDatabase.nextUpgrade.getPrice()-Game.cookies)/Game.cookiesPs),false,0);
        }catch(error){
          console.log(error);
        }
      }
      var doReturn = false;
      var retHTML = ''
      var formattedPrice = Beautify(zDatabase.nextUpgrade.getPrice());
      if(zCookies.objects.zBuyUpgrades.value == true){
        doReturn = true;
        if(Game.cookiesPs > 0){
          retHTML = "Next upgrade:"+'<div class="topSpacer"></div>'+zDatabase.nextUpgrade.name+"<br/>"+formattedPrice+"<br/>"+msg; 
        }else{
          if(zCookies.objects.zMenuLocation.value){retHTML = "Next upgrade:<br><br><br>Waiting for cookies.."}else{retHTML = "Next upgrade:<br>Waiting for cookies.."};
        }
      }else{
        doReturn = true;
        if(zCookies.objects.zMenuLocation.value){retHTML = "Next upgrade:<br><br><br>Not buying upgrades."}else{retHTML = "Next upgrade:<br>Not buying upgrades."}
      }
      if(!skipTimeout){
      setTimeout(zCookies.zFunctions.nextUpgrade,500);
      }
      if(doReturn){
        return [true,retHTML]
      }else{
        return[false,"null"]
      }
    },//endNextUpg
    updateSubtitle: function(){
      zInfoAreaFlavour.innerText = zCookies.variables.zFlavourText[(Math.floor(Math.random() * zCookies.variables.zFlavourText.length))]
      setTimeout(zCookies.zFunctions.updateSubtitle,10000);
    },//end subtitle
    updateUI: async function(skipTimeout){
      if(skipTimeout === undefined || skipTimeout === null){skipTimeout = false}
      var purchaseData = await zCookies.zFunctions.nextPurchase(true);
      var upgradeData = await zCookies.zFunctions.nextUpgrade(true);
      var plantData = await zCookies.zFunctions.nextPlant(true);
      var tmpCollection = document.getElementsByClassName('borderHandler');
      for(var i = 0; i < tmpCollection.length; i++){
        var currentParent = tmpCollection[i].parentElement.children;
        var lastOfType = ''
        for(var x = 0; x < currentParent.length; x++){
          if(currentParent[x].classList.contains('borderHandler')){
            lastOfType = currentParent[x];
          }
        }
        if(tmpCollection[i] == lastOfType){tmpCollection[i].classList.add('lastBorderHandler')}
        else if(tmpCollection[i].classList.contains('lastBorderHandler')){tmpCollection[i].classList.remove('lastBorderHandler')}
      }
      //Update info area
      zPerc = Game.ascendMeterPercent*100;
      if(zPerc < 10){
        zPercMsg = "0"+zPerc.toFixed(2);
      }else{
        zPercMsg = zPerc.toFixed(2);
      }
      var lvlMsg = ''
      if(Game.ascendMeterLevel >= 1 || Game.prestige > 0){lvlMsg = Beautify(Game.ascendMeterLevel) + " (+"+Beautify(parseFloat((Game.ascendMeterLevel/Game.prestige)*100),2)+"%)"}
      zInfoAreaProgressPercent.innerHTML = lvlMsg+"<br>"+zPercMsg + "% to next level<br>Current bonus: "+Beautify(parseFloat(Game.prestige)*Game.heavenlyPower*Game.GetHeavenlyMultiplier(),2)+"%<br>After ascension: " + Beautify(((parseFloat(Game.prestige) * Game.heavenlyPower * Game.GetHeavenlyMultiplier())*(1+(parseFloat((Game.ascendMeterLevel / Game.prestige))))), 2) + "%";
      await zCookies.zFunctions.wrinklerUI();
      //CPC
      zInfoAreaClickPower.innerText = "CpC: "+Beautify(Game.computedMouseCps,1)+"\n("+Beautify((Game.computedMouseCps/Game.cookiesPs)*100,2)+"% of CPS)";
      if((Game.computedMouseCps/Game.cookiesPs)<0.5){zInfoAreaClickPower.style.textShadow = "red 0px 0px 3px";zInfoAreaClickPower.style.color="red"}else if((Game.computedMouseCps/Game.cookiesPs)<1){zInfoAreaClickPower.style.textShadow = "yellow 0px 0px 3px";zInfoAreaClickPower.style.color="yellow"}else{zInfoAreaClickPower.style.textShadow = "lime 0px 0px 3px";zInfoAreaClickPower.style.color="lime"}
      //CPS
      zInfoAreaCPS.innerText = "Cur CPS: "+(Beautify(Game.cookiesPs,3));
      if((Game.cookiesPs/Game.cookiesPsRaw)<1){zInfoAreaCPS.style.textShadow = "red 0px 0px 3px";zInfoAreaCPS.style.color="red"}else if((Game.cookiesPs/Game.cookiesPsRaw) == 1){zInfoAreaCPS.style.textShadow = "yellow 0px 0px 3px";zInfoAreaCPS.style.color="yellow"}else{zInfoAreaCPS.style.textShadow = "lime 0px 0px 3px";zInfoAreaCPS.style.color="lime"}
      //CPSRaw
      zInfoAreaCPSRaw.innerText = "Raw CPS: " + (Beautify(Game.cookiesPsRaw, 3));
      if(purchaseData[0]){zInfoAreaNextPurchase.innerHTML=purchaseData[1]}
      if(upgradeData[0]){zInfoAreaNextUpgrade.innerHTML=upgradeData[1]}
      if(plantData[0]){zInfoAreaNextPlant.innerHTML=plantData[1]}
      zCookies.objects.zHandleGarden.update()
      if(!skipTimeout){
        setTimeout(zCookies.zFunctions.updateUI,zDatabase.UITimeout);
      }
    },
    //update UITimeout
    updateUITimeout: function(toggle){
      if(toggle){
        zCookies.variables.lowPerfMode = !zCookies.variables.lowPerfMode;
      }
      if(zCookies.variables.lowPerfMode){
        zDatabase.UITimeout = 250
      }else{
        zDatabase.UITimeout = 33;
      }
    }, //end updateUITimeout
    //autoGarden 0.1
    handleGarden : async function(){
      if(zDatabase.unlockedPlants.length >= 1 && zCookies.objects.zHandleGarden.element2.value == 'nil'){
        await zCookies.objects.zHandleGarden.populateList(true);
        zCookies.objects.zHandleGarden.element2.value = zCookies.objects.zHandleGarden.element2.options[0].value
      }else{
        zCookies.objects.zHandleGarden.updateDesiredPlant()
      }
      if(Game.Objects['Farm'].minigame !== undefined && zDatabase.desiredPlant != 0){
        var tmpObj = Game.Objects['Farm'].minigame;
        var maxX = tmpObj.plot.length
        var maxY = 0
        var tmpPlot = [0,0];
        var currentPlant = new Object;
        var tmpDesiredPlant = zDatabase.desiredPlant;
        var tmpPlantedAmount = 0;
        var tmpPurchasedAmount = 0;
        var tmpPurchasedCost = 0;
        var handleHarvest = true;
        var handlePlanting = true;
        var doPlant = true;
        var plantAll = false;
        var tmpPlantList = new Object;
        if(zCookies.objects.zHandleGarden.element2.value == 'all'){
          plantAll = true;
          //zCookies.objects.zHandleGarden.updateDesiredPlant();
        }
        if(zCookies.objects.zHandleGarden.value == 0){
            handleHarvest = false;
            handlePlanting = false;
        }else if(zCookies.objects.zHandleGarden.value == 1){
            handleHarvest = true;
            handlePlanting = false;
        }else if(zCookies.objects.zHandleGarden.value == 2){
            handleHarvest = false;
            handlePlanting = true;
        }else{
            handleHarvest = true;
            handlePlanting = true;
        }
        if(handleHarvest || handlePlanting){
          for(var x = 0; x < maxX; x++){
            maxY = tmpObj.plot[x].length
            for(var y = 0; y < maxY; y++){
              tmpPlot = tmpObj.getTile(x,y);
              if(tmpPlot[0] >= 1){
                currentPlant = tmpObj.plantsById[tmpPlot[0]-1];
                tmpPlantedAmount++;
                //console.log(x+","+y+": "+true)
                if(tmpPlot[1] >= currentPlant.mature && handleHarvest){
                  tmpObj.harvest(x,y,true)
                  tmpPlantedAmount--;
                }
              }else{
                if(zCookies.objects.zHandleGarden.checkered){
                  if(Math.isEven(x) && Math.isEven(y)){
                    doPlant = true;
                  }else if(!Math.isEven(x) && !Math.isEven(y)){
                    doPlant = true;
                  }else{
                    doPlant = false;
                  }
                }
                if(doPlant && handlePlanting){
                  if(Math.floor(Game.cookies) > tmpObj.getCost(tmpDesiredPlant)){
                    if(plantAll){
                      tmpDesiredPlant = zDatabase.unlockedPlants[zCookies.variables.zPlantCounter];
                      if(zCookies.variables.zPlantCounter >= zDatabase.unlockedPlants.length){zCookies.variables.zPlantCounter = 0;}
                      zCookies.objects.zHandleGarden.updateDesiredPlant();
                    }
                    if(tmpObj.isTileUnlocked(x,y)){
                      tmpObj.seedSelected = tmpDesiredPlant.id
                      tmpObj.clickTile(x,y);
                      tmpPlantedAmount++;
                      tmpPurchasedAmount++;
                      zCookies.variables.zPlantCounter++;
                      if(plantAll){
                        if(tmpPlantList[tmpDesiredPlant.name] === undefined){
                          tmpPlantList[tmpDesiredPlant.name] = new Object;
                          tmpPlantList[tmpDesiredPlant.name].name = tmpDesiredPlant.name;
                          tmpPlantList[tmpDesiredPlant.name].amount = 0;
                        }
                        tmpPlantList[tmpDesiredPlant.name].amount++;
                      }
                      tmpPurchasedCost += tmpObj.getCost(tmpDesiredPlant);
                    }
                  }
                }
              }
            }
          }
        }
        if(tmpPurchasedAmount > 0){
          formattedPrice = Beautify(tmpPurchasedCost)
          var msg = ''
          if(plantAll){
            zDatabase.lastPlants = ""
            for(var i = 0; i < zDatabase.unlockedPlants.length; i++){
              if(tmpPlantList[zDatabase.unlockedPlants[i].name] !== undefined){
                tmpName = tmpPlantList[zDatabase.unlockedPlants[i].name].name;
                tmpAmt = tmpPlantList[zDatabase.unlockedPlants[i].name].amount;
                zDatabase.lastPlants += tmpName+" (x"+tmpAmt+")<br>"
              }
            }
            zDatabase.lastPlants += formattedPrice;
            msg = "Last plants:<br>"+"Click for info<br>"+formattedPrice+"<br>"+zCookies.humanReadableTime(new Date)+"";
          }else{
            msg = "Last plant:<br>"+tmpDesiredPlant.name+" (x"+tmpPurchasedAmount+")<br>"+formattedPrice+"<br>"+zCookies.humanReadableTime(new Date)+"";
            zDatabase.lastPlants = msg;
          }
          zInfoAreaLastPlant.innerHTML = msg;
        }
        zDatabase.currentPlantAmount = tmpPlantedAmount;
      }
    },
    //showPlant
    showLastPlant : function(){
      Game.Prompt("<h3>List of last plants</h3><br><br><p>The following plants were planted during the last phase:</p><br>"+zDatabase.lastPlants+"<br><br>",[['Ok','Game.ClosePrompt();']]);
    },
    //nextPlant
    nextPlant : function(skipTimeout){
      if(skipTimeout === undefined || skipTimeout === null){skipTimeout = false}
      var doReturn = false;
      var retHTML = ''
      if(zCookies.objects.zHandleGarden.value > 1 && !(Game.Objects['Farm'].minigame === undefined) && zDatabase.desiredPlant !== undefined){
        doReturn = true;
        if(zInfoAreaNextPlant.classList.contains('hidden')){
          zInfoAreaNextPlant.classList.remove('hidden')
          zInfoAreaNextPlant.classList.add('borderHandler');
          zInfoAreaNextPlant.classList.add('potentialBorderObject');
          zInfoAreaLastPlant.classList.remove('hidden');
          zInfoAreaLastPlant.classList.add('borderHandler');
          zInfoAreaLastPlant.classList.add('potentialBorderObject');
        }
        if(Game.cookiesPs > 0){
          var tmpObj = Game.Objects['Farm'].minigame;
          var tmpCost = tmpObj.getCost(zDatabase.desiredPlant);
          var formattedPrice = Beautify(tmpCost);
          var msg = "N/A";
          msg = zCookies.hmsCalc((tmpCost-Math.floor(Game.cookies))/Game.cookiesPs,false,0);
          retHTML = "Next plant:"+'<div class="topSpacer"></div>'+zDatabase.desiredPlant.name+"<br/>"+formattedPrice+"<br/>"+msg;
        }else{
          if(zCookies.objects.zMenuLocation.value){retHTML = 'Next plant:<br><br><br>Waiting for cookies..'}else{retHTML = 'Next plant:<br>Waiting for cookies..'}
        }
      }else if(Game.Objects['Farm'].minigame === undefined){
        doReturn = true;
        //if(zMenuLocation.value){retHTML = '<br><br><br><br>'}else{retHTML = ''}
        zInfoAreaNextPlant.classList.add('hidden');
        zInfoAreaNextPlant.classList.remove('borderHandler');
        zInfoAreaNextPlant.classList.remove('potentialBorderObject');
        zInfoAreaLastPlant.classList.add('hidden');
        zInfoAreaLastPlant.classList.remove('borderHandler');
        zInfoAreaLastPlant.classList.remove('potentialBorderObject');
      }else if(zDatabase.desiredPlant === undefined){
        doReturn = true;
        if(zCookies.objects.zMenuLocation.value){retHTML = 'Next plant:<br><br>Error:<br>Desired plant undefined.'}else{retHTML = 'Next plant:<br>Error:<br>Desired plant undefined.'}
      }else{
        doReturn = true;
        if(zCookies.objects.zMenuLocation.value){retHTML = 'Next plant:<br><br><br>Not buying plants.'}else{retHTML = 'Next plant:<br>Not buying plants.'}
      }
      if(!skipTimeout){
        setTimeout(zCookies.zFunctions.nextPlant,500);
      }
      if(doReturn){
        return [true,retHTML]
      }else{
        return[false,"null"]
      }
    },
    //wrinklerPopper
    wrinklePopper : function(force){
  if(force === undefined || force === null){
    force = false;
  }
  if(zDatabase.wrinklerHoard >= (Game.cookiesPsRaw * zCookies.variables.wrinklerThreshold) || force == true){
    var changed=false;
    if(zCookies.objects.zBuyProducts.element.checked){
      zCookies.objects.zBuyProducts.element.checked=false;
      changed=true;
      zCookies.objects.zBuyProducts.update();
    }
    for(var i = Game.wrinklers.length-1; i >= 0 ;i--){
      Game.wrinklers[i].hp = 0;
    }
    if(changed){
      zCookies.objects.zBuyProducts.element.checked = true;
      setTimeout(zCookies.objects.zBuyProducts.update,1000);
    }
    return true;
  }else{
    return false;
  }
    },
    wrinklerHelp : function(){
      Game.Prompt("<h3>Wrinkler Autopop</h3><br><br><p>Wrinklers are currently automatically popped when they contain <zCode id='wrinklerInfoAppendPoint'>"+zCookies.hmsCalc(zCookies.variables.wrinklerThreshold,false,0)+"</zCode>worth of cookie produciton.</p><br><p>To change this, enter the value below.<br><zCode id='appendPoint'>"+setTimeout(function(){document.getElementById("appendPoint").innerText='';document.getElementById("appendPoint").append(zCookies.objects.wrinklerInput.inputBox)},50)+"</zCode></p><br><p>This value is saved.</p><br><p>Purchasing of products is paused for one second after popping, in order to avoid issues with bulk purchasing.</p><br><br>",[['Pop now!','zCookies.zFunctions.wrinklePopper(true);Game.ClosePrompt();'],['Ok','Game.ClosePrompt();']]);
    },
    wrinklerUI: function() {
      zDatabase.wrinklerHoard = 0;
      for(var i = 0;i < Game.wrinklers.length; i++){
        zDatabase.wrinklerHoard += Game.wrinklers[i].sucked
      }
      var wrinklerInf = zCookies.hmsCalc((zDatabase.wrinklerHoard/Game.cookiesPsRaw),false,0);
      if(zCookies.objects.zMenuLocation.value){
        zInfoAreaWrinklerInfo.innerText = "Wrinklers: "+wrinklerInf+" | Autopop threshold: "+zCookies.hmsCalc(zCookies.variables.wrinklerThreshold,false,0)+" | Amount: "+Beautify(zDatabase.wrinklerHoard)+" (+"+Beautify((zDatabase.wrinklerHoard/Game.cookies)*100,2)+"%)";
      }else{
        zInfoAreaWrinklerInfo.innerText = "Wrinklers: "+wrinklerInf+"\nAutopop threshold: "+zCookies.hmsCalc(zCookies.variables.wrinklerThreshold,false,0)+"\nAmount: "+Beautify(zDatabase.wrinklerHoard)+" (+"+Beautify((zDatabase.wrinklerHoard/Game.cookies)*100,2)+"%)";
      }
    },
    toggleSlowMode : function(){
      var mode = '<redText>off</redText>'
      var other = "<greenText>on</greenText>"
      if(zCookies.variables.lowPerfMode){mode = "<greenText>on</greenText>";other = "<redText>off</redText>"}
      Game.Prompt("<h3>Toggle Low Performance Mode.</h3><br><br><p>Low performance mode is currently: "+mode+"</p><br><p>Low performance mode limits UI updates to 4/second, as opposed to 60/second.</p><br><br>",[['Toggle '+other,'zCookies.zFunctions.updateUITimeout(true);Game.ClosePrompt();'],['Cancel','Game.ClosePrompt();']]);
    }
  },//end zFuncs
  hmsCalc:function(query, milliseconds, method){
      var tmpVal = 0;
      var retStr = '';
      var timeTable = ["y", "d", "h", "m", "s", "ms"];
      if (!milliseconds) {
        var hmsTable = [0, 0, 0, 0, 0];
        var divTable = [31536000, 86400, 3600, 60, 1];
      } else {
        var hmsTable = [0, 0, 0, 0, 0, 0];
        var divTable = [31536000000, 86400000, 3600000, 60000, 1000, 1];
      }
      if (query < 1) {
        retStr = "00" + timeTable[hmsTable.length - 1];
      } else {
        for (var i = 0; i < divTable.length; i++) {
          if (query >= divTable[i]) {
            tmpVal = Math.floor(query / divTable[i]);
            hmsTable[i] = tmpVal;
            query -= divTable[i] * tmpVal;
            if (hmsTable[i] > 0 && timeTable[i]) {
              if (hmsTable[i] < 10) {
                retStr += "0"
              }
              retStr += (hmsTable[i] + timeTable[i] + " ")
            }
          }
        }
      }
      switch (method) {
        case 0: return retStr; break;
        case 1: return hmsTable; break;
        default: return retStr, hmsTable; break;
      }
  },//end hmsCalc§
  zBarUpdater: function() {
    zBarText.innerText = 10 * zBar.value;
    zCookies.variables.zTimerValue = parseInt(10 * zBar.value);
  },
  zCheckName: function () {
    if (zCookies.variables.nameSet == false || zCookies.variables.nameSet === undefined || zCookies.variables.nameSet === null) {
      Game.bakeryNameSet('Cookie Bot');
      zCookies.variables.nameSet = true
    }
  },
  //async sleep
  zSleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  //convert time to human readable format
  humanReadableTime: function(timeObject) {
    hRT = [];
    if (timeObject.getDate() < 10) { hRT.push("0" + timeObject.getDate().toString()) } else { hRT.push(timeObject.getDate().toString()) }
    if (timeObject.getMonth() + 1 < 10) { hRT.push("0" + (timeObject.getMonth() + 1).toString()) } else { hRT.push((timeObject.getMonth() + 1).toString()) }
    hRT.push(timeObject.getFullYear().toString());
    if (timeObject.getHours() < 10) { hRT.push("0" + timeObject.getHours().toString()) } else { hRT.push(timeObject.getHours()) }
    if (timeObject.getMinutes() < 10) { hRT.push("0" + timeObject.getMinutes().toString()) } else { hRT.push(timeObject.getMinutes()) }
    if (timeObject.getSeconds() < 10) { hRT.push("0" + timeObject.getSeconds().toString()) } else { hRT.push(timeObject.getSeconds()) }
    retString = hRT[2].toString() + "/" + hRT[1].toString() + "/" + hRT[0].toString() + " - " + hRT[3].toString() + ":" + hRT[4].toString() + ":" + hRT[5].toString();
    return retString;
  },
  zInfoAreaToggler: function() {
    if (zCookies.objects.zMenuLocation.value == true) {
      if (Game.onMenu != '') {
        if (zInfoArea.style.display != 'none') {
          zInfoArea.style.display = 'none';
        }
      } else {
        zInfoArea.style.display = ''
      }
    }
    zCookies.objects.zMenuLocation.fixStyling();
  },//end zInfoAreaToggler
  mainLoop: async function() {
    if(zDatabase.init == false){
      await zCookies.objects.zHandleGarden.populateList(true)
      await zCookies.zSleep(50);
      zCookies.objects.zHandleGarden.update()
      zDatabase.init = true
      setTimeout(zCookies.mainLoop, zCookies.variables.zTimerValue);
      return
    }
    if (Game.OnAscend == 0 && zCookies.variables.zRunLoop) {
      try {
        //buy next upgrade.
        if (zCookies.objects.zBuyUpgrades.value == true && Math.floor(Game.cookies) >= zDatabase.nextUpgrade.getPrice()) {
          var overrideMode = false;
          if (zDatabase.overrideIDs.includes(zDatabase.nextUpgrade.id)) {
            overrideMode = true;
          }
          Game.UpgradesById[zDatabase.nextUpgrade.id].buy(overrideMode);
          if (zDatabase.nextUpgrade.name != 'N/A') {
            zInfoAreaLastUpgrade.innerText = "Last ugprade:\n" + zDatabase.nextUpgrade.name + "\n" + Beautify(zDatabase.nextUpgrade.getPrice()) + "\n" + zCookies.humanReadableTime(new Date);
          }
          await zCookies.zSleep(50);
          //await zCookies.zFunctions.updateUI(true);
        }
        //Try to buy 10 deepest product, then go on to do the same to product#-1
        if (zCookies.objects.zBuyProducts) {

          if (zCookies.objects.zBuyToClosest.value == false) {
            await zCookies.zFunctions.buyBulk(zDatabase.nextProduct.id);
            await zCookies.zSleep(50);
          } else {
            if (Game.ObjectsById[zDatabase.nextProduct.id].amount % zCookies.objects.zPurchaseTarget.value > 0) {
              await zCookies.zFunctions.buyToClosest(zDatabase.nextProduct.id);
            } else {
              await zCookies.zFunctions.buyBulk(zDatabase.nextProduct.id);
            }
            await zCookies.zSleep(50);
          }
          //await zCookies.zFunctions.updateUI(true);
        }
        //popWrinklers
        if (await zCookies.zFunctions.wrinklePopper()) { await zCookies.zSleep(50); }
        //pop golden
        if (Game.shimmers.length > 0) {
          for (i = 0; i < Game.shimmers.length; i++) {
            zCookies.variables.zLastShimmerTime = new Date();
            zCookies.variables.zLastShimmerHumanTime = zCookies.humanReadableTime(zCookies.variables.zLastShimmerTime);
            var zType = Game.shimmers[i].type.toString()
            var formattedLines = '';
            var lastType = ''
            Game.shimmers[i].pop();
            if (zCookies.objects.zMenuLocation.value == true) {
              formattedLines = "\n\n"
            } else {
              formattedLines = "\n"
            }
            if (zType != 'golden' && zType != '' && Game.shimmerTypes[zType].last === undefined || Game.shimmerTypes[zType].last === null) {
              lastType = '[error: failed to grab last type]'
            } else if (zType == 'reindeer') {
              lastType = zType;
            } else {
              lastType = Game.shimmerTypes[zType].last.toString()
            }
            zInfoAreaLastShimmer.innerText = "Last shimmer: \n" + lastType + formattedLines + zCookies.variables.zLastShimmerHumanTime;
            //          }
          }
        }
        //collect lumps
        if (Game.lumpT < (new Date).getTime() - Game.lumpRipeAge) { Game.clickLump(); await zCookies.zSleep(50); }
        //HandleGarden
        if (zCookies.objects.zHandleGarden.value > 0) {
          await zCookies.zFunctions.handleGarden();
        }
      } catch (error) {
        console.log(error)
        //zProducts = document.getElementsByClassName("product");
        //zUpgrades = document.getElementsByClassName("upgrade");
      }
      //Call self
      //zDBMan.save();
    } else if (Game.OnAscend == 1 && zCookies.variables.zRunLoop) {
      zCookies.zDBMan.setDefaults(false);
    } else if (!zCookies.variables.zRunLoop) {
      if (Game.ascendMeterLevel >= 1) { var lvlMsg = Beautify(Game.ascendMeterLevel) + " (+" + Beautify(parseFloat((Game.ascendMeterLevel / Game.prestige) * 100), 2) + "%)" } else { var lvlMsg = '' }
      zInfoAreaProgressPercent.innerText = "PAUSED\n" + lvlMsg + "\n" + zPercMsg + "% to next level\nCurrent bonus: " + Beautify(parseFloat(Game.prestige) * Game.heavenlyPower * Game.GetHeavenlyMultiplier(), 2) + "%\nAfter ascension: " + Beautify(((parseFloat(Game.prestige) * Game.heavenlyPower * Game.GetHeavenlyMultiplier())*(1+(parseFloat((Game.ascendMeterLevel / Game.prestige))))), 2) + "%";
    }
    setTimeout(zCookies.mainLoop, zCookies.variables.zTimerValue);
  },
});


function Beautify(val, floats) {
  //required for some reason
  var fixed = val.toFixed(floats);
  if (floats > 0 && fixed == val + 1) val++;
  //check if above/below +/-1000
  if (val > zDatabase.zSciVal || val < -zDatabase.zSciVal) {
    return val.toExponential(3).replace("+", '')
  } else {
    return val.toFixed(floats).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  }
}

